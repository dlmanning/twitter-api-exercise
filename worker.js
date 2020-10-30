const { parentPort } = require('worker_threads');
const Parser = require('./parser');
const { URL } = require('url');

const EmojiRegex = require('emoji-regex/RGI_Emoji');
const parser = new Parser();

parentPort.on('message', chunk => {
  parser.parse(chunk);
});

parser.on('data', data => {
  const message = processTweet(data);
  parentPort.postMessage(message);
});

const emojiregex = EmojiRegex();

/**
 * 
 * @typedef {Object} Message - A tweet update message
 * @prop {boolean} hasPhotoURL - whether the tweet has a photo URL
 * @prop {Array<string>} domains - list of domains in the tweet
 * @prop {Array<string>} hashtags - list of hashtags in the tweet
 * @prop {Array<string>} emojis - list of emojis in the tweet  
 */

/**
 * 
 * @param {any} tweet 
 * @return {Message}
 */
function processTweet(tweet) {
  const message = {
    hasPhotoURL: false,
    domains: [],
    hashtags: null,
    emojis: [],
  };

  if (tweet.extended_entities && tweet.extended_entities.media.length > 0) {
    message.hasPhotoURL = true;
  }

  message.hashtags = tweet.entities.hashtags.map(item => item.text);

  if (tweet.entities.urls.length > 0) {
    for (let url of tweet.entities.urls) {
      const domain = (new URL(url.expanded_url)).hostname;
      message.domains.push(domain)
    }
  }

  const matches = tweet.text.match(emojiregex);
  if (matches) {
    message.emojis = matches;
  }

  return message;
}
