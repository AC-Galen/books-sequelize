const { Book, Category } = require('../models')

const bookController = {
  getBooks: (req, res) => {
    return Book.findAll({
      include: Category, // 運用include 一並拿出關聯的Category model
      raw: true,
      nest: true
    }).then(books => {
      const data = books.map(r => ({
        ...r, // 使用展開運算子
        description: r.description.substring(0, 50) // 將原本的description的字串長度,修改成限定50個字
      }))
      return res.render('books', {
        books: data
      })
    })
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
