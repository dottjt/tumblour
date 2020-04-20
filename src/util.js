require('dotenv').config();
const tumblr = require('tumblr.js');
const winston = require('winston');

const createLogger = () => {
  winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
      //
      // - Write all logs with level `error` and below to `error.log`
      // - Write all logs with level `info` and below to `combined.log`
      //
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' }),
    ],
  });
};

const createClient = (type) => {
  try {
    let token;
    let tokenSecret;
    switch (type) {
      case 'INK_QUOTES':
        token = process.env.INK_QUOTES_TOKEN;
        tokenSecret = process.env.INK_QUOTES_TOKEN_SECRET;
        break;
      case 'BROKEN_HEARTS_AND_FRACTURED_SMILES':
        token = process.env.BROKEN_HEARTS_AND_FRACTURED_SMILES_TOKEN;
        tokenSecret = process.env.BROKEN_HEARTS_AND_FRACTURED_SMILES_TOKEN_SECRET;
        break;
      case 'BLACK_WHITE_INK_CURVES':
        token = process.env.BLACK_WHITE_INK_CURVES_TOKEN;
        tokenSecret = process.env.BLACK_WHITE_INK_CURVES_TOKEN_SECRET;
        break;
      case 'TKTXTKTX':
        token = process.env.TKTXTKTX_TOKEN;
        tokenSecret = process.env.TKTXTKTX_TOKEN_SECRET;
        break;
      case 'SWEET_CHERRY_EROTICA':
        token = process.env.SWEET_CHERRY_EROTICA_TOKEN;
        tokenSecret = process.env.SWEET_CHERRY_EROTICA_TOKEN_SECRET;
        break;
      case 'ELEGANTLY_ATTACHED':
        token = process.env.ELEGANTLY_ATTACHED_TOKEN;
        tokenSecret = process.env.ELEGANTLY_ATTACHED_TOKEN_SECRET;
        break;
      default: throw new Error(`createClient - unknown type: ${type}`);
    }

    const client = tumblr.createClient({
      credentials: {
        consumer_key: process.env.CONSUMER_KEY,
        consumer_secret: process.env.CONSUMER_SECRET,
        token,
        token_secret: tokenSecret,
      },
      returnPromises: true,
    });

    return client;
  } catch (error) {
    throw new Error(`createClient - ${error}`);
  }
};

const returnPostSpecificFields = (post) => {
  try {
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
        const { text } = post;
        return { text };
      }
      case 'audio': {
        // TODO: No idea if this works.
        const { text } = post;
        return { text };
      }
      case 'link': {
        const { text } = post;
        return { text };
      }
      default:
        throw new Error(`returnPostSpecificFields - unknown post type: ${post.type}`);
    }
  } catch (error) {
    throw new Error(`returnPostSpecificFields - ${error}`);
  }
};

const returnPostSpecificBody = (postFields, postSpecificFields) => {
  try {
    switch (postFields.type) {
      case 'text': {
        return postSpecificFields.body;
      }
      case 'answer': {
        let body = '';
        body += `User: ${postSpecificFields.askingName}\n\n`;
        body += `Question: ${postSpecificFields.question}\n\n`;
        body += `Answer: ${postSpecificFields.answer}\n\n`;
        return body;
      }
      case 'photo': {
        const { postUrl } = postFields;
        return postUrl;
      }
      case 'quote': {
        const { text } = postSpecificFields;
        return text;
      }
      case 'link': {
        const { text } = postSpecificFields;
        console.log(text);
        return { text };
      }
      case 'audio': {
        // TODO: No idea if this works.
        const { text } = postSpecificFields;
        return { text };
      }
      default: {
        console.log('yo', postFields.type, 'yo');
        throw new Error(`returnPostSpecificBody - unknown post type: ${postFields.type}`);
      }
    }
  } catch (error) {
    throw new Error(`returnPostSpecificBody - ${error}`);
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
      ...(post.type === 'photo' ? { photoUrlFirst: post.photos[0].original_size.url } : {}),
    };

    const postString = formatPost(postFields, returnPostSpecificFields(post)).replace(/\n\s+/g, '\n\n');
    return { postFields, postString };
  } catch (error) {
    throw new Error(`processPost - ${error}`);
  }
};

module.exports = {
  createLogger,
  createClient,
  processPost,
  generateOffsetArray,
};
