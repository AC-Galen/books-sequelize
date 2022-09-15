const adminController = {
  getBooks: (req, res) => {
    return res.render('admin/books')
  }
}
module.exports = adminController
