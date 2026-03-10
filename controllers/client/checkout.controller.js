const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const Order = require("../../models/order.model");

const productsHelper = require("../../helpers/products");

//[GET] /checkout
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
  res.render("client/pages/checkout/index", {
    titlePage: "Đặt hàng",
    cartDetail: cart
  });
}

//[POST] /checkout/order
module.exports.order = async (req, res) => {
  const userId = res.locals.user.id;
  const cartId = req.cookies.cartId;
  const userInfo = req.body;

  const cart = await Cart.findOne({
    _id: cartId
  });

  const products = [];

  for (const product of cart.products) {
    const objectProduct = {
      product_id: product.product_id,
      price: 0,
      discountPercentage: 0,
      quantity: product.quantity
    };

    const productInfo = await Product.findOne({
      _id: product.product_id
    }).select("price discountPercentage");

    objectProduct.price = productInfo.price;
    objectProduct.discountPercentage = productInfo.discountPercentage;

    products.push(objectProduct);
  }
  const orderInfo = {
    cart_id: cartId,
    userInfo: userInfo,
    products: products,
  };

  if (res.locals.user) {
    orderInfo.user_id = userId;
  }

  const order = new Order(orderInfo);
  order.save();

  await Cart.updateOne({
    _id: cartId,
  }, { products: [] }); //sau khi đặt hàng thành công reset lại giỏ hàng ko còn sản phẩm vì giỏ hàng được tạo ngay từ khi truy cập
  res.redirect(`/checkout/success/${order.id}`);
}


//[GET] /checkout/success/:orderId
module.exports.success = async (req, res) => { 
  const order = await Order.findOne({
    _id: req.params.orderId
  });

  for (const product of order.products) {
    const productInfo = await Product.findOne({
      _id: product.product_id
    }).select("title thumbnail");

    product.productInfo = productInfo;

    product.priceNew = productsHelper.priceNewProduct(product);

    product.totalPrice = product.priceNew * product.quantity;
  }

  order.totalPrice = order.products.reduce((sum, item) => sum + item.totalPrice, 0)


  res.render("client/pages/checkout/success", {
    titlePage: "Đặt hàng thành công",
    order: order
  })
}