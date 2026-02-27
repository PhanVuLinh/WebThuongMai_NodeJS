const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");

const productsHelper = require("../../helpers/products");
//[GET] /cart
module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId; // id gior hangf
  const cart = await Cart.findOne({
    _id: cartId
  });

  if (cart.products.length > 0) {
    for (const item of cart.products) {
      const productId = item.product_id;
      const productInfo = await Product.findOne({
        _id: productId,
        status: "active",
        deleted: false,
      }).select("title thumbnail slug price discountPercentage");

      productInfo.priceNew = productsHelper.priceNewProduct(productInfo); // Lấy giá mới

      item.productInfo = productInfo;

      item.totalPrice = productInfo.priceNew * item.quantity; //Lấy tổng tiền của 1 sản phẩm
    }
  }

  cart.totalPrice = cart.products.reduce((sum, item) => sum + item.totalPrice, 0)

  res.render("client/pages/cart/index", {
    titlePage: "Giỏ hàng",
    cartDetail: cart
  });
};

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

//[GET] /cart/delete/:productId
module.exports.delete = async (req, res) => {
  const cartId = req.cookies.cartId;
  const productId = req.params.productId;

  await Cart.updateOne({
    _id: cartId
  }, {
    $pull: {
      products: {
        product_id: productId
      }
    }
  }) //xóa phầng tử khỏi object

  req.flash("success", "Đã xóa thành công sản phẩm khỏi giỏ hàng");
  res.redirect(req.get('Referer'));
}

//[GET] /cart/update/:productId/:quantity
module.exports.updateQuantity = async (req, res) => {
  const cartId = req.cookies.cartId;
  const productId = req.params.productId;
  const quantity = req.params.quantity;

  await Cart.updateOne(
    {
      _id: cartId,
      "products.product_id": productId
    },
    {
      $set: { "products.$.quantity": quantity } 
    }
  );

  req.flash("success", "Cập nhật thành công sản phẩm trong giỏ hàng");
  res.redirect(req.get('Referer'));
}