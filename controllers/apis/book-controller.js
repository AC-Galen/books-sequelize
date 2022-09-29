const booksServices = require('../../services/book-services')

const bookController = {
  getBooks: (req, res, next) => {
    booksServices.getBooks(req, (err, data) => err ? next(err) : res.json(data))
  }
}

module.exports = bookController
