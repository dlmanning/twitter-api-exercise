const TopList = require('./toplist');

class DataStore {
  constructor() {
    this.totalTweets = 0;
    this.startTime = Date.now();
    this.emojis = new TopList();
    this.hashtags = new TopList();
    this.domains = new TopList();
    this.tweetsWithURL = 0;
    this.tweetsWithPhotoURL = 0;
    this.tweetsWithEmoji = 0;
  }

  /**
   * @return {number} The total number of tweets in the datastore
   */
  getTotalTweets() {
    return this.totalTweets;
  }

  /**
   * 
   * @param {"second" | "minute" | "hour"} unit - The rate unit to return
   * @return {number} - Average rate of tweets since the store was created
   */
  getAverageTweetsPer(unit) {
    const elapsedSeconds = (Date.now() - this.startTime) / 1000;
    const averageTweetsPerSecond = this.totalTweets / elapsedSeconds;

    switch (unit) {
      case 'second':
        return averageTweetsPerSecond;
      case 'minute':
        return averageTweetsPerSecond * 60;
      case 'hour':
        return averageTweetsPerSecond * 60 * 60;
      default:
        throw new Error(`DataStore::getAverageTweetsPer(unit): Unknown unit ${unit}`);
    }
  }

  /**
   * 
   * @param {number} n - max number of top results to return
   * @return {Array<string>} - Array of top emojis
   */
  getTopEmojis(n) {
    return this.emojis.getTop(n);
  }

  /**
   * 
   * @param {number} n - max number of top hashtags to return
   * @return {Array<string>} - Array of top hashtags
   */
  getTopHashTags(n) {
    return this.hashtags.getTop(n);
  }

  /**
   * 
   * @param {number} n - max number of top domains to return
   * @return {Array<string>} - Array of top domains 
   */
  getTopDomains(n) {
    return this.domains.getTop(n);
  }

  /**
 * @return {number} - percent of tweets with emoji
 */
  getPercentTweetsWithEmoji() {
    return this.tweetsWithEmoji / this.totalTweets;
  }

  /**
   * @return {number} - percent of tweets with a URL
   */
  getPercentTweetsWithURL() {
    return this.tweetsWithURL / this.totalTweets;
  }

  /**
   * @return {number} - percent of tweets with a photo URL
   */
  getPercentTweetsWithPhotoURL() {
    return this.tweetsWithPhotoURL / this.totalTweets;
  }
}

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
 * @param {DataStore} dataStore 
 * @param {Message} message 
 */
function updateDataStore(dataStore, message) {
  dataStore.totalTweets += 1;

  if (message.domains.length > 0) {
    dataStore.tweetsWithURL += 1;
  }

  if (message.emojis.length > 0) {
    dataStore.tweetsWithEmoji += 1;
  }

  if (message.hasPhotoURL) {
    dataStore.tweetsWithPhotoURL += 1;
  }

  for (const domain of message.domains) {
    dataStore.domains.add(domain);
  }

  for (const hashtag of message.hashtags) {
    dataStore.hashtags.add(hashtag);
  }

  for (const emoji of message.emojis) {
    dataStore.emojis.add(emoji);
  }
}

module.exports = {
  DataStore,
  updateDataStore
};