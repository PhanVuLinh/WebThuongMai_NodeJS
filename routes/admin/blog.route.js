const express = require('express');
// const multer = require('multer');
const router = express.Router();
// const storageMulter = require("../../helpers/storageMulter");

// const upload = multer({ storage: storageMulter() });

const controller = require("../../controllers/admin/blog.controller");

router.get('/', controller.index);

module.exports = router;