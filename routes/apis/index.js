const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')

const bookController = require('../../controllers/apis/book-controller')

router.use('/admin', admin)
router.get('/books', bookController.getBooks)

module.exports = router
