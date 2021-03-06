const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const router = new express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');
const { sendWelcomeEmail, sendCancelEmail } = require('../emails/account');

// create a user
router.post('/users', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        sendWelcomeEmail(user.email, user.name);
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }
});

// log in
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (error) {
        res.status(400).send();
    }
});

// log out
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(tokenObject => tokenObject.token !== req.token);
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send();
    }
});

// log out of all sessions
router.post('/users/logout/all', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send();
    }
});

// find current user profile
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
});

// update yourself
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    if (!isValidOperation) {
        return res.status(400).send({
            error: 'Trying to update non-allowed field. Allowed fields: ' + allowedUpdates
        });
    }
    try {
        updates.forEach((updateField) => req.user[updateField] = req.body[updateField]);
        await req.user.save();
        res.send(req.user);
    } catch (error) {
        res.status(400).send(error);
    }
});

// delete yourself
router.delete('/users/me', auth, async (req, res) => {
    try {
        sendCancelEmail(req.user.email, req.user.name);
        await req.user.remove();
        res.send(req.user);
    } catch (error) {
        res.status(500).send();
    }
});

const upload = multer({
    limits: {
        fileSize: 1024 * 1024
    },
    fileFilter(req, file, next) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return next(new Error('Please upload a jpg, jpeg or png file'));
        }
        next(undefined, true);
    }
});

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer)
        .resize({ width: 250, height: 250 })
        .png()
        .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
}, (err, req, res, next) => {
    res.status(400).send({ error: err.message });
});

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save();
    res.send();
});

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || !user.avatar) {
            throw new Error();
        }
        res.set('Content-Type', 'image/png');
        res.send(user.avatar);
    } catch (err) {
        res.status(404).send();
    }
});

module.exports = router;
