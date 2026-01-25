//call data
const Product = require ("../../models/product.model");

module.exports.index = async (req, res) => {
  const products = await Product.find({
    deleted: false
  });
  res.render("admin/pages/products/index", {
    titlePage: "Trang sản phẩm",
    products: products
  });
};
