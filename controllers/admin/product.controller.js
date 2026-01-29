//call data
const Product = require("../../models/product.model");

const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");

///GET /admin/products
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

  const countProducts = await Product.countDocuments(find);   //Đếm số lượng sản phẩm
  let objectPagination = paginationHelper(
    {
      currentPage: 1,
      limitItem: 4
    },
    req.query,
    countProducts
  );

  /////
  const products = await Product.find(find)
    .sort({position: "desc"})
    .limit(objectPagination.limitItem)
    .skip(objectPagination.skip);
    
  res.render("admin/pages/products/index", {
    titlePage: "Trang sản phẩm",
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination
  });
}

///Path /change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  // console.log(req.params);
  const status = req.params.status;
  const id = req.params.id;

  await Product.updateOne({ _id: id }, { status: status });

  res.redirect(req.get('Referer'));
};


///Path /admin/products/change-multi 
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");

  switch (type) {
    case "active":
      await Product.updateMany({ _id: { $in: ids } }, { status: "active" });
      break;
    case "inactive":
      await Product.updateMany({ _id: { $in: ids } }, { status: "inactive" });
      break;
    case "delete-all":
      await Product.updateMany({ _id: { $in: ids } },
        {
          deleted: true,
          deleteAt: new Date()
        }
      );
      break;
    case "change-position":
      console.log(ids);
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);

        await Product.updateOne({ _id: id },
          {
            position: position
          }
        );
      }
      break;
    default:
      break;
  }
  res.redirect(req.get('Referer'));
};


///DELETE /products/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  // await Product.deleteOne({ _id: id });
  await Product.updateOne(
    { _id: id },
    {
      deleted: true,
      deletedAt: new Date()
    }
  );

  res.redirect(req.get('Referer'));
};