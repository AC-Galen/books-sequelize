const adminServices = require('../../services/admin-services')

const { Book, Category, User } = require('../../models')
const { imgurFileHandler } = require('../../helpers/file-helper')

const adminController = {
  getBooks: (req, res, next) => {
    adminServices.getBooks(req, (err, data) => err ? next(err) : res.render('admin/books', data))
  },
  createBook: (req, res, next) => {
    return Category.findAll({
      raw: true
    })
      .then(categories => res.render('admin/create-book', { categories }))
      .catch(err => next(err))
  },
  postBook: (req, res, next) => {
    adminServices.postBook(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_messages', 'book was successfully created')
      res.redirect('/admin/books')
    })
  },
  getBook: (req, res, next) => {
    adminServices.getBook(req, (err, data) => err ? next(err) : res.render('admin/book', data))
  },
  editBook: (req, res, next) => {
    Promise.all([
      Book.findByPk(req.params.id, { raw: true }),
      Category.findAll({ raw: true })
    ])
      .then(([book, categories]) => {
        if (!book) throw new Error("Book didn't exist!")
        res.render('admin/edit-book', { book, categories })
      })
      .catch(err => next(err))
  },
  putBook: (req, res, next) => {
    const { name, isbn, author, publisher, description, categoryId } = req.body
    if (!name || !isbn || !author || !publisher || !description) throw new Error('Information is incomplete!')
    const { file } = req
    Promise.all([
      Book.findByPk(req.params.id),
      imgurFileHandler(file) // 把檔案傳到file-helper處理
    ])
      .then(([book, filePath]) => {
        if (!book) throw new Error("Book did't exist!")
        return book.update({
          name,
          isbn,
          author,
          publisher,
          description,
          image: filePath || null, // 如果 filePath 是 Truthy (使用者有上傳新照片) 就用 filePath，是 Falsy (使用者沒有上傳新照片) 就沿用原本資料庫內的值
          categoryId
        })
      })
      .then(() => {
        req.flash('success_messages', 'book was successfully to update')
        res.redirect('/admin/books')
      })
      .catch(err => next(err))
  },
  deleteBook: (req, res, next) => {
    adminServices.deleteBook(req, (err, data) => {
      if (err) return next(err)
      req.session.deleteData = data
      return res.redirect('/admin/books')
    })
  },
  getUsers: (req, res, next) => {
    return User.findAll({
      raw: true
    })
      .then(users => res.render('admin/users', { users }))
      .catch(err => next(err))
  },
  patchUser: (req, res, next) => {
    return User.findByPk(req.params.id)
      .then(user => {
        if (!user) throw new Error("user didn't exist!")
        if (user.email === 'root@example.com') {
          req.flash('error_messages', '禁止變更 root 權限')
          return res.redirect('back')
        }
        return user.update({ isAdmin: !user.isAdmin })
      })
      .then(() => {
        req.flash('success_messages', '使用者權限變更成功')
        res.redirect('/admin/users')
      })
      .catch(err => next(err))
  }
}
module.exports = adminController
