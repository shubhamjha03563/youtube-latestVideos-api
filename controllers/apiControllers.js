const asyncHandler = require('../middlewares/asyncHandler');
const Video = require('../models/Video');

exports.getAllVideos = asyncHandler(async (req, res, next) => {
  let page = parseInt(req.query.page, 10) || 1,
    pageLimit = 5,
    videos = await Video.find()
      .skip(pageLimit * (page - 1))
      .limit(pageLimit)
      .sort('-publishTime');

  res.status(200).json({ page, count: videos.length, videos });
});

exports.getSearchResults = asyncHandler(async (req, res, next) => {
  // If no search query is provided
  if (!req.query.searchQuery) {
    res.status(400).json({
      message: 'Please give a search query.',
    });
    return next();
  }

  // If page is <= 0
  if (req.query.page <= 0) {
    res.status(400).json({
      message: 'Page value should be greater than 0.',
    });
  }

  let page = parseInt(req.query.page, 10) || 1,
    pageLimit = 5;

  let videos = await Video.find({
    $text: { $search: `${req.query.searchQuery}` },
  })
    .skip(pageLimit * (page - 1))
    .limit(pageLimit)
    .sort('-publishTime');

  let totalSearchResults = await Video.find({
    $text: { $search: `${req.query.searchQuery}` },
  }).countDocuments();

  // If no videos found
  if (totalSearchResults === 0) {
    res.status(200).json({
      totalSearchResults,
      message: 'No videos found. Please try a different search query.',
    });
    return next();
  }

  if (videos.length === 0) {
    totalSearchResults = 0;
  }

  res.status(200).json({
    totalSearchResults,
    page,
    count: videos.length,
    videos,
  });
});
