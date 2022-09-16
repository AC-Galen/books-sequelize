const { ensureAuthenticated, getUser } = require('../helpers/auth-helpers')

const authenticated = (req, res, next) => {
  if (ensureAuthenticated(req)) { // 判斷是否有登入,有就往下走
    return next()
  }
  res.redirect('/sign') // 沒有就丟回登入頁面
}
const authenticatedAdmin = (req, res, next) => {
  if (ensureAuthenticated(req)) {
    if (getUser(req).isAdmin) return next() // 有登入,是admin可往下走
    res.redirect('/') // 不是admin 丟回首頁
  } else {
    res.redirect('/signin')
  }
}
module.exports = {
  authenticated,
  authenticatedAdmin
}
