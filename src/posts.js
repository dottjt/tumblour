const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const axios = require('axios');

const {
  generateOffsetArray,
  returnPostSpecificFields,
  returnPostSpecificBody,
  returnPostHead,
} = require('./util');

const formatPost = (postFields, postSpecificFields) => {
  try {
    const head = returnPostHead(postFields);
    const body = returnPostSpecificBody(postFields, postSpecificFields);

    return `${head}${body}`;
  } catch(error) {
    throw new Error(`formatPost - ${error}`);
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

// const savePostsDraft = async (client, blogName) => {
//   try {
//     const blogDraftsResponse = await client.blogDrafts(blogName);
//     const totalDrafts = blogDraftsResponse.total_posts;
//     const offsetArray = generateOffsetArray(totalDrafts);

//     for (let period of offsetArray) {
//       const blogDraftsResponsePeriod = await client.blogDrafts(blogName, { limit: period.offset });

//       for (let draft of blogDraftsResponsePeriod.posts) {
//         const { postFields: { blog_name, slug, title } , postString } = processPost(draft);
//         const file = `export/${blog_name}/drafts/${slug}.md`;
//         await fse.outputFile(file, postString);
//         console.log(`${title} exported! - ${file}`);
//       }
//     }
//   } catch(error) {
//     throw new Error(`savePostsDraft - ${error}`);
//   }
// };

const savePostsPublished = async (client, blogName) => {
  try {
    const blogPostsResponse = await client.blogPosts(blogName);
    const totalPosts = blogPostsResponse.total_posts;
    const offsetArray = generateOffsetArray(totalPosts);

    let counter = 0;

    for (let period of offsetArray) {
      const blogPostsResponsePeriod = await client.blogPosts(blogName, undefined, { offset: period.offset });

      for (let post of blogPostsResponsePeriod.posts) {
        const { postFields: { blog_name, slug, type, tags, short_url}, postString } = processPost(post);

        console.log(counter, slug, type);
        counter++;

        if (type === 'answer' || type === '') {
          const file = path.join(__dirname, '..', 'export', blog_name, 'posts', type, `${slug}.md`);
          const fileExists = await fse.pathExists(file);

          if (!fileExists) {
            await fse.outputFile(file, postString);
          }
        }

        if (type === 'photo') {
          let photoUrl;
          let photoFile;

          if (slug !== "") {
            photoUrl = post.photos[0].original_size.url;

            const photoUrlExtension = path.extname(photoUrl);
            photoFile = path.join(__dirname, '..', 'export', blog_name, 'posts', type, `${slug}${photoUrlExtension}`);
          } else {
            const pageHtml = await axios.get(short_url);
            const regex = /"image":"https:(.+)\.(jpg|jpeg|png)"/g;
            const matchArray = pageHtml.data.match(regex);
            photoUrl = matchArray[0].split("\"")[3];

            const photoUrlExtension = path.extname(photoUrl);
            const tagSlug = tags.join(',').replace(/,/g,'-');
            photoFile = path.join(__dirname, '..', 'export', blog_name, 'posts', type, `${tagSlug}${photoUrlExtension}`);
          }

          const file = path.join(__dirname, '..', 'export', blog_name, 'posts', type, `${slug}.md`);
          const fileExists = await fse.pathExists(file);

          if (!fileExists) {
            await fse.outputFile(file, postString);
          }


          const photoExists = await fse.pathExists(photoFile);

          if (!photoExists) {

            console.log(photoUrl);
            console.log(photoFile);

            const writer = fs.createWriteStream(photoFile)
            const response = await axios({
              url: photoUrl,
              method: 'GET',
              responseType: 'stream'
            });

            response.data.pipe(writer);

            new Promise((resolve, reject) => {
              writer.on('finish', resolve)
              writer.on('error', reject)
            });
          }
        }
      }
    }
  } catch(error) {
    throw new Error(`savePostsPublished - ${error}`);
  }
};

const savePosts = (client, blogName) => {
  savePostsPublished(client, blogName);
  // savePostsDraft(client, blogName);
};

module.exports = {
  savePosts
};