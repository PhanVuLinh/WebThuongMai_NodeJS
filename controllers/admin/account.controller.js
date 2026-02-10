const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");
const md5 = require('md5');

//[GET] /admin/accounts
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };
  const records = await Account.find(find).select("-password -token");

  for (const record of records) {
    const role = await Role.findOne({
      _id: record.role_id,
      deleted: false
    });
    record.role= role;
  }

  res.render("admin/pages/accounts/index", {
    titlePage: "Danh sách tài khoản",
    records: records
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
    req.flash("error", `Email ${req.body.email} đã tồn tạ`);
    res.redirect(req.get('Referer'));
  } else {
    req.body.password = md5(req.body.password);

    const records = new Account(req.body);
    await records.save();

    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
};