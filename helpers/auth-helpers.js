const getUser = req => {
  return req.user || null // req.user ? req.user : null 是等價的，意思是若 req.user 存在就回傳 req.user，不存在的話函式就會回傳空值
}
const ensureAuthenticated = req => {
  return req.isAuthenticated()
}
module.exports = {
  getUser,
  ensureAuthenticated
} // 解構賦值,這邊export什麼,在其他地方的require就會是什麼
