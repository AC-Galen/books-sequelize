const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const upload = require('../middleware/multer')

const admin = require('./modules/admin')

const bookController = require('../controllers/book-controller')
const userController = require('../controllers/user-controller')
const commentController = require('../controllers/comment-controller')

const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')

router.use('/admin', authenticatedAdmin, admin)

router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

router.get('/users/:id', authenticated, userController.getUser)
router.get('/users/:id/edit', authenticated, userController.editUser)
router.put('/users/:id', authenticated, upload.single('image'), userController.putUser)

router.get('/logout', userController.logout)

router.get('/books/:id', authenticated, bookController.getBook)
router.get('/books/:id/dashboard', authenticated, bookController.getDashboard)
router.get('/books', authenticated, bookController.getBooks)

router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)
router.post('/comments', authenticated, commentController.postComment)

router.use('/', (req, res) => res.redirect('/books'))
router.use('/', generalErrorHandler)
module.exports = router
