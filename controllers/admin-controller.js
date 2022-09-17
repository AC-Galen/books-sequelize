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
  }
}
module.exports = adminController
