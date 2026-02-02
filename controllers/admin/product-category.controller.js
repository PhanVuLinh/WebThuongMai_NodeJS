///[GET] /admin/product-category
module.exports.index = async (req, res) => {
  res.render("admin/pages/products-category/index", {
    titlePage: "Danh mục sản phẩm"
  });
 
}