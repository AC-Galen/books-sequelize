const { Book, Category } = require('../models')

const bookController = {
  getBooks: (req, res) => {
    return Book.findAll({
      include: Category, // 運用include 一並拿出關聯的Category model
      raw: true,
      nest: true
    }).then(books => {
      const data = books.map(r => ({
        ...r, // 使用展開運算子
        description: r.description.substring(0, 50) // 將原本的description的字串長度,修改成限定50個字
      }))
      return res.render('books', {
        books: data
      })
    })
  }
}
module.exports = bookController
