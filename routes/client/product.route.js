const express = require('express');
const router = express.Router();

const controller = require("../../controllers/client/product.controller");

router.get('/', controller.index);

router.get('/:slugCategory', controller.category);

// router.get('/:slug', controller.detail); //chi tieets sanr pham

module.exports = router;