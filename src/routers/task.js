const express = require('express');
const router = new express.Router();
const Task = require('../models/task');
const auth = require('../middleware/auth');

// create task
router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user.id
    });
    try {
        await task.save();
        res.status(201).send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

// find all tasks
router.get('/tasks', auth, async (req, res) => {
    const match = {};
    if (req.query.completed) {
        match.completed = req.query.completed === 'true';
    }
    try { 
        await req.user.populate({
            path: 'tasks',
            match
        }).execPopulate();
        res.send(req.user.tasks);
    } catch (error) {
        res.status(500).send(error);
    }
});

// find a task by id
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findOne({ _id, owner: req.user._id });
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (error) {
        res.status(500).send(error);
    }
});

// update a task
router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedFields = ['description', 'completed'];
    const isValidOperation = updates.every(update => allowedFields.includes(update));
    if (!isValidOperation) {
        return res.status(400).send({
            error: 'Non-allowed field. Allowed fields: ' + allowedFields
        });
    }
    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user.id });
        if (!task) {
            return res.status(404).send();
        }
        updates.forEach((updateField) => task[updateField] = req.body[updateField]);
        await task.save();
        res.send(task);
    } catch (error) {
        console.log('error', error);
        res.status(400).send(error);
    }
});

// delete a task
router.delete("/tasks/:id", auth, async (req, res) => {
    try {
        console.log(req.params.id, req.user.id);
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
        if (!task) {
            res.status(404).send();
        }
        res.send(task);
    } catch (error) {
        res.status(500).send();
    }
});

module.exports = router;
