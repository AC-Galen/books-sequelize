const express = require('express')
const router = express.Router()

const upload = require('../../middleware/multer')
const adminController = require('../../controllers/admin-controller')
const categoryController = require('../../controllers/category-controller')

router.get('/books/create', adminController.createBook)
router.get('/books/:id/edit', adminController.editBook)
router.get('/books/:id', adminController.getBook)
router.put('/books/:id', upload.single('image'), adminController.putBook)
router.delete('/books/:id', adminController.deleteBook)
router.get('/books', adminController.getBooks)
router.post('/books', upload.single('image'), adminController.postBook)

router.patch('/users/:id', adminController.patchUser)
router.get('/users', adminController.getUsers)

router.get('/categories', categoryController.getCategories)
router.post('/categories', categoryController.postCategory)
router.use('/', (req, res) => res.redirect('/admin/books'))

module.exports = router
