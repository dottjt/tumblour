const {
  returnPostSpecificFields,
  returnPostSpecificBody
} = require('./util');

const savePosts = (client, blogName) => {
  savePostsPublished(client, blogName);
  savePostsDraft(client, blogName);
};

const savePostsDraft = async (client, blogName) => {
  try {
    const blogDraftsResponse = await client.blogDrafts(blogName);
    const totalDrafts = blogDraftsResponse.total_posts;
    const offsetLimitArray = generateOffsetLimitArray(totalDrafts);

    for (let period of offsetLimitArray) {
      const blogDraftsResponsePeriod = await client.blogDrafts(blogName, { offset: period.offset, limit: period.offset });

      for (let draft of blogDraftsResponsePeriod.posts) {
        const { postFields: { blog_name, slug, title } , postString } = processPost(draft);
        const file = `export/${blog_name}/drafts/${slug}.md`;
        await fs.outputFile(file, postString);
        console.log(`${title} exported! - ${file}`);
      }
    }
  } catch(error) {
    throw new Error(`savePostsDraft - ${error}`);
  }
};

const savePostsPublished = async (client, blogName) => {
  try {
    const blogPostsResponse = await client.blogPosts(blogName);
    const totalPosts = blogPostsResponse.total_posts;
    const offsetLimitArray = generateOffsetLimitArray(totalPosts);

    for (let period of offsetLimitArray) {
      const blogPostsResponsePeriod = await client.blogPosts(blogName, { offset: period.offset, limit: period.offset });

      for (let post of blogPostsResponsePeriod.posts) {
        const { postFields: { blog_name, slug, title }, postString } = processPost(post);
        const file = `export/${blog_name}/posts/${slug}.md`;
        await fs.outputFile(file, postString);
        console.log(`${title} exported! - ${file}`);
      }
    }
  } catch(error) {
    throw new Error(`savePostsPublished - ${error}`);
  }
};

const processPost = (post) => {
  try {
    const postFields = {
      id: post.id,
      blog_name: post.blog_name,
      type: post.type,
      title: post.title,
      summary: post.summary,
      date: post.date,
      slug: post.slug,
      state: post.state,
      tags: post.tags,
      short_url: post.short_url,
      post_url: post.post_url,
      note_count: post.note_count,
      format: post.format
    };

    const postString = formatPost(postFields, returnPostSpecificFields(post));
    return { postFields, postString };
  } catch(error) {
    throw new Error(`processPost - ${error}`);
  }
};

const formatPost = (postFields, postSpecificFields) => {
  try {
    const head = returnPostHead(postFields);
    const body = returnPostSpecificBody(postFields);

    return `${head}${body}`;
  } catch(error) {
    throw new Error(`formatPost - ${error}`);
  }
};

module.export = {
  savePosts
};