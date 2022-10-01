const { Book, Category, Comment, User } = require('../../models')
const booksServices = require('../../services/book-services')

const bookController = {
  getBooks: (req, res, next) => {
    booksServices.getBooks(req, (err, data) => err ? next(err) : res.render('books', data))
  },
  getBook: (req, res, next) => {
    return Book.findByPk(req.params.id, {
      include: [Category,
        { model: Comment, include: User }, // 項目變多時改用陣列
        { model: User, as: 'FavoritedUsers' },
        { model: User, as: 'LikedUsers' }
      ]
    })
      .then(book => {
        if (!book) throw new Error("book didn't exist!")
        return book.increment('viewCounts') // 進去getBook內就加一次數量,若要一次增加1以上的數量就在後面加上{by: 數量}
      })
      .then(book => {
        const isFavorited = book.FavoritedUsers.some(f => f.id === req.user.id) // some 的好處是只要帶迭代過程中找到一個符合條件的項目後，就會立刻回傳 true，後面的項目不會繼續執行，比起 map 方法無論如何都會從頭到尾把陣列裡的項目執行一次，some 因為加入了判斷條件 f.id === req.user.id，可以有效減少執行次數。
        const isLiked = book.LikedUsers.some(f => f.id === req.user.id)
        res.render('book', {
          book: book.toJSON(), // 傳入樣板前加上toJSON變成JSON檔案
          isFavorited,
          isLiked
        })
      })
      .catch(err => next(err))
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
        where: { userId: req.user.id },
        group: 'book_id',
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
