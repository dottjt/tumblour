require('dotenv').config()
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
      token_secret: process.env.INK_QUOTES_TOKEN_SECRET
    },
    returnPromises: true,
  });

  return client;
}

const returnPostSpecificFields = (post) => {
  switch (post.type) {
    case 'text':
      const { body } = post;
      return body;
    case 'answer':
      const {
        asking_name,
        answer,
        question
      } = post;
      return { asking_name, answer, question }
    case 'photo':
      const {
        image_permalink,
        photos
      } = post;
      return { image_permalink, photos };
    default:
      throw new Error(`returnPostSpecificFields - unknown post type: ${post.type}`);
  }
}

const returnPostSpecificBody = (postFields, postSpecificFields) => {
  switch (postFields.type) {
    case 'text':
      return postSpecificFields.body;
    case 'answer':
      let body;
      body += `User: ${postSpecificFields.asking_name}\n`;
      body += `Question: ${postSpecificFields.question}\n\n`;
      body += `Answer: ${postSpecificFields.answer}\n\n`;
      return body;
    case 'photo':
      return { }
    default:
      throw new Error(`returnPostSpecificBody - unknown post type: ${postFields.type}`);
  }
};

const returnPostHead = (postFields) => {
  const postFieldKeys = Object.keys(postFields);

  const headInitial = '---\n';
  let headBody = '';
  const headEnd = '---\n\n';

  postFieldKeys.forEach(postFieldKey => {
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
      offsetArray: acc.offsetArray.concat({ offset: newOffset })
    }
  }, { offset: 20, offsetArray: [{ offset: 20 }] });

  return offsetArray;
};

const generate = () => {
  const file = path.join(__dirname, '..', 'export', blog_name, 'posts', type, `${slug}.md`);

}

module.exports = {
  createClient,
  returnPostHead,
  returnPostSpecificBody,
  returnPostSpecificFields,
  generateOffsetArray,
};
