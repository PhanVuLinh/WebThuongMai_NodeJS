const Account = require("../../models/account.model");
const md5 = require('md5');

//[GET] /admin/my-account/
module.exports.index = (req, res) => {
  res.render("admin/pages/my-account/index", {
    titlePage: "Thông tin cá nhân"
  });
};

//[GET] /admin/my-account/edit
module.exports.edit = (req, res) => {
  res.render("admin/pages/my-account/edit", {
    titlePage: "Chỉnh sửa thông tin cá nhân"
  });
};

//[PATCH] /admin/my-account/editPatch
module.exports.editPatch = async (req, res) => {
  const id = res.locals.user.id;

  const emailExist = await Account.findOne({
    _id: { $ne: id }, ///$ne == not equal
    email: req.body.email,
    deleted: false
  });

  if (emailExist) {
    req.flash("error", `Email ${req.body.email} đã tồn tại`);
  } else {
    if (req.body.password) {
      req.body.password = md5(req.body.password);
    } else {
      delete req.body.password;
    }
    if (req.file) {
      req.body.avatar = `/uploads/${req.file.filename}`;
    }
    await Account.updateOne({ _id: id }, req.body);
    req.flash("success", "Cập nhật thành công!");
  }
  res.redirect(req.get('Referer'));
};