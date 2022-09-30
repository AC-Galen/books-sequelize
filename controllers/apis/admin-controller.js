const adminServices = require('../../services/admin-services')

const adminController = {
  getBooks: (req, res, next) => {
    adminServices.getBooks(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  deleteBook: (req, res, next) => {
    adminServices.deleteBook(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  }
}
module.exports = adminController
