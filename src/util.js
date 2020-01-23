require('dotenv').config()
const axios = require('axios');
const tumblr = require('tumblr.js');
const uuidv4 = require('uuid/v4');
const oauthSignature = require('oauth-signature');

const request_token_url = 'https://www.tumblr.com/oauth/request_token';
const authorization_base_url = 'https://www.tumblr.com/oauth/authorize';
const access_token_url = 'https://www.tumblr.com/oauth/access_token';

const createAuth = async () => {
  const httpMethod = 'GET';
  const request_token_url = 'https://www.tumblr.com/oauth/request_token';
  const parameters = {
    oauth_consumer_key: process.env.CONSUMER_KEY,
    oauth_nonce: uuidv4()
  };
  const consumerSecret = process.env.CONSUMER_SECRET
  const oauth_signature = oauthSignature.generate(httpMethod, request_token_url, parameters, consumerSecret, tokenSecret),

  const requestToken = await axios.get(
    request_token_url,
    { ...parameters, oauth_signature }
  );

  console.log(requestToken);
};

const createClient = (token, tokenSecret) => {
  const client = tumblr.createClient({
    credentials: {
      consumer_key: ,
      consumer_secret: ,
      token: token,
      token_secret: tokenSecret
    },
    returnPromises: true,
  });

  return client;
}
module.exports = {
  createClient, createAuth
};

>>> # Fetch a request token
>>> from requests_oauthlib import OAuth1Session
>>> tumblr = OAuth1Session(key, client_secret=secret, callback_uri='http://www.tumblr.com/dashboard')
>>> tumblr.fetch_request_token(request_token_url)

>>> # Link user to authorization page
>>> authorization_url = tumblr.authorization_url(authorization_base_url)
>>> print 'Please go here and authorize,', authorization_url

>>> # Get the verifier code from the URL
>>> redirect_response = raw_input('Paste the full redirect URL here: ')
>>> tumblr.parse_authorization_response(redirect_response)

>>> # Fetch the access token
>>> tumblr.fetch_access_token(access_token_url)

>>> # Fetch a protected resource
>>> print tumblr.get('http://api.tumblr.com/v2/user/dashboard')
