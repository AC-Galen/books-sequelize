const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const { User, Book } = require('../models')

// 設定passport strategy
passport.use(new LocalStrategy(
  { // 客製化使用者資料
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // 對應下面的req,可把callback的第一個參數拿到req內,就可呼叫req.flash把想要的客製化訊息放入
  },
  (req, email, password, cb) => { // 使用者認證程序(callback function)
    User.findOne({ where: { email } }) // 查詢User資料庫帳號是否存在
      .then(user => {
        if (!user) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
        bcrypt.compare(password, user.password).then(res => {
          if (!res) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
          return cb(null, user) // 認證通過
        })
      })
  }
))

passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => { //  反序列
  return User.findByPk(id, { // 從這邊拿到使用者的資料,所以變動
    include: [
      { model: Book, as: 'FavoritedBooks' }, // as 要引入的關係(名字)
      { model: Book, as: 'LikedBooks' }
    ]
  })
    .then(user => cb(null, user.toJSON()))
    .catch(err => cb(err))
})

module.exports = passport
