// Khôi phục vị trí cuộn trang sau khi tải lại toàn bộ trang
const scrollStorageKey = "productsScrollY";
const scrollY = sessionStorage.getItem(scrollStorageKey);
if (scrollY) {
  window.scrollTo(0, Number(scrollY));
  sessionStorage.removeItem(scrollStorageKey);
}

//change Status
const buttonsChangeStatus = document.querySelectorAll("[button-change-status]");
if (buttonsChangeStatus.length > 0) {
  const formChangeStatus = document.querySelector("#form-change-status");
  const path = formChangeStatus.getAttribute("data-path");
  buttonsChangeStatus.forEach((button) => {
    button.addEventListener("click", () => {
      const statusCurrent = button.getAttribute("data-status");
      const id = button.getAttribute("data-id");

      let statusChange = statusCurrent == "active" ? "inactive" : "active";

      // Giữ nguyên vị trí cuộn trang khi trang được tải lại toàn bộ.
      sessionStorage.setItem(scrollStorageKey, window.scrollY);

      const action = path + `/${statusChange}/${id}?_method=PATCH`;
      formChangeStatus.action = action;
      formChangeStatus.submit();
    })
  })
}
///end change status

//Xử lý Xóa Delete Item
const buttonsDelete = document.querySelectorAll("[button-delete]");
if (buttonsDelete.length > 0) {
  const formDeleteItem= document.querySelector("#form-delete-item");
  const path = formDeleteItem.getAttribute("data-path");

  buttonsDelete.forEach((button) => {
    button.addEventListener("click", () => {
      const isConfirm = confirm("Bạn có chắc muốn xóa sản phẩm này không?");//trả về true/false
      
      if(isConfirm) {
        const id = button.getAttribute("data-id");
        const action = `${path}/${id}?_method=DELETE`;
        console.log(action);
        formDeleteItem.action = action;
        
        formDeleteItem.submit();
      }
    })
  }
  );
}
//end Delete Item