const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true, // requires db drop!
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email ' + value + ' is invalid');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Invalid password');
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number');
            }
        }
    }
});

userSchema.statics.findByCredentials = async (email, password) => {
    const invalidLoginMessage = 'Invalid username or password';
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error(invalidLoginMessage);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error(invalidLoginMessage);
    }
    return user;
};

// hash plain text password
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        const numberOfRounds = 8;
        user.password = await bcrypt.hash(user.password, numberOfRounds);
    }
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
