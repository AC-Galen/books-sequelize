const { Book } = require('../models')

const adminController = {
  getBooks: (req, res, next) => {
    Book.findAll({
      raw: true
    })
      .then(books => res.render('admin/books', { books }))
      .catch(err => next(err))
  },
  createBook: (req, res) => {
    res.render('admin/create-book')
  },
  postBook: (req, res, next) => {
    const { name, isbn, author, publisher, description } = req.body // 從req.body拿表單資料
    if (!name) throw new Error('book name is required!') // name必填,否則就會在畫面提示錯誤
    Book.create({
      name,
      isbn,
      author,
      publisher,
      description
    })
      .then(() => {
        req.flash('success_messages', 'Book was successfully created')
        res.redirect('/admin/books')
      })
      .catch(err => next(err))
  },
  getBook: (req, res, next) => {
    Book.findByPk(req.params.id, { // 去資料庫找id
      raw: true // 找到後整理格式並回傳(轉換成JS原生物件)
    })
      .then(book => {
        if (!book) throw new Error("Book didn't exist!")
        res.render('admin/book', { book })
      })
      .catch(err => next(err))
  }
}
module.exports = adminController
