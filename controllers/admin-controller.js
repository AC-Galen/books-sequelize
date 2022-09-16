const { Book } = require('../models')

const adminController = {
  getBooks: (req, res, next) => {
    Book.findAll({ // 若沒加直接findAll,回傳的會是物件實例,內含各種sequelize提供的原生方法
      raw: true // 收到資料後就回直接放進面板,使用{raw:true}會讓拿到的資料比較簡潔
    })
      .then(books => res.render('admin/books', { books }))
      .catch(err => next(err))
  }
}
module.exports = adminController
