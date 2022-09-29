const { Book, Category } = require('../../models')
const { getOffset, getPagination } = require('../../helpers/pagination-helper')

const bookController = {
  getBooks: (req, res, next) => {
    const DEFAULT_LIMIT = 9
    const categoryId = Number(req.query.categoryId) || ''
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    return Promise.all([
      Book.findAndCountAll({
        include: Category,
        where: {
          ...categoryId ? { categoryId } : {}
        },
        limit,
        offset,
        raw: true,
        nest: true
      }),
      Category.findAll({ raw: true })
    ])
      .then(([books, categories]) => {
        const favoritedBooksId = req.user?.FavoritedBooks ? req.user.FavoritedBooks.map(fr => fr.id) : []
        const likedBookId = req.user?.LikedBooks ? req.user.LikedBooks.map(book => book.id) : []
        const data = books.rows.map(r => ({
          ...r,
          description: r.description.substring(0, 50),
          isFavorited: favoritedBooksId.includes(r.id),
          isLiked: likedBookId.includes(r.id)
        }))
        return res.json({
          books: data,
          categories,
          categoryId,
          pagination: getPagination(limit, page, books.count)
        })
      })
      .catch(err => next(err))
  }
}

module.exports = bookController
