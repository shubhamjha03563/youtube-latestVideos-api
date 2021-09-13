const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
  videoId: String,
  publishTime: Date,
  title: String,
  description: String,
  tumbnailUrl: String,
  channelTitle: String,
});

VideoSchema.index({ publishTime: -1 });
VideoSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Video', VideoSchema);
