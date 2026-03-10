const systemConfig = require("../../config/system");
const Order = require("../../models/order.model");
const productsHelper = require("../../helpers/products");

//[GET] /admin/order/
module.exports.index = async (req, res) => {
  const find = {
    deleted: false
  };

  const records = await Order.find(find);

  // Tính tổng tiền 
  const recordsWithTotal = records.map((order) => {
    const total = order.products.reduce((sum, product) => {
      const priceNew = productsHelper.priceNewProduct(product);
      const quantity = product.quantity || 0;
      return sum + priceNew * quantity;
    }, 0);

    const totalQuantity = order.products.reduce((sum, product) => {
      return sum + (product.quantity || 0);
    }, 0);

    return {
      ...order.toObject(),
      total,
      totalQuantity
    };
  });

  res.render("admin/pages/orders/index", {
    titlePage: "Quản lý đơn hàng",
    records: recordsWithTotal
  });
};

//[GET] /admin/order/delete/:id
module.exports.delete = async (req, res) => {
  const id = req.params.id;
  
  await Order.updateOne({_id: id}, {deleted: true});

  req.flash("success", "Xóa thành công đơn hàng");
  res.redirect(req.get('Referer'));
};