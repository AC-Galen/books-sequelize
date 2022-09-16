const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')
const { authenticatedAdmin } = require('../../middleware/auth')

router.get('/books', authenticatedAdmin, adminController.getBooks)
router.use('/', (req, res) => res.redirect('/admin/books'))

module.exports = router
