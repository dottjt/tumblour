# Tumblour

Essentially this is an export of all my tumblr writing, including drafts.

It contains text from:

- INK_QUOTES
- BROKEN_HEARTS_AND_FRACTURED_SMILES
- SWEET_CHERRY_EROTICA
- ELEGANTLY_ATTACHED
- BLACK_WHITE_INK_CURVES
- TKTXTKTX

TODO:

// Still need to configure 'link' post types. I think there's just one existing.
// Some links apparently are returning 404.

# ENV variables required

INK_QUOTES_TOKEN
INK_QUOTES_TOKEN_SECRET
BROKEN_HEARTS_AND_FRACTURED_SMILES_TOKEN
BROKEN_HEARTS_AND_FRACTURED_SMILES_TOKEN_SECRET
BLACK_WHITE_INK_CURVES_TOKEN
BLACK_WHITE_INK_CURVES_TOKEN_SECRET
TKTXTKTX_TOKEN
TKTXTKTX_TOKEN_SECRET
SWEET_CHERRY_EROTICA_TOKEN
SWEET_CHERRY_EROTICA_TOKEN_SECRET
ELEGANTLY_ATTACHED_TOKEN
ELEGANTLY_ATTACHED_TOKEN_SECRET
CONSUMER_KEY
CONSUMER_SECRET

# How to run

// `npm run dev`

# Notes

// I think SWEET_CHERRY_EROTICA drafts is returning some 404s, I imagine because of the tumblr porn purge. That's okay, only the text was original.

// same for blackwhite ink curves drafts. May have to look into it.

# Emails

- thefinancialreality@gmail.com - InkQuotes
- julius.reade@gmail.com - brokenheartsandfracturedsmiles
- drudgereportreport@gmail.com - sweetcherryerotica
- julius@perspectivetheory.com - elegantly attached.
- juliusismyname@gmail.com - blackwhiteinkcurvesxxx.tumblr.com
- julius@perspectivevsreality.com - tktxtktx.tumblr.com

## unused

title.replace(/\s/g, "-")


// if I want the looping to technically be correct.

https://stackoverflow.com/questions/47117218/fetching-all-stripe-customers-with-async-await/47117638

// const getMorePosts = (offset, ) => {
//   const getThem = (offset) => client.blogDrafts(blogName, { limit: period.offset })
//     .then(data => offset)

//   return getThem(0);

//   const getThem = offset => stripe.customers.list({limit, offset})
//   .then(res => res.has_more ?
//       getThem(offset + res.data.length).then(result => res.data.concat(...result)) :
//       res.data
//   );
//   return getThem(0);
// };


// return fse.pathExists(file)
// .then(fileExists => {
//   if (!fileExists) {
//     return fse.outputFile(file, postString);
//   }
// })


// for (const post of posts) {
//   outputFile(post, 'posts');
//   console.log(post.title);
// }
