const { Book, Category, Comment, User } = require('../../models')
const booksServices = require('../../services/book-services')

const bookController = {
  getBooks: (req, res, next) => {
    booksServices.getBooks(req, (err, data) => err ? next(err) : res.render('books', data))
  },
  getBook: (req, res, next) => {
    booksServices.getBook(req, (err, data) => err ? next(err) : res.render('book', data))
  },
  getDashboard: (req, res, next) => {
    return Promise.all([
      Book.findByPk(req.params.id, {
        include: [Category,
          { model: User, as: 'FavoritedUsers' },
          { model: User, as: 'LikedUsers' }
        ]
      }),
      Comment.findAll({
        include: [Book],
        where: { book_id: req.params.id },
        raw: true,
        nest: true
      })
    ])
      .then(([book, comments]) => {
        if (!book) throw new Error("Book didn't exist!")
        return res.render('dashboard', { book: book.toJSON(), comments })
      })
      .catch(err => next(err))
  },
  getFeeds: (req, res, next) => {
    Promise.all([ // 非同步
      Book.findAll({
        limit: 10, // 指定數量
        order: [['createdAt', 'DESC']], // 傳入要排序的欄位
        include: [Category], // 指定引入的model
        raw: true,
        nest: true
      }),
      Comment.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [User, Book],
        raw: true,
        nest: true
      })
    ])
      .then(([books, comments]) => {
        res.render('feeds', {
          books,
          comments
        })
      })
      .catch(err => next(err))
  },
  getTopBooks: (req, res, next) => {
    return Book.findAll({
      include: [{ model: User, as: 'FavoritedUsers' }]
    })
      .then(books => {
        const result = books
          .map(book => ({
            ...book.toJSON(),
            favoritedCount: book.FavoritedUsers.length,
            isFavorited: req.user && req.user.FavoritedBooks
              .some(b => b.id === book.id)
          }))
          .sort((a, b) => b.favoritedCount - a.favoritedCount)
          .slice(0, 10)
        res.render('top-books', { books: result })
      })
      .catch(err => next(err))
  }

}
module.exports = bookController
