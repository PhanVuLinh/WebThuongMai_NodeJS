module.exports.index = (req, res) => {
  res.render("admin/pages/products/index", {
    titlePage: "Trang sản phẩm"
  });
};
