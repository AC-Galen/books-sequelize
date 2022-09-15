const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')

router.get('/books', adminController.getBooks)
router.use('/', (req, res) => res.redirect('/admin/books'))

module.exports = router
