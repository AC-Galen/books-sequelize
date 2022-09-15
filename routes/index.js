const express = require('express')
const router = express.Router()

const bookController = require('../controllers/book-controller')
const admin = require('./modules/admin')

router.use('/admin', admin)
router.get('/books', bookController.getBooks)
router.use('/', (req, res) => res.redirect('/books'))

module.exports = router
