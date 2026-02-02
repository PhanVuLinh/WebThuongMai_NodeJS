const express = require('express');
const multer = require('multer')
const router = express.Router();
const storageMulter = require("../../helpers/storageMulter");

const upload = multer({ storage: storageMulter() });
const validate = require("../../validates/admin/product-category.validate");

const controller = require("../../controllers/admin/product-category.controller");

router.get('/', controller.index); 

router.get('/create', controller.create); // giao điện thêm mới danh mục 

router.post(
  '/create',
  upload.single('thumbnail'),
  validate.createPost,
  controller.createPost
);

module.exports = router; 