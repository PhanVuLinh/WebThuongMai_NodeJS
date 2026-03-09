const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");
const md5 = require('md5');
const paginationHelper = require("../../helpers/pagination");
const searchHelper = require("../../helpers/search");

//[GET] /admin/accounts
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  ///tìm kiếm
  const objectSearch = searchHelper(req.query);
  if (objectSearch.regex) {
    find.fullName = objectSearch.regex;
  }


  //Phân trang Pagination
  const countAccounts = await Account.countDocuments(find);
  let objectPagination = paginationHelper(
    {
      currentPage: 1,
      limitItem: 4
    },
    req.query,
    countAccounts
  );

  // const records = await Account.find(find).select("-password -token");
  const records = await Account.find(find)
    .select("-password -token")
    .limit(objectPagination.limitItem)
    .skip(objectPagination.skip);

  for (const record of records) {
    const role = await Role.findOne({
      _id: record.role_id,
      deleted: false
    });
    record.role = role;
  }

  res.render("admin/pages/accounts/index", {
    titlePage: "Danh sách tài khoản",
    records: records,
    keyword: objectSearch.keyword,
    pagination: objectPagination
  });


};

//[GET] /admin/accounts/create
module.exports.create = async (req, res) => {
  const roles = await Role.find({ deleted: false });
  res.render("admin/pages/accounts/create", {
    titlePage: "Tạo mới tài khoản",
    roles: roles
  });
};

//[POST] /admin/accounts/createPost
module.exports.createPost = async (req, res) => {
  const emailExist = await Account.findOne({
    email: req.body.email,
    deleted: false
  });
  if (emailExist) {
    req.flash("error", `Email ${req.body.email} đã tồn tại`);
    res.redirect(req.get('Referer'));
  } else {
    req.body.password = md5(req.body.password);
    if (req.file) {
      req.body.avatar = `/uploads/${req.file.filename}`;
    }
    const records = new Account(req.body);
    await records.save();

    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
};

//[GET] /admin/edit/:id
module.exports.edit = async (req, res) => {
  try {
    let find = {
      _id: req.params.id,
      deleted: false
    }
    const data = await Account.findOne(find);

    const roles = await Role.find({
      deleted: false,
    });

    res.render("admin/pages/accounts/edit", {
      pageTitle: "Chỉnh sửa tài khoản",
      data: data,
      roles: roles,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
};

//[PATCH] /admin/edit/:id
module.exports.editPatch = async (req, res) => {
  const emailExist = await Account.findOne({
    _id: { $ne: req.params.id }, ///$ne == not equal
    email: req.body.email,
    deleted: false
  });
  if (emailExist) {
    req.flash("error", `Email ${req.body.email} đã tồn tại`);
    res.redirect(req.get('Referer'));
  } else {
    if (req.body.password) {
      req.body.password = md5(req.body.password);
    } else {
      delete req.body.password;
    }

    if (req.file) {
      req.body.avatar = `/uploads/${req.file.filename}`;
    }

    await Account.updateOne({ _id: req.params.id }, req.body);
    req.flash("success", "Cập nhật thành công!");
  }

  res.redirect(req.get('Referer'));
};


/////[PATCH] /admin/accounts/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  await Account.updateOne({ _id: id }, { status: status });

  req.flash("success", "Cập nhật trạng thái thành công!");

  res.redirect(req.get('Referer'));
}


/////[DELETE] /admin/accounts/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  await Account.updateOne(
    { _id: id },
    { deleted: true }
  );
  req.flash("success", `Đã xóa thành công tài khoản`);

  res.redirect(req.get('Referer'));
}