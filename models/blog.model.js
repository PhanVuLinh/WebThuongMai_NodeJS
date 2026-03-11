const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");

mongoose.plugin(slug);

const blogSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    content: String,
    thumbnail: String,
    status: String,
    position: Number,
    slug: {
      type: String,
      slug: "title",
      unique: true
    },
    deleted: {
      type: Boolean,
      default: false
    },

  }, {
  timestamps: true
}
);
const Blog = mongoose.model('Blog', blogSchema, "blogs");
module.exports = Blog;