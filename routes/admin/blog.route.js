const express = require('express');
const multer = require('multer');
const router = express.Router();
const storageMulter = require("../../helpers/storageMulter");

const upload = multer({ storage: storageMulter() });

const controller = require("../../controllers/admin/blog.controller");

router.get('/', controller.index);

router.get('/create', controller.create);

router.post(
  '/create',
  upload.single('thumbnail'),
  controller.createPost
);

router.get('/edit/:id', controller.edit);

router.patch(
  '/edit/:id',
  upload.single('thumbnail'),
  controller.editPost
);

router.delete('/delete/:id', controller.delete);


module.exports = router;