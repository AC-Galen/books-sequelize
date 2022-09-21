const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

const admin = require('./modules/admin')

const bookController = require('../controllers/book-controller')
const userController = require('../controllers/user-controller')

const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')

router.use('/admin', authenticatedAdmin, admin)

router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

router.get('/logout', userController.logout)
router.get('/books/:id', authenticated, bookController.getBook)
router.get('/books', authenticated, bookController.getBooks)
router.use('/', (req, res) => res.redirect('/books'))
router.use('/', generalErrorHandler)
module.exports = router
