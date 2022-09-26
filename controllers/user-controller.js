const bcrypt = require('bcryptjs')
const { getUser } = require('../helpers/auth-helpers')
const { imgurFileHandler } = require('../helpers/file-helper')

const { User, Comment, Book, Favorite, Like } = require('../models')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('密碼不相符') // 判斷兩次密碼是否相符合
    User.findOne({ where: { email: req.body.email } }) // 在資料庫中檢查是否有重複的email,有就拋error
      .then(user => {
        if (user) throw new Error('此信箱已經有註冊過了')
        return bcrypt.hash(req.body.password, 10) // 前面加return,promise會在同一層且避免變成兩個非同步事件,無法確定哪個先完成
      })
      .then(hash => User.create({ // 上面無錯誤,就會將使用者資料寫入資料庫
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_message', '成功註冊帳號!')
        res.redirect('/signin')
      })
      .catch(err => next(err)) // 接住前面拋出的錯誤,呼叫專門處理錯誤的middleware(express有內建的error handler,但也可客製化)
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/books')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  getUser: (req, res, next) => {
    return User.findByPk(req.params.id, {
      include: [{ model: Comment, include: Book }], // 多層關聯
      order: [[Comment, 'createdAt', 'desc']] // order(排序)
    })
      .then(targetUser => {
        if (!targetUser) throw new Error("User didn't exist!")
        res.render('users/profile', { user: getUser(req), targetUser: targetUser.toJSON() })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    return User.findByPk(req.params.id, {
      raw: true
    })
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('User name is required!')
    const id = req.params.id
    const { file } = req
    return Promise.all([
      User.findByPk(id),
      imgurFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error("User didn't exist!")
        user.update({
          name,
          image: filePath || user.image
        })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect(`/users/${id}`)
      })
      .catch(err => next(err))
  },
  addFavorite: (req, res, next) => {
    const { bookId } = req.params
    return Promise.all([
      Book.findByPk(bookId),
      Favorite.findOne({
        where: {
          userId: req.user.id,
          bookId
        }
      })
    ])
      .then(([book, favorite]) => {
        if (!book) throw new Error("Book didn't exist!")
        if (favorite) throw new Error('You have favorited this book!')
        return Favorite.create({
          userId: req.user.id,
          bookId
        })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeFavorite: (req, res, next) => {
    return Favorite.findOne({
      where: { // 確認收藏關聯是否存在
        userId: req.user.id,
        bookId: req.params.bookId
      }
    })
      .then(favorite => {
        if (!favorite) throw new Error("You haven't favorited this book")
        return favorite.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  addLike: (req, res, next) => {
    const { bookId } = req.params
    return Promise.all([
      Book.findByPk(bookId),
      Like.findOne({
        where: {
          userId: req.user.id,
          bookId
        }
      })
    ])
      .then(([book, like]) => {
        if (!book) throw new Error("Book didn't exist!")
        if (like) throw new Error('You have liked this Book!')
        return Like.create({
          userId: req.user.id,
          bookId
        })
      })
      .then(() => res.redirect('book'))
      .catch(err => next(err))
  },
  removeLike: (req, res, next) => {
    const { bookId } = req.params
    return Like.findOne({
      where: {
        userId: req.user.id,
        bookId
      }
    })
      .then(like => {
        if (!like) throw new Error("You haven't liked this Book!")
        return like.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  getTopUsers: (req, res, next) => {
    return User.findAll({
      include: [{ model: User, as: 'Followers' }]
    })
      .then(users => {
        users = users.map(user => ({ // 把每個 user 項目都拿出來處理一次，並把新陣列儲存在 users 裡
          ...user.toJSON(), // 整理格式
          followerCount: user.Followers.length, // 計算追蹤人數
          isFollowed: req.user.Followings.some(f => f.id === user.id) // 判斷目前登入使用者是否已追蹤user物件
        }))
        res.render('top-users', { users: users })
      })
      .catch(err => next(err))
  }
}
module.exports = userController
