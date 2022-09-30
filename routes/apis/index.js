const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')

const bookController = require('../../controllers/apis/book-controller')
const { apiErrorHandler } = require('../../middleware/error-handler')

router.use('/admin', admin)
router.get('/books', bookController.getBooks)
router.use('/', apiErrorHandler)

module.exports = router
