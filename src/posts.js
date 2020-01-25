const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const axios = require('axios');

const {
  generateOffsetArray,
  processPost,
} = require('./util');

const outputTextFile = async (postFields, postString, draftOrPost, dateString) => {
  const { blogName, slug, type } = postFields;
  if (type === 'answer' || type === 'text' || type === 'quote') {
    const file = path.join(__dirname, '..', 'export', blogName, draftOrPost, type, `${slug}-${dateString}.md`);
    const fileExists = await fse.pathExists(file);

    if (!fileExists) {
      await fse.outputFile(file, postString);
    }
  }
};

const outputPhotoFile = async (postFields, postString, draftOrPost, dateString) => {
  const {
    type, blogName, slug, tags, shortUrl, photoUrlFirst,
  } = postFields;

  let photoUrl;
  let photoFile;
  let photoSlug;

  if (slug !== '') {
    photoUrl = photoUrlFirst;

    const photoUrlExtension = path.extname(photoUrl);
    photoFile = path.join(__dirname, '..', 'export', blogName, draftOrPost, type, `${slug}-${dateString}${photoUrlExtension}`);
    photoSlug = slug;
  } else {
    const pageHtml = await axios.get(shortUrl, {
      responseType: 'arraybuffer',
      reponseEncoding: 'binary',
    });

    const regex = /<meta property="og:image" content="https:(.+)\.(jpg|jpeg|png)" \/>/g;
    const [matchArray] = pageHtml.data.toString('latin1').match(regex);
    [,,, photoUrl] = matchArray.split('"');

    const photoUrlExtension = path.extname(photoUrl);
    photoSlug = tags.join(',').replace(/,/g, '-');
    photoFile = path.join(__dirname, '..', 'export', blogName, draftOrPost, type, `${photoSlug}-${dateString}${photoUrlExtension}`);
  }

  const file = path.join(__dirname, '..', 'export', blogName, draftOrPost, type, `${photoSlug}-${dateString}.md`);
  const fileExists = await fse.pathExists(file);

  if (!fileExists) {
    await fse.outputFile(file, postString);
  }

  const photoExists = await fse.pathExists(photoFile);

  if (!photoExists) {
    try {
      const response = await axios({
        url: photoUrl,
        method: 'get',
        responseType: 'stream',
      });
      response.data.pipe(fs.createWriteStream(photoFile));
    } catch (error) {
      throw new Error(`photoExists clause - ${error}`);
    }
  }
};

const outputFile = (post, draftOrPost) => {
  const {
    postFields: {
      type, date,
    },
    postFields,
    postString,
  } = processPost(post);

  const [dateString] = date.split(' ');

  if (type === 'answer' || type === 'text' || type === 'quote') {
    outputTextFile(postFields, postString, draftOrPost, dateString);
  }

  if (type === 'photo') {
    outputPhotoFile(postFields, postString, draftOrPost, dateString);
  }
};

const savePostsDraft = async (client, blogName) => {
  try {
    const getDrafts = (lastDraftId) => client.blogDrafts(
      blogName, { before_id: lastDraftId/* , filter: 'raw' */ },
    )
      .then((resp) => {
        if (resp.posts.length === 20) {
          const nextLastDraftId = resp.posts[resp.posts.length - 1].id;
          return getDrafts(nextLastDraftId).then((result) => resp.posts.concat(...result));
        }
        return resp.posts;
      });

    const drafts = await getDrafts(0);

    drafts.forEach((draft) => outputFile(draft, 'drafts'));
  } catch (error) {
    throw new Error(`savePostsDraft - ${error}`);
  }
};

const savePostsPublished = async (client, blogName) => {
  try {
    const blogPostsResponse = await client.blogPosts(blogName);
    const totalPosts = blogPostsResponse.total_posts;
    const offsetArray = generateOffsetArray(totalPosts);

    const promises = offsetArray.map((p) => client.blogPosts(
      blogName, { offset: p.offset, filter: 'text' },
    ));
    const results = await Promise.all(promises);
    const posts = results.reduce((acc, val) => acc.concat(val.posts), []);

    posts.forEach((post) => outputFile(post, 'posts'));
  } catch (error) {
    throw new Error(`savePostsPublished - ${error}`);
  }
};

module.exports = {
  savePosts,
};
