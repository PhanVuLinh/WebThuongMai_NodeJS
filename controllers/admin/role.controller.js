const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");

// [GET] /admin/roles
module.exports.index = async (req, res) => {
  let find = {
    deleted: false
  };

  const records = await Role.find(find);

  res.render("admin/pages/roles/index", {
    titlePage: "Trang nhóm quyền",
    records: records
  });
};

// [GET] /admin/roles/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: false
  };

  const records = await Role.find(find);

  res.render("admin/pages/roles/create", {
    titlePage: "Tạo nhóm quyền",
    records: records
  });
};

// [POST] /admin/roles/createPost
module.exports.createPost = async (req, res) => {
  const record = new Role(req.body);
  await record.save();

  res.redirect(`${systemConfig.prefixAdmin}/roles`);
};

// [GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    let find = {
      _id: id,
      deleted: false
    };
    const data = await Role.findOne(find);
    res.render("admin/pages/roles/edit", {
      titlePage: "Sửa nhóm quyền",
      data: data
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
};


// [PATCH] /admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {

  try {
    const id = req.params.id;
    await Role.updateOne({ _id: id }, req.body);
    req.flash("success", `Đã cập nhật thành công nhóm quyền`);
  } catch (error) {
    req.flash("error", `Cập nhật thất bại`);
  }
  res.redirect(req.get('Referer'));
};