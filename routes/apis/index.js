const express = require('express')
const router = express.Router()

const passport = require('../../config/passport')
const admin = require('./modules/admin')

const bookController = require('../../controllers/apis/book-controller')
const userController = require('../../controllers/apis/user-controller')

const { authenticated, authenticatedAdmin } = require('../../middleware/api-auth')
const { apiErrorHandler } = require('../../middleware/error-handler')

router.use('/admin', authenticated, authenticatedAdmin, admin)

router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)
router.use('/', apiErrorHandler)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

router.get('/books/top', authenticated, bookController.getTopBooks)
router.get('/books/feeds', authenticated, bookController.getFeeds)
router.get('/books/:id/dashboard', authenticated, bookController.getDashboard)
router.get('/books/:id', authenticated, bookController.getBook)
router.get('/books', authenticated, bookController.getBooks)

router.use('/', apiErrorHandler)

module.exports = router
