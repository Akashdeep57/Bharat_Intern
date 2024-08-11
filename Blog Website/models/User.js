const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3 // Example validation rule
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[\w-]+@([\w-]+\.)+[a-zA-Z]{2,7}$/ // Simple email validation
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: String, // Optional field
    bio: String // Optional field
});

// Apply passport-local-mongoose plugin to userSchema
userSchema.plugin(passportLocalMongoose);

// Create indexes
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });

// Export User model
module.exports = mongoose.model('User', userSchema);
