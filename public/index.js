fetch('stats').then(resp => {
  resp.json().then(data => {
    // Ugly DOM direct manipulation ensues...

    const totalTweets = document.getElementById('total-tweets');
    totalTweets.innerText = data.totalTweets;

    const tweetRate = document.getElementById('tweet-rate');
    tweetRate.innerText = `${Math.round(data.tweetsPerSecond)} / ${Math.round(data.tweetsPerSecond * 60)} / ${Math.round(data.tweetsPerSecond * 60 * 60)}`;

    const percentURL = document.getElementById('percent-url');
    percentURL.innerText = `${data.percentTweetsWithURL.toPrecision(4)}`;

    const percentPhotoURL = document.getElementById('percent-photo-url');
    percentPhotoURL.innerText = `${data.percentTweetsWithPhotoURL.toPrecision(4)}`;

    const percentEmoji = document.getElementById('percent-emoji');
    percentEmoji.innerText = `${data.percentTweetsWithEmoji.toPrecision(4)}`;

    const topEmojiContainer = document.getElementById('top-emoji');
    data.topEmoji.forEach(emoji => {
      const listItem = document.createElement('li');
      listItem.innerText = emoji;
      topEmojiContainer.appendChild(listItem);
    });

    const topHashtagsContainer = document.getElementById('top-hashtags');
    data.topHashtags.forEach(hashtag => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `<a href="https://twitter.com/hashtag/${hashtag}">#${hashtag}</a>`;
      topHashtagsContainer.appendChild(listItem);
    });

    const topDomainsContainer = document.getElementById('top-domains');
    data.topDomains.forEach(domain => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `<a href="https://${domain}">${domain}</a>`;
      topDomainsContainer.appendChild(listItem);
    });
  });
});

