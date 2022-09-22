const getOffset = (limit = 10, page = 1) => (page - 1) * limit // 偏移量
const getPagination = (limit = 10, page = 1, total = 50) => {
  const totalPage = Math.ceil(total / limit) // 共有幾頁,ceil無條件進位
  const pages = Array.from({ length: totalPage }, (_, index) => index + 1) // 陣列,對應到導覽陣列,對應到導覽器的[1, 2, 3, 4, 5]
  const currentPage = page < 1 ? 1 : page > totalPage ? totalPage : page // 代表當前是第幾頁
  const prev = currentPage - 1 < 1 ? 1 : currentPage - 1 // 前一頁是第幾頁
  const next = currentPage + 1 > totalPage ? totalPage : currentPage + 1 // 下一頁是第幾頁
  return {
    pages,
    totalPage,
    currentPage,
    prev,
    next
  }
}

module.exports = {
  getOffset,
  getPagination
}
