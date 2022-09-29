const express = require('express')
const router = express.Router()

const bookController = require('../../controllers/apis/book-controller')

router.get('/books', bookController.getBooks)

module.exports = router
