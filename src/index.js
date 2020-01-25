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
  // NOTE: The key with these is to run them sequentially, with some comments out.
  // Otherwise the API returns 429 errors, due to making too many requests.

  // saveBlogData('INK_QUOTES', 'published');
  // saveBlogData('INK_QUOTES', 'draft');

  // saveBlogData('BROKEN_HEARTS_AND_FRACTURED_SMILES', 'published');
  // saveBlogData('BROKEN_HEARTS_AND_FRACTURED_SMILES', 'draft');

  // saveBlogData('SWEET_CHERRY_EROTICA', 'published');
  // saveBlogData('SWEET_CHERRY_EROTICA', 'draft');

  // saveBlogData('ELEGANTLY_ATTACHED', 'published');
  // saveBlogData('ELEGANTLY_ATTACHED', 'draft');

  // saveBlogData('BLACK_WHITE_INK_CURVES', 'published');
  saveBlogData('BLACK_WHITE_INK_CURVES', 'draft');
};

main();
