const { Book, Category } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const booksServices = {
  getBooks: (req, callback) => {
    const DEFAULT_LIMIT = 9 // 第一頁有9筆資料,可優化(讓使用者選擇每頁選擇N筆資料)
    const categoryId = Number(req.query.categoryId) || '' // 從網址拿下來的參數是字串,要轉成Number在操作
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    return Promise.all([ // 兩個資料表查詢結果都回傳後再接續後面的動作,所以用Promise.all
      Book.findAndCountAll({
        include: Category, // 運用include 一並拿出關聯的Category model
        where: { // 查詢條件
          ...categoryId ? { categoryId } : {} // 檢查categoryId是否為空值
        },
        limit,
        offset,
        raw: true,
        nest: true
      }),
      Category.findAll({ raw: true })
    ])
      .then(([books, categories]) => {
        const favoritedBooksId = req.user?.FavoritedBooks ? req.user.FavoritedBooks.map(fr => fr.id) : []
        const likedBookId = req.user?.LikedBooks ? req.user.LikedBooks.map(book => book.id) : []
        const data = books.rows.map(r => ({ // 加上.rows
          ...r, // 使用展開運算子
          description: r.description.substring(0, 50), // 將原本的description的字串長度,修改成限定50個字
          isFavorited: favoritedBooksId.includes(r.id), // 檢查是不是有被使用者收藏，有的話 isFavorited 就會是 true，否則會是 false，物件上就有一個 isFavorited 屬性，因此後面 Handlebars 在處理資料時，讓 Handlebars 可以用 if/else 去判斷要渲染哪一個按鈕
          isLiked: likedBookId.includes(r.id)
        }))
        return callback(null, {
          books: data,
          categories,
          categoryId,
          pagination: getPagination(limit, page, books.count)
        })
      })
      .catch(err => callback(err))
  }
}

module.exports = booksServices
