const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db
const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('密碼不相符') // 判斷兩次密碼是否相符合
    User.findOne({ where: { email: req.body.email } }) // 在資料庫中檢查是否有重複的email,有就拋error
      .then(user => {
        if (user) throw new Error('此信箱已經有註冊過了')
        return bcrypt.hash(req.body.password, 10) // 前面加return,promise會在同一層且避免變成兩個非同步事件,無法確定哪個先完成
      })
      .then(hash => User.create({ // 上面無錯誤,就會將使用者資料寫入資料庫
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_message', '成功註冊帳號!')
        res.redirect('/signin')
      })
      .catch(err => next(err)) // 接住前面拋出的錯誤,呼叫專門處理錯誤的middleware(express有內建的error handler,但也可客製化)
  }
}
module.exports = userController
