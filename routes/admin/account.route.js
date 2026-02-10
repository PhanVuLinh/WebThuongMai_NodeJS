const express = require('express');
const multer = require('multer')

const router = express.Router();

const controller = require("../../controllers/admin/account.controller");
const storageMulter = require("../../helpers/storageMulter");
const upload = multer({ storage: storageMulter() });
const validate = require("../../validates/admin/account.validate");


router.get('/', controller.index);

router.get('/create', controller.create);

router.post(
  '/create',
  upload.single('avatar'),
  validate.createPost,
  controller.createPost
);

module.exports = router;