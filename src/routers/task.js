const express = require('express');
const router = new express.Router();
const Task = require('../models/task');

// create task
router.post('/tasks', async (req, res) => {
    const task = new Task(req.body);
    try {
        await task.save();
        res.status(201).send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

// find all tasks
router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.send(tasks);
    } catch (error) {
        res.status(500).send(error);
    }
});

// find a task by id
router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findById(_id);
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (error) {
        res.status(500).send(error);
    }
});

// update a task
router.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedFields = ['description', 'completed'];
    const isValidOperation = updates.every(update => allowedFields.includes(update));
    if (!isValidOperation) {
        return res.status(400).send({
            error: 'Non-allowed field. Allowed fields: ' + allowedFields
        });
    }
    try {
        const task = await Task.findById(req.params.id);
        updates.forEach((updateField) => task[updateField] = req.body[updateField]);
        await task.save();
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (error) {
        console.log('error', error);
        res.status(400).send(error);
    }
});

// delete a task
router.delete("/tasks/:id", async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            res.status(404).send();
        }
        res.send(task);
    } catch (error) {
        res.status(500).send();
    }
});

module.exports = router;
