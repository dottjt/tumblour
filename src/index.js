const {
  createClient,
} = require('./util');

const {
  savePosts,
} = require('./posts');

const saveBlogData = async (client) => {
  const userInfo = await client.userInfo();
  const blogName = userInfo.user.blogs[0].name;

  savePosts(client, blogName);
};

const main = () => {
  const client = createClient();
  saveBlogData(client);
};

main();
