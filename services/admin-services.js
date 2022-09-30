const { Book, Category } = require('../models')

const adminServices = {
  getBooks: (req, cb) => {
    Book.findAll({
      raw: true,
      nest: true, // 把database拿到的資料進行整理,方便後續取用
      include: [Category] // 傳入model物件需要透過include把關聯資料拉進來,再把資料給findAll的回傳值內
    })
      .then(books => cb(null, { books }))
      .catch(err => cb(err))
  }
}

module.exports = adminServices
