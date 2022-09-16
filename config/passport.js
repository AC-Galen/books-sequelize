const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
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
passport.deserializeUser((id, cb) => {
  User.findByPk(id).then(user => {
    user = user.toJSON() // 利用toJSON 將物件格式整理,如果沒有整理,在前端是無法簡單拿到資料的
    return cb(null, user)
  })
})

module.exports = passport
