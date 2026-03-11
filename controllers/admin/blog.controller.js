///[GET] /admin/blogs/
module.exports.index = async (req, res) => {

  res.render("admin/pages/blogs/index", {
    titlePage: "Tin tức"
  });
}