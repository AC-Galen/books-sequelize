const express = require('express')
const router = express.Router()

const adminController = require('../../../controllers/apis/admin-controller')

router.delete('/books/:id', adminController.deleteBook)
router.get('/books', adminController.getBooks)

module.exports = router
