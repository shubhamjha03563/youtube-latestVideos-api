const express = require('express');
const router = express.Router();

const {
  getAllVideos,
  getSearchResults,
} = require('../controllers/apiControllers');

router.route('/getAllVideos').get(getAllVideos);
router.route('/search').get(getSearchResults);

module.exports = router;
