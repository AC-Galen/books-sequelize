const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')

router.get('/books/create', adminController.createBook)
router.get('/books/:id/edit', adminController.editBook)
router.get('/books/:id', adminController.getBook)
router.put('/books/:id', adminController.putBook)
router.get('/books', adminController.getBooks)
router.post('/books', adminController.postBook)
router.use('/', (req, res) => res.redirect('/admin/books'))

module.exports = router
