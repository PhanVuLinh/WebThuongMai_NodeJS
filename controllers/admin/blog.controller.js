const systemConfig = require("../../config/system");
const Blog = require("../../models/blog.model");

///[GET] /admin/blogs/
module.exports.index = async (req, res) => {
  let find = {
    deleted: false
  }

  const blog = await Blog.find(find);
  res.render("admin/pages/blogs/index", {
    titlePage: "Tin tức",
    blog: blog
  });
}

///[GET] /admin/blogs/create
module.exports.create = async (req, res) => {
  res.render("admin/pages/blogs/create", {
    titlePage: "Tạo bài viết"
  });
}

///[POST] /admin/blogs/createPost
module.exports.createPost = async (req, res) => {
  if (req.body.position == "") {
    const countBlogs = await Blog.countDocuments();
    req.body.position = countBlogs;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  if (req.file) {
    req.body.thumbnail = `/uploads/${req.file.filename}`;
  };

  const blog = new Blog(req.body);
  await blog.save();

  res.redirect(`${systemConfig.prefixAdmin}/blogs`);
}