const dayjs = require('dayjs')
module.exports = {
  currentYear: () => dayjs().year(), // 取得當年年份作為currentYear的屬性值並導出
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this) // 若a和b相等,回傳options.fn(this),不相等則回傳 options.inverse(this)
  }
}
