module.exports.createPost = (req, res, next) => {
  if (!req.body.title) {
    req.flash("error", `Vui lòng nhập tiêu đề`);
    res.redirect(req.get('Referer'));
    return;
  }
  next();//--> Thỏa mãn đi sang bước tiếp theo
}