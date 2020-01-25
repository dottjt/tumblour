const {
  createClient,
} = require('./util');

const {
  savePostsPublished,
  savePostsDraft,
} = require('./posts');

const saveBlogData = async (clientType, contentType) => {
  try {
    const client = createClient(clientType);
    const userInfo = await client.userInfo();
    const blogName = userInfo.user.blogs[0].name;

    if (contentType === 'published') {
      savePostsPublished(client, blogName, contentType);
    }
    if (contentType === 'draft') {
      savePostsDraft(client, blogName, contentType);
    }
  } catch (error) {
    throw new Error(`saveBlogData - ${error}`);
  }
};

const main = () => {
  setTimeout(() => saveBlogData('INK_QUOTES', 'published'), 0);
  setTimeout(() => saveBlogData('INK_QUOTES', 'draft'), 2000);

  // setTimeout(() => saveBlogData('BROKEN_HEARTS_AND_FRACTURED_SMILES', 'published'), 4000);
  // setTimeout(() => saveBlogData('BROKEN_HEARTS_AND_FRACTURED_SMILES', 'draft'), 6000);

  // setTimeout(() => saveBlogData('SWEET_CHERRY_EROTICA', 'published'), 8000);
  // setTimeout(() => saveBlogData('SWEET_CHERRY_EROTICA', 'draft'), 10000);

  // setTimeout(() => saveBlogData('ELEGANTLY_ATTACHED', 'published'), 12000);
  // setTimeout(() => saveBlogData('ELEGANTLY_ATTACHED', 'draft'), 14000);

  // setTimeout(() => saveBlogData('BLACK_WHITE_INK_CURVES', 'published'), 16000);
  // setTimeout(() => saveBlogData('BLACK_WHITE_INK_CURVES', 'draft'), 18000);
};

main();
