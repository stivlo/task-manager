const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            unique: true, // drop + re-create db to update schema
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
        },
        tokens: [{
            token: {
                type: String,
                required: true
            }
        }],
        "avatar": {
            type: Buffer
        }
    }, {
        timestamps: true
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

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
});

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    return userObject;
};

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user.id.toString() }, 'example secret');
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
};

// hash plain text password when an user is saved
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        const numberOfRounds = 8;
        user.password = await bcrypt.hash(user.password, numberOfRounds);
    }
    next();
});

// delete user tasks when user is removed
userSchema.pre('remove', async function (next) {
    const user = this;
    await Task.deleteMany({ owner: user._id });
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
