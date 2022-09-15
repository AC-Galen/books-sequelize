const express = require('express')
const router = express.Router()

const bookController = require('../controllers/book-controller')

router.get('/books', bookController.getBooks)
router.use('/', (req, res) => res.redirect('/books'))

module.exports = router
