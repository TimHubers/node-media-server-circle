const express = require('express');
const TruYouController = require('../controllers/videoSign');
const serverController = require('../controllers/server');

module.exports = (context) => {
  let router = express.Router();
  router.get('/', serverController.getInfo.bind(context));
  router.put('/streamdata', TruYouController.update_stream_data);
  return router;
};
