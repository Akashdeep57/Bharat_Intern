module.exports.ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    // Store the original URL in the session
    req.session.returnTo = req.originalUrl;
    res.redirect('/auth/login');
};
