const {
  createClient,
} = require('./util');

const {
  savePosts,
} = require('./posts');

const saveBlogData = async (type) => {
  const client = createClient(type);
  const userInfo = await client.userInfo();
  userInfo.user.blogs.forEach((blog) => console.log(blog.name));
  const blogName = userInfo.user.blogs[0].name;

  savePosts(client, blogName);
};

const main = () => {
  setTimeout(() => saveBlogData('INK_QUOTES'), 0);
  // setTimeout(() => saveBlogData('BROKEN_HEARTS_AND_FRACTURED_SMILES'), 3000);
  // setTimeout(() => saveBlogData('SWEET_CHERRY_EROTICA'), 6000);
  // setTimeout(() => saveBlogData('ELEGANTLY_ATTACHED'), 9000);
  // setTimeout(() => saveBlogData('BLACK_WHITE_INK_CURVES'), 12000);
};

main();
