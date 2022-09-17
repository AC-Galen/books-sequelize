const multer = require('multer')
const upload = multer({ dest: 'temp/' }) // multer套件提供的方法,用參數設定使用者上船的圖片會暫時存到temp這個臨時資料夾中(temp須定時清理)

module.exports = upload
