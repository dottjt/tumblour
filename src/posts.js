const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const axios = require('axios');

const {
  generateOffsetArray,
  processPost,
} = require('./util');

const outputTextFile = async (contentType, postFields, postString, draftOrPost, dateString, index) => {
  const { blogName, slug, type } = postFields;
  if (type === 'answer' || type === 'text' || type === 'quote') {
    const file = path.join(__dirname, '..', 'export', blogName, draftOrPost, type, `${slug}-${dateString}.md`);
    const fileExists = await fse.pathExists(file);

    if (!fileExists) {
      await fse.outputFile(file, postString);
      console.log(`${blogName} - ${index} - ${contentType} - ${slug}-${dateString}.md`);
    }
  }
};

const outputPhotoFile = async (contentType, postFields, postString, draftOrPost, dateString, index) => {
  const {
    type, blogName, slug, tags, shortUrl, photoUrlFirst,
  } = postFields;

  let photoUrl = photoUrlFirst;
  let photoFile;
  let photoSlug = slug;

  const photoUrlExtension = path.extname(photoUrl);

  if (slug !== '') {
    photoFile = path.join(__dirname, '..', 'export', blogName, draftOrPost, type, `${slug}-${dateString}${photoUrlExtension}`);
  } else {
    const pageHtml = await axios.get(shortUrl, {
      responseType: 'arraybuffer',
      reponseEncoding: 'binary',
    });

    const regex = /<meta property="og:image" content="https:(.+)\.(jpg|jpeg|png)" \/>/g;
    const [matchArray] = pageHtml.data.toString('latin1').match(regex);
    [,,, photoUrl] = matchArray.split('"');

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
      console.log(`${blogName} - ${index} - ${contentType} - ${photoSlug}-${dateString}${photoUrlExtension}`);
    } catch (error) {
      throw new Error(`photoExists clause - ${error}`);
    }
  }
};

const outputFile = (contentType, post, draftOrPost, index) => {
  const {
    postFields: {
      type, date,
    },
    postFields,
    postString,
  } = processPost(post);

  const [dateString] = date.split(' ');

  if (type === 'answer' || type === 'text' || type === 'quote') {
    outputTextFile(contentType, postFields, postString, draftOrPost, dateString, index);
  }

  if (type === 'photo') {
    outputPhotoFile(contentType, postFields, postString, draftOrPost, dateString, index);
  }
};

const savePostsDraft = async (client, blogName, contentType) => {
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

    drafts.forEach((draft, index) => outputFile(contentType, draft, 'drafts', index));
  } catch (error) {
    throw new Error(`savePostsDraft - ${error}`);
  }
};

const savePostsPublished = async (client, blogName, contentType) => {
  try {
    const blogPostsResponse = await client.blogPosts(blogName);
    const totalPosts = blogPostsResponse.total_posts;
    const offsetArray = generateOffsetArray(totalPosts);

    const promises = offsetArray.map((p) => client.blogPosts(
      blogName, { offset: p.offset, filter: 'text' },
    ));
    const results = await Promise.all(promises);
    const posts = results.reduce((acc, val) => acc.concat(val.posts), []);

    posts.forEach((post, index) => outputFile(contentType, post, 'posts', index));
  } catch (error) {
    throw new Error(`savePostsPublished - ${error}`);
  }
};

module.exports = {
  savePostsDraft,
  savePostsPublished,
};
