const SettingGeneral = require("../../models/settings-general.model");
//[GET] /admin/settings/general
module.exports.general = async (req, res) => {
  const settingGeneral = await SettingGeneral.findOne({}); //Nếu để object rỗng thì sẽ lấy đầu tiên

  res.render("admin/pages/settings/general", {
    titlePage: "Cài đặt chung",
    settingGeneral: settingGeneral
  });
};

//[PATCH] /admin/settings/general
module.exports.generalPatch = async (req, res) => {
  const settingGeneral = await SettingGeneral.findOne({});
  if (settingGeneral) {
    if (req.file) {
      req.body.logo = `/uploads/${req.file.filename}`;
    }
    await SettingGeneral.updateOne(
      {
        _id: settingGeneral.id
      }, req.body);
  } else {
    if (req.file) {
      req.body.logo = `/uploads/${req.file.filename}`;
    }
    const record = new SettingGeneral(req.body);
    await record.save();
  }
  res.redirect(req.get('Referer'));

};