module.exports = app => {
  // admin
  app.use('/admin', require('./admin'));

  // home
  app.use('/home', require('./home'));

}
