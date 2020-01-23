const { }


const getPosts = async () => {
  const userInfo = await client.userInfo();

  await client.blogPosts('blogName')
    .then(function(resp) {
      resp.posts;
    })
    .catch(function(err) {
      // oops
    });

  // userInfo.user.blogs
  // const blog.name
};

