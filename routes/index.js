const express = require('express')
const router = express.Router()

const admin = require('./modules/admin')

const bookController = require('../controllers/book-controller')
const userController = require('../controllers/user-controller')

const { generalErrorHandler } = require('../middleware/error-handler')

router.use('/admin', admin)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

router.get('/books', bookController.getBooks)
router.use('/', (req, res) => res.redirect('/books'))
router.use('/', generalErrorHandler)
module.exports = router
