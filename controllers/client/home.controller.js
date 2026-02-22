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

  const newProducts = productsHelper.priceNewProducts(productsFeatured);
  //end 
  
  res.render("client/pages/home/index", {
    titlePage: "Trang chủ",
    productsFeatured: newProducts
  });
}