module.exports = (req, res, next) => {
    const auth = req.isAuthenticated();
    if (auth) next();
    else res.redirect("/loginFailed"); 
}