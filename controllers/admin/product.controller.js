//call data
const Product = require("../../models/product.model");

const systemConfig = require("../../config/system");

const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");

///[GET] /admin/products
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

  //sort
  let sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue; //Vif req.query.sortKey  là 1 string nên khi truyền vào là phải dùng dấu ngoặc vuông [req.query.sortKey]
  } else {
    sort.position = "desc"
  }
  //END sort

  /////
  const products = await Product.find(find)
    .sort(sort)
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

///[PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  // console.log(req.params);
  const status = req.params.status;
  const id = req.params.id;

  await Product.updateOne({ _id: id }, { status: status });

  req.flash("success", "Cập nhật trạng thái thành công!");

  res.redirect(req.get('Referer'));
};

///[PATCH] /admin/products/change-multi 
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");

  switch (type) {
    case "active":
      await Product.updateMany({ _id: { $in: ids } }, { status: "active" });
      req.flash("success", `Cập nhật trạng thái thành công của ${ids.length} sản phẩm`);
      break;
    case "inactive":
      await Product.updateMany({ _id: { $in: ids } }, { status: "inactive" });
      req.flash("success", `Cập nhật trạng thái thành công của ${ids.length} sản phẩm`);
      break;
    case "delete-all":
      await Product.updateMany({ _id: { $in: ids } },
        {
          deleted: true,
          deleteAt: new Date()
        }
      );
      req.flash("success", `Đã xóa thành công ${ids.length} sản phẩm`);
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
      req.flash("success", `Đã đổi vị trí thành công ${ids.length} sản phẩm`);

      break;
    default:
      break;
  }
  res.redirect(req.get('Referer'));
};

///[DELETE] /admin/products/delete/:id
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
  req.flash("success", `Đã xóa thành công sản phẩm`);

  res.redirect(req.get('Referer'));
};

///[GET] /admin/products/create
module.exports.create = async (req, res) => {
  res.render("admin/pages/products/create", {
    titlePage: "Thêm mới sản phẩm",
  });
}

///[POST] /admin/products/create
module.exports.createPost = async (req, res) => {

  // console.log(req.file);
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);

  if (req.body.position == "") {
    const countProducts = await Product.countDocuments();
    req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  if (req.file) {
    req.body.thumbnail = `/uploads/${req.file.filename}`;
  }
  const product = new Product(req.body);
  await product.save();

  res.redirect(`${systemConfig.prefixAdmin}/products`);
}

///[GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const find = {
      deleted: false,
      _id: id
    };
    const product = await Product.findOne(find);
    res.render("admin/pages/products/edit", {
      titlePage: "Chỉnh sửa sản phẩm",
      product: product
    });
  } catch (error) {
    req.flash("error", `Sản phẩm không tồn tại`);
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
}


///[PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
  //console.log(req.body);///-->trar veef data
  const id = req.params.id;
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);

  if (req.file) {
    req.body.thumbnail = `/uploads/${req.file.filename}`;
  }

  try {
    await Product.updateOne({ _id: id }, req.body);
    req.flash("success", `Đã cập nhật thành công sản phẩm`);
  } catch (error) {
    req.flash("error", `Cập nhật thất bại`);
  }
  res.redirect(req.get('Referer'));
};


///[GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    const find = {
      deleted: false,
      _id: id
    };
    const product = await Product.findOne(find);

    console.log(product);

    res.render("admin/pages/products/detail", {
      titlePage: product.title,
      product: product
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
}