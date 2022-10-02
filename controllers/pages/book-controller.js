const booksServices = require('../../services/book-services')

const bookController = {
  getBooks: (req, res, next) => {
    booksServices.getBooks(req, (err, data) => err ? next(err) : res.render('books', data))
  },
  getBook: (req, res, next) => {
    booksServices.getBook(req, (err, data) => err ? next(err) : res.render('book', data))
  },
  getDashboard: (req, res, next) => {
    booksServices.getDashboard(req, (err, data) => err ? next(err) : res.render('dashboard', data))
  },
  getFeeds: (req, res, next) => {
    booksServices.getFeeds(req, (err, data) => err ? next(err) : res.render('feeds', data))
  },
  getTopBooks: (req, res, next) => {
    booksServices.getTopBooks(req, (err, data) => err ? next(err) : res.render('top-books', data))
  }
}
module.exports = bookController
