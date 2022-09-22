const { Book, Category, Comment, User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const bookController = {
  getBooks: (req, res, next) => {
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
        const data = books.rows.map(r => ({ // 加上.rows
          ...r, // 使用展開運算子
          description: r.description.substring(0, 50) // 將原本的description的字串長度,修改成限定50個字
        }))
        return res.render('books', {
          books: data,
          categories,
          categoryId,
          pagination: getPagination(limit, page, books.count) // 把pagination資料傳回樣板
        })
      })
      .catch(err => next(err))
  },
  getBook: (req, res, next) => {
    return Book.findByPk(req.params.id, {
      include: [Category, { model: Comment, include: User }], // 項目變多時改用陣列
      nest: true
    })
      .then(book => {
        if (!book) throw new Error("book didn't exist!")
        return book.increment('viewCounts') // 進去getBook內就加一次數量,若要一次增加1以上的數量就在後面加上{by: 數量}
      })
      .then(book => res.render('book', { book: book.toJSON() })) // 傳入樣板前加上toJSON變成JSON檔案
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Book.findByPk(req.params.id, {
      include: Category,
      nest: true,
      raw: true
    })
      .then(book => {
        if (!book) throw new Error("Book didn't exist!")
        return res.render('dashboard', { book })
      })
      .catch(err => next(err))
  }

}
module.exports = bookController
