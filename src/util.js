require('dotenv').config();
const tumblr = require('tumblr.js');

const createClient = () => {
  // console.log(process.env.INK_QUOTES_CONSUMER_KEY);
  // console.log(process.env.INK_QUOTES_CONSUMER_SECRET);
  // console.log(process.env.INK_QUOTES_TOKEN);
  // console.log(process.env.INK_QUOTES_TOKEN_SECRET);

  const client = tumblr.createClient({
    credentials: {
      consumer_key: process.env.INK_QUOTES_CONSUMER_KEY,
      consumer_secret: process.env.INK_QUOTES_CONSUMER_SECRET,
      token: process.env.INK_QUOTES_TOKEN,
      token_secret: process.env.INK_QUOTES_TOKEN_SECRET,
    },
    returnPromises: true,
  });

  return client;
};

const returnPostSpecificFields = (post) => {
  switch (post.type) {
    case 'text': {
      const { body } = post;
      return { body };
    }
    case 'answer': {
      const {
        asking_name: askingName,
        answer,
        question,
      } = post;
      return { askingName, answer, question };
    }
    case 'photo': {
      const {
        image_permalink: imagePermalink,
        photos,
      } = post;
      return { imagePermalink, photos };
    }
    case 'quote': {
      const { quote } = post;
      return { quote };
    }
    default:
      throw new Error(`returnPostSpecificFields - unknown post type: ${post.type}`);
  }
};

const returnPostSpecificBody = (postFields, postSpecificFields) => {
  switch (postFields.type) {
    case 'text': {
      return postSpecificFields.body;
    }
    case 'answer': {
      let body;
      body += `User: ${postSpecificFields.asking_name}\n`;
      body += `Question: ${postSpecificFields.question}\n\n`;
      body += `Answer: ${postSpecificFields.answer}\n\n`;
      return body;
    }
    case 'photo': {
      const { postUrl } = postFields;
      return postUrl;
    }
    case 'quote': {
      const { quote } = postFields;
      return quote;
    }

    default:
      throw new Error(`returnPostSpecificBody - unknown post type: ${postFields.type}`);
  }
};

const returnPostHead = (postFields) => {
  const postFieldKeys = Object.keys(postFields);

  const headInitial = '---\n';
  let headBody = '';
  const headEnd = '---\n\n';

  postFieldKeys.forEach((postFieldKey) => {
    headBody += `${postFieldKey}: "${postFields[postFieldKey]}"\n`;
  });
  return `${headInitial}${headBody}${headEnd}`;
};

const generateOffsetArray = (totalAmount) => {
  const iterationsAmount = Math.floor(totalAmount / 20);
  const iterationsArray = Array.from(Array(iterationsAmount).keys());

  const { offsetArray } = iterationsArray.reduce((acc) => {
    const newOffset = acc.offset + 20;
    return {
      offset: newOffset,
      offsetArray: acc.offsetArray.concat({ offset: newOffset }),
    };
  }, { offset: 20, offsetArray: [{ offset: 20 }] });

  return offsetArray;
};


const formatPost = (postFields, postSpecificFields) => {
  try {
    const head = returnPostHead(postFields);
    const body = returnPostSpecificBody(postFields, postSpecificFields);

    return `${head}${body}`;
  } catch (error) {
    throw new Error(`formatPost - ${error}`);
  }
};

const processPost = (post) => {
  try {
    const postFields = {
      id: post.id,
      blogName: post.blog_name,
      type: post.type,
      title: post.title,
      summary: post.summary,
      date: post.date,
      slug: post.slug,
      state: post.state,
      tags: post.tags,
      shortUrl: post.short_url,
      postUrl: post.post_url,
      noteCount: post.note_count,
      format: post.format,
    };

    const postString = formatPost(postFields, returnPostSpecificFields(post));
    return { postFields, postString };
  } catch (error) {
    throw new Error(`processPost - ${error}`);
  }
};

module.exports = {
  createClient,
  processPost,
  generateOffsetArray,
};
