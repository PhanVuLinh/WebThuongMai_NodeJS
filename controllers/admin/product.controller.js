//call data
const Product = require("../../models/product.model");

const filterStatusHelper = require("../../helpers/filterStatus");
module.exports.index = async (req, res) => {
  const filterStatus = filterStatusHelper(req.query);

  //vieets cau lechj truy van 
  let find = {
    deleted: false
  };

  if (req.query.status) {
    find.status = req.query.status;
  }

  let keyword = "";

  if (req.query.keyword) {
    keyword = req.query.keyword;
    const regex = new RegExp(keyword, "i");
    find.title = regex;
  }

  const products = await Product.find(find);
  res.render("admin/pages/products/index", {
    titlePage: "Trang sản phẩm",
    products: products,
    filterStatus: filterStatus,
    keyword: keyword
  });
}


