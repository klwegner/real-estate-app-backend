function middleware(req, res, next) {
  const authToken = req.headers.authorization?.split(' ')[1]  
  if (!authToken) {
    return res.redirect('/loginPage');
}
  next();
}

module.exports = middleware;
