module.exports = (objectPagination, query, countProducts) => {
    if (query.page) {
      objectPagination.currentPage = parseInt(query.page);
    }
  
    objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItem;
  
    //tính số lượng trang
    const totalPage = Math.ceil(countProducts / objectPagination.limitItem);
    objectPagination.totalPage = totalPage; //Thêm vào object

    return objectPagination;
}