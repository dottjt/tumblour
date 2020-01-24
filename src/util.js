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
    default:
      throw new Error('returnPostSpecificBody - unknown post type');
  }
}

const returnPostSpecificBody = (postFields) => {
  switch (postFields.type) {
    case 'text':
      return postFields.body
    case 'answer':
      let body;
      body += `User: ${postSpecificFields.asking_name}\n`;
      body += `Question: ${postSpecificFields.question}\n\n`;
      body += `Answer: ${postSpecificFields.answer}\n\n`;
      return body;
    default:
      throw new Error('returnPostSpecificBody - unknown post type');
  }
};

const returnPostHead = (postFields) => {
  const postFieldKeys = Object.keys(postFields);

  const headInitial = '---\n';
  const headBody = '';
  const headEnd = '---\n\n';

  postFieldKeys.forEach(postFieldKey => {
    headBody += `${postFieldKey}: ${postFields[postFieldKey]} \n`;
  });
  return `${headInitial}${headBody}${headEnd}`;
};

const generateOffsetLimitArray = (totalAmount) => {
  const iterationsAmount = Math.ceil(totalAmount / 20);
  const iterationsArray = Array.from(Array(iterationsAmount).keys());

  const { offsetLimitArray } = iterationsArray.reduce(iterationsArray, (acc) => {
    const newOffset = acc.offset + 20;
    const newLimit = acc.limit + 20;
    return {
      offset: newOffset,
      limit: newLimit,
      offsetLimitArray: acc.offsetLimitArray.concat({ offset: newOffset, limit: newLimit })
    }
  }, { offset: 0, limit: 20, offsetLimitArray: [{ offset: 0, limit: 20 }] });

  return offsetLimitArray;
};

module.exports = {
  createClient,
  returnPostHead,
  returnPostSpecificBody,
  returnPostSpecificFields,
  generateOffsetLimitArray,
};
