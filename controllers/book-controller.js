const { Book, Category } = require('../models')

const bookController = {
  getBooks: (req, res, next) => {
    const categoryId = Number(req.query.categoryId) || '' // 從網址拿下來的參數是字串,要轉成Number在操作
    return Promise.all([ // 兩個資料表查詢結果都回傳後再接續後面的動作,所以用Promise.all
      Book.findAll({
        include: Category, // 運用include 一並拿出關聯的Category model
        where: { // 查詢條件
          ...categoryId ? { categoryId } : {} // 檢查categoryId是否為空值
        },
        raw: true,
        nest: true
      }),
      Category.findAll({ raw: true })
    ])
      .then(([books, categories]) => {
        const data = books.map(r => ({
          ...r, // 使用展開運算子
          description: r.description.substring(0, 50) // 將原本的description的字串長度,修改成限定50個字
        }))
        return res.render('books', {
          books: data,
          categories,
          categoryId
        })
      })
      .catch(err => next(err))
  },
  getBook: (req, res, next) => {
    return Book.findByPk(req.params.id, {
      include: Category,
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
