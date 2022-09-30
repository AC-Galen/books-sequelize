const adminServices = require('../../services/admin-services')

const adminController = {
  getBooks: (req, res, next) => {
    adminServices.getBooks(req, (err, data) => err ? next(err) : res.json(data))
  }
}
module.exports = adminController
