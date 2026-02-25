const ProductCategory = require("../models/product-category.model");

module.exports.getSubCategory = async (parentId) => {
  const getCategory = async (parentId) => {
    const subs = await ProductCategory.find({
      parent_id: parentId,
      status: "active",
      deleted: false,
    });

    let allSub = [...subs];
    for (const sub of subs) {
      const childrens = await getCategory(sub.id);
      allSub = allSub.concat(childrens);
    }

    return allSub;
  }
  const result = await getCategory(parentId);
  return result;
}