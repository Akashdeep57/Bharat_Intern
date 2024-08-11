const express = require('express');
const passport = require('passport');
const User = require('../models/User');
const router = express.Router();

// Register route
router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res) => {
    try {
        const user = new User({ username: req.body.username });
        await User.register(user, req.body.password);
        res.redirect('/login');
    } catch (err) {
        res.redirect('/register');
    }
});

// Login route
router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local',  (err, user, info) => {
        if (err) { return next(err); }
        if (!user) { return res.redirect('/auth/login'); }
        
        req.logIn(user, (err) => {
            if (err) { return next(err); }
            
            // Redirect to the originally requested URL or home page
            const redirectTo = req.session.returnTo || '/';
            delete req.session.returnTo; // Clean up the session
            res.redirect(redirectTo);
        });
    })(req, res, next);
});

// Logout route
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;
