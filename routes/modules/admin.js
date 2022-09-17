const express = require('express')
const router = express.Router()

const upload = require('../../middleware/multer')
const adminController = require('../../controllers/admin-controller')

router.get('/books/create', adminController.createBook)
router.get('/books/:id/edit', adminController.editBook)
router.get('/books/:id', adminController.getBook)
router.put('/books/:id', upload.single('image'), adminController.putBook)
router.delete('/books/:id', adminController.deleteBook)
router.get('/books', adminController.getBooks)
router.post('/books', upload.single('image'), adminController.postBook)
router.use('/', (req, res) => res.redirect('/admin/books'))

module.exports = router
