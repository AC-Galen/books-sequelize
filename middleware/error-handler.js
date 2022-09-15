module.exports = {
  generalErrorHandler (err, req, res, next) {
    if (err instanceof Error) { // 判斷傳入的err是否為error物件
      req.flash('error_messages', `${err.name}: ${err.message}`) // 是,物件內會有name和message,用快閃訊息把值印出來給使用者看
    } else {
      req.flash('error_messages', `${err}`) // 不是,如果是報告,將字串印出就可以
    }
    res.redirect('back') // 將error物件傳給下一個error handler
    next(err)
  }
}
