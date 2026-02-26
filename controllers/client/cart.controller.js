const Cart = require("../../models/cart.model");

//[POST] /cart/add/:productId
module.exports.addPost = async (req, res) => {
  const productId = req.params.productId;
  const quantity = parseInt(req.body.quantity);
  const cartId = req.cookies.cartId;

  const objectCart = {
    product_id: productId,
    quantity: quantity
  };

  const cart = await Cart.findOne({
    _id: cartId
  });

  const existProductCart = cart.products.find(item => item.product_id == productId);

  if (existProductCart) {
    await Cart.updateOne(
      {
        _id: cartId,
        "products.product_id": productId
      },
      {
        $inc: { "products.$.quantity": quantity } //Tự cộng dồn và update
      }
    );
  } else {
    await Cart.updateOne(
      {
        _id: cartId
      },
      {
        $push: { products: objectCart }
      }
    );
  }

  req.flash("success", "Đã thêm sản phẩm vào giỏ hàng");
  res.redirect(req.get('Referer'));
}