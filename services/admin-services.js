const { Book, Category, Comment, User } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helper')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const adminServices = {
  getBooks: (req, cb) => {
    const DEFAULT_LIMIT = 15
    const categoryId = Number(req.query.categoryId) || ''
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    return Promise.all([
      Book.findAndCountAll({
        include: Category, // 運用include 一並拿出關聯的Category model
        where: {
          ...categoryId ? { categoryId } : {} // 檢查categoryId是否為空值
        },
        limit,
        offset,
        raw: true,
        nest: true
      }),
      Category.findAll({ raw: true })
    ])
      .then(([books, categories]) => {
        const data = books.rows.map(r => ({
          ...r
        }))
        return cb(null, {
          books: data,
          categories,
          categoryId,
          pagination: getPagination(limit, page, books.count)
        })
      })
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
    return Book.findByPk(req.params.id, {
      include: [Category,
        { model: Comment, include: User }
      ]
    })
      .then(book => {
        if (!book) throw new Error("book didn't exist!")
        return cb(null, { book: book.toJSON() })
      })
      .catch(err => cb(err))
  }
}
module.exports = adminServices
