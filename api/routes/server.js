const express = require('express');
const videoController = require('../controllers/videoSign');
const serverController = require('../controllers/server');

module.exports = (context) => {
  let router = express.Router();
  router.put('/streamdata', videoController.update_stream_data);
  router.get('/streamdata', videoController.verify_stream_data);
  router.get('/', serverController.getInfo.bind(context));
  return router;
};
