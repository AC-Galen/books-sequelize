const { Book, User, Category } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helper')

const adminController = {
  getBooks: (req, res, next) => {
    Book.findAll({
      raw: true,
      nest: true, // 把database拿到的資料進行整理,方便後續取用
      include: [Category] // 傳入model物件需要透過include把關聯資料拉進來,再把資料給findAll的回傳值內
    })
      .then(books => res.render('admin/books', { books }))
      .catch(err => next(err))
  },
  createBook: (req, res) => {
    res.render('admin/create-book')
  },
  postBook: (req, res, next) => {
    const { name, isbn, author, publisher, description } = req.body
    if (!name) throw new Error('book name is required!')
    const { file } = req // 把檔案拿出
    imgurFileHandler(file) // 把拿出的檔案給file-helper處理
      .then(filePath => Book.create({ // 在create這筆資料
        name,
        isbn,
        author,
        publisher,
        description,
        image: filePath || null // 若filePath值的檔案路徑字串(使用者上傳就會被判定為TruThy),就將image的直射為檔案路徑,如果為空(判斷沒有上傳,也就是沒有路徑,就會判定為Falsy),就將image直射為null
      }))

      .then(() => {
        req.flash('success_messages', 'Book was successfully created')
        res.redirect('/admin/books')
      })
      .catch(err => next(err))
  },
  getBook: (req, res, next) => {
    Book.findByPk(req.params.id, { // 去資料庫找id
      raw: true, // 找到後整理格式並回傳(轉換成JS原生物件)
      nest: true,
      include: [Category]
    })
      .then(book => {
        if (!book) throw new Error("Book didn't exist!")
        res.render('admin/book', { book })
      })
      .catch(err => next(err))
  },
  editBook: (req, res, next) => {
    Book.findByPk(req.params.id, {
      raw: true
    })
      .then(book => {
        if (!book) throw new Error("Book didn't exist!")
        res.render('admin/edit-book', { book })
      })
      .catch(err => next(err))
  },
  putBook: (req, res, next) => {
    const { name, isbn, author, publisher, description } = req.body
    if (!name) throw new Error('Book name is required!')
    const { file } = req // 取出檔案
    Promise.all([ // 非同步
      Book.findByPk(req.params.id), // 對照資料庫看有沒有這本書
      imgurFileHandler(file) // 把檔案傳到file-helper處理
    ])
      .then(([book, filePath]) => { // 兩件事都結束後
        if (!book) throw new Error("Book did't exist!")
        return book.update({ // 修改這筆資料
          name,
          isbn,
          author,
          publisher,
          description,
          image: filePath || null // 如果 filePath 是 Truthy (使用者有上傳新照片) 就用 filePath，是 Falsy (使用者沒有上傳新照片) 就沿用原本資料庫內的值
        })
      })
      .then(() => {
        req.flash('success_messages', 'book was successfully to update')
        res.redirect('/admin/books')
      })
      .catch(err => next(err))
  },
  deleteBook: (req, res, next) => {
    return Book.findByPk(req.params.id)
      .then(book => {
        if (!book) throw new Error("Book didn't exist!")
        return book.destroy() // sequelize 提供的destroy()方法刪除資料,刪除時不需要加{raw:true}
      })
      .then(() => res.redirect('/admin/books'))
      .catch(err => next(err))
  }
}
module.exports = adminController
