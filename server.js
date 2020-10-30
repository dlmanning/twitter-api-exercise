const { Worker } = require('worker_threads');
const request = require('request');
const express = require('express');
const { DataStore, updateDataStore } = require('./datastore');
const oauth = require('./oauth-secrets.json');

const tweetParserWorker = new Worker('./worker.js');
const dataStore = new DataStore();

const app = express();
const port = 7357;

app.get('/stats', (req, res) => {
  const totalTweets = dataStore.getTotalTweets();
  const tweetsPerSecond = dataStore.getAverageTweetsPer('second');
  const percentTweetsWithURL = dataStore.getPercentTweetsWithURL();
  const percentTweetsWithPhotoURL = dataStore.getPercentTweetsWithPhotoURL();
  const percentTweetsWithEmoji = dataStore.getPercentTweetsWithEmoji();
  const topDomains = dataStore.getTopDomains(10);
  const topHashtags = dataStore.getTopHashTags(10);
  const topEmoji = dataStore.getTopEmojis(10);

  res.json({
    totalTweets,
    tweetsPerSecond,
    percentTweetsWithEmoji,
    percentTweetsWithURL,
    percentTweetsWithPhotoURL,
    topDomains,
    topHashtags,
    topEmoji
  });
});

app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Twitter statistics gatherer listening at http://localhost:${port}`);
});

const req = request('https://stream.twitter.com/1.1/statuses/sample.json', {
  oauth
});

req.on('error', err => {
  console.error(err);
})

req.on('response', resp => {
  resp.on('data', chunk => {
    // Transfer incoming chunk to worker thread
    tweetParserWorker.postMessage(chunk, [chunk.buffer]);
    // chunk is now unusable
  });
});

req.end();

tweetParserWorker.on('message', message => {
  updateDataStore(dataStore, message);
});
