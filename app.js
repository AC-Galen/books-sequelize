if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('./config/passport')

const app = express()
const PORT = process.env.PORT

const routes = require('./routes')

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(passport.initialize()) // 初始化passport
app.use(passport.session()) // 啟動session功能
app.use(flash()) // 掛套件
app.use((req, res, next) => { // 設定success和warning信息
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  next()
})

app.use(routes)

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})

module.exports = app
