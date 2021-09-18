const axios = require('axios');
const asyncHandler = require('../middlewares/asyncHandler');
const Video = require('../models/Video');
const Key = require('../models/Key');

const youtubeApiCaller = asyncHandler(async () => {
  // fetch two api keys and if one's quota is exhausted, use second and remove the first one from database
  let keys = await Key.find().sort('keyNumber').limit(2);
  let apiKey = keys[0].key;
  await Key.findOneAndUpdate(
    { keyNumber: keys[0].keyNumber },
    { $inc: { used: 1 } }
  );

  if (keys[0].used > process.env.MAX_QUOTA) {
    await Key.findOneAndRemove({ keyNumber: keys[0].keyNumber });
    await Key.findOneAndUpdate(
      { keyNumber: keys[1].keyNumber },
      { $inc: { used: 1 } }
    );

    apiKey = keys[1].key;
  }

  let youtubeResponse = await axios.get(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${process.env.YOUTUBE_SEARCH_QUERY}&type=video&order=date&key=${apiKey}`
  ); // array of all videos-info

  let video, videoData;
  youtubeResponse.data.items.forEach(async (item) => {
    video = await Video.find({ videoId: item.id.videoId });
    // If video not present, then it'll be added to database
    if (Object.keys(video).length === 0) {
      videoData = {
        videoId: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        publishTime: item.snippet.publishTime,
        channelTitle: item.snippet.channelTitle,
        thumbnailUrl: item.snippet.thumbnails.default.url,
      };
      await Video.create(videoData);
    }
  });
});

module.exports = youtubeApiCaller;
