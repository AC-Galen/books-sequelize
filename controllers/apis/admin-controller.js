const adminServices = require('../../services/admin-services')

const adminController = {
  getBooks: (req, res, next) => {
    adminServices.getBooks(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  getBook: (req, res, next) => {
    adminServices.getBook(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  postBook: (req, res, next) => {
    adminServices.postBook(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  deleteBook: (req, res, next) => {
    adminServices.deleteBook(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  }
}
module.exports = adminController
