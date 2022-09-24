const { Book, Category, Comment, User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const bookController = {
  getBooks: (req, res, next) => {
    const DEFAULT_LIMIT = 9 // 第一頁有9筆資料,可優化(讓使用者選擇每頁選擇N筆資料)
    const categoryId = Number(req.query.categoryId) || '' // 從網址拿下來的參數是字串,要轉成Number在操作
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    return Promise.all([ // 兩個資料表查詢結果都回傳後再接續後面的動作,所以用Promise.all
      Book.findAndCountAll({
        include: Category, // 運用include 一並拿出關聯的Category model
        where: { // 查詢條件
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
        const favoritedBooksId = req.user && req.user.FavoritedBooks.map(fr => fr.id)
        const data = books.rows.map(r => ({ // 加上.rows
          ...r, // 使用展開運算子
          description: r.description.substring(0, 50), // 將原本的description的字串長度,修改成限定50個字
          isFavorited: favoritedBooksId.includes(r.id) // 檢查是不是有被使用者收藏，有的話 isFavorited 就會是 true，否則會是 false，物件上就有一個 isFavorited 屬性，因此後面 Handlebars 在處理資料時，讓 Handlebars 可以用 if/else 去判斷要渲染哪一個按鈕
        }))
        return res.render('books', {
          books: data,
          categories,
          categoryId,
          pagination: getPagination(limit, page, books.count) // 把pagination資料傳回樣板
        })
      })
      .catch(err => next(err))
  },
  getBook: (req, res, next) => {
    return Book.findByPk(req.params.id, {
      include: [Category,
        { model: Comment, include: User }, // 項目變多時改用陣列
        { model: User, as: 'FavoritedUsers' }
      ]
    })
      .then(book => {
        if (!book) throw new Error("book didn't exist!")
        return book.increment('viewCounts') // 進去getBook內就加一次數量,若要一次增加1以上的數量就在後面加上{by: 數量}
      })
      .then(book => {
        const isFavorited = book.FavoritedUsers.some(f => f.id === req.user.id) // some 的好處是只要帶迭代過程中找到一個符合條件的項目後，就會立刻回傳 true，後面的項目不會繼續執行，比起 map 方法無論如何都會從頭到尾把陣列裡的項目執行一次，some 因為加入了判斷條件 f.id === req.user.id，可以有效減少執行次數。
        res.render('book', {
          book: book.toJSON(), // 傳入樣板前加上toJSON變成JSON檔案
          isFavorited
        })
      })
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Book.findByPk(req.params.id, {
      include: Category
    })
      .then(book => {
        if (!book) throw new Error("Book didn't exist!")
        return res.render('dashboard', { book: book.toJSON() })
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
  }

}
module.exports = bookController
