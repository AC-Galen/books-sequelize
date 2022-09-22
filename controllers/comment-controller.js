const { Comment, User, Book } = require('../models')
const commentController = {
  postComment: (req, res, next) => {
    const { bookId, text } = req.body
    const userId = req.user.id
    if (!text) throw new Error('Comment text is required!')
    return Promise.all([
      User.findByPk(userId),
      Book.findByPk(bookId)
    ])
      .then(([user, book]) => {
        if (!user) throw new Error("User didn't exist!")
        if (!book) throw new Error("Book didn't exist!")
        return Comment.create({
          text,
          bookId,
          userId
        })
      })
      .then(() => {
        res.redirect(`/books/${bookId}`)
      })
      .catch(err => next(err))
  }
}
module.exports = commentController
