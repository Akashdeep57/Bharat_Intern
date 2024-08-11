const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/User');
const Post = require('./models/Post');
const postRoutes = require('./routes/posts');
const authRoutes = require('./routes/auth');
const { ensureAuthenticated } = require('./middleware/auth');
const path = require('path'); // Add this line for path module

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost/blog')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Passport configuration
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Set the path for views directory

// Static files
app.use(express.static('public'));

// Use routes
app.use('/posts', postRoutes);
app.use('/auth', authRoutes);

// Home route
app.get('/', ensureAuthenticated, async (req, res) => {
    try {
        const posts = await Post.find().populate('author');
        res.render('index', { posts, user: req.user });
    } catch (err) {
        console.error('Error fetching posts:', err);
        res.redirect('/'); // or render an error page
    }
});

// Start server
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
