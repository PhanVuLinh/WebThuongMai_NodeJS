const Product = require("../../models/product.model");
const productsHelper = require("../../helpers/products");

// [GET] /products
module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: "active",
    deleted: false
  }).sort({ position: "desc" })
  const newProducts = productsHelper.priceNewProducts(products);
  
  res.render("client/pages/products/index", {
    titlePage: "Danh sách sản phẩm",
    products: newProducts
  });
};

// [GET] /products/:slug
module.exports.detail = async (req, res) => {
  try {
    const slug = req.params.slug;
    const find = {
      deleted: false,
      status: "active",
      slug: slug
    };
    const product = await Product.findOne(find);

    res.render("client/pages/products/detail", {
      titlePage: product.title,
      product: product
    });
  } catch (error) {
    res.redirect(`/products`);
  }
};