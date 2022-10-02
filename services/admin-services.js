const { Book, Category } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helper')

const adminServices = {
  getBooks: (req, cb) => {
    Book.findAll({
      raw: true,
      nest: true, // 把database拿到的資料進行整理,方便後續取用
      include: [Category] // 傳入model物件需要透過include把關聯資料拉進來,再把資料給findAll的回傳值內
    })
      .then(books => cb(null, { books }))
      .catch(err => cb(err))
  },
  postBook: (req, cb) => {
    const { name, isbn, author, publisher, description, categoryId } = req.body
    if (!name) throw new Error('book name is required!')
    const { file } = req
    imgurFileHandler(file) // 把拿出的檔案給file-helper處理
      .then(filePath => Book.create({ // 在create這筆資料
        name,
        isbn,
        author,
        publisher,
        description,
        image: filePath || null, // 若filePath值的檔案路徑字串(使用者上傳就會被判定為TruThy),就將image的直射為檔案路徑,如果為空(判斷沒有上傳,也就是沒有路徑,就會判定為Falsy),就將image直射為null
        categoryId
      }))
      .then(newBook => cb(null, { book: newBook }))
      .catch(err => cb(err))
  },
  deleteBook: (req, cb) => {
    Book.findByPk(req.params.id)
      .then(book => {
        if (!book) {
          const err = new Error("Book didn't exist!")
          err.status = 404
          throw err
        }
        return book.destroy()
      })
      .then(deleteBook => cb(null, { book: deleteBook }))
      .catch(err => cb(err))
  },
  getBook: (req, cb) => {
    Book.findByPk(req.params.id, { // 去資料庫找id
      raw: true, // 找到後整理格式並回傳(轉換成JS原生物件)
      nest: true,
      include: [Category]
    })
      .then(book => cb(null, { book }))
      .catch(err => cb(err))
  }
}

module.exports = adminServices
