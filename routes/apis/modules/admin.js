const express = require('express')
const router = express.Router()

const adminController = require('../../../controllers/apis/admin-controller')
const upload = require('../../../middleware/multer')

router.delete('/books/:id', adminController.deleteBook)
router.get('/books', adminController.getBooks)
router.post('/books', upload.single('image'), adminController.postBook)

module.exports = router
