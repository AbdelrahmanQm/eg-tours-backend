const express = require('express');
const testController = require('../controllers/testController');

const router = express.Router();

router
  .route('/')
  .post(
    testController.uploadUserPhoto,
    testController.resizeUserImgae,
    testController.createOne,
  );

module.exports = router;
