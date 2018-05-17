module.exports = app => {
  app.get('/', (req, res) => {
    res.send('welcome.');
  })
  app.use('/signup', require('./signup'))
  app.use('/signin', require('./signin'))
  app.use('/signout', require('./signout'))
  app.use('/posts', require('./posts'))
  app.use('/comments', require('./comments'))
}
