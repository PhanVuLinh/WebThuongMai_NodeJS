const express = require('express');
const multer = require('multer')
const router = express.Router();
const storageMulter = require("../../helpers/storageMulter");

const upload = multer({ storage: storageMulter() });

const controller = require("../../controllers/admin/product.controller");
const validate = require("../../validates/admin/product.validate");

router.get('/', controller.index);

router.patch('/change-status/:status/:id', controller.changeStatus); ///:status truyền route động

router.patch('/change-multi', controller.changeMulti);

router.delete('/delete/:id', controller.deleteItem);

router.get('/create', controller.create); //Trả về giao diện

router.post(
  '/create',
  upload.single('thumbnail'),
  validate.createPost,
  controller.createPost
);

router.get('/edit/:id', controller.edit); //Trả về giao diện

router.patch(
  '/edit/:id',
  upload.single('thumbnail'),
  validate.createPost,
  controller.editPatch
); 

module.exports = router; 