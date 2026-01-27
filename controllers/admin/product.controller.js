//call data
const Product = require("../../models/product.model");

const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
module.exports.index = async (req, res) => {
  //bộ lọc
  const filterStatus = filterStatusHelper(req.query);

  //vieets cau lechj truy van 
  let find = {
    deleted: false
  };

  if (req.query.status) {
    find.status = req.query.status;
  }

  ///tìm kiếm
  const objectSearch = searchHelper(req.query);
  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  //Phân trang Pagination
  let objectPagination = {
    currentPage: 1,
    limitItem: 4
  };
  if (req.query.page) {
    objectPagination.currentPage = parseInt(req.query.page);
  }

  objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItem;

  //Đếm số lượng sản phẩm
  const countProducts = await Product.countDocuments(find);
  //tính số lượng trang
  const totalPage = Math.ceil(countProducts / objectPagination.limitItem);
  objectPagination.totalPage = totalPage; //Thêm vào object

  /////
  const products = await Product.find(find).limit(objectPagination.limitItem).skip(objectPagination.skip);
  res.render("admin/pages/products/index", {
    titlePage: "Trang sản phẩm",
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination
  });
}


