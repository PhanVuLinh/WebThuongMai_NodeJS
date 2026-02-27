//Cập nhật lại số lượng trong giỏ hàng
const inputsQuantity = document.querySelectorAll(`input[name="quantity"]`);
if (inputsQuantity.length > 0) {
  inputsQuantity.forEach(input => {
    input.addEventListener("change", (e) => {
      const productId = e.target.getAttribute("product-id");
      const quantity = e.target.value

      window.location.href = `/cart/update/${productId}/${quantity}`; //chuyển hướng
    });
  });
}
//Hết Cập nhật lại số lượng trong giỏ hàng
