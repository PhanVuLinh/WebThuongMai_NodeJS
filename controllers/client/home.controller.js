const Product = require("../../models/product.model");
const productsHelper = require("../../helpers/products");
//[GET] /
module.exports.index = async (req, res) => {
  //Lấy sản phẩm nổi bật
  const productsFeatured = await Product.find({
    featured: "1",
    status: "active",
    deleted: false
  });

  const newProductsFeatured = productsHelper.priceNewProducts(productsFeatured);
  //end 
  //Lấy sản phẩm mới nhất
  const productsNew = await Product.find({
    status: "active",
    deleted: false
  }).sort({ position: "desc" }).limit(6);

  const newProductsNew = productsHelper.priceNewProducts(productsNew);
  //end 

  res.render("client/pages/home/index", {
    titlePage: "Trang chủ",
    productsFeatured: newProductsFeatured,
    productsNew: newProductsNew
  });
}