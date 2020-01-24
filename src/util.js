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
      return { answer, question }
    default:
      throw new Error('unknown post type');
  }
}

const generateOffsetLimitArray = (totalAmount) => {
  const iterationsAmount = Math.ceil(totalAmount / 20);
  const iterationsArray = Array.from(Array(iterationsAmount).keys());

  const { offsetLimitArray } = iterationsArray.reduce(iterationsArray, (acc, iterationNumber) => {
    const newOffset = acc.offset + 20;
    const newLimit = acc.limit + 20;
    return {
      offset: newOffset,
      limit: newLimit,
      offsetLimitArray: acc.offsetLimitArray.concat({ offset: newOffset, limit: newLimit })
    }
  }, { offset: 0, limit: 20, offsetLimitArray: [] });

  return offsetLimitArray;
};



module.exports = {
  createClient,
  returnPostSpecificFields,
  generateOffsetLimitArray,
};
