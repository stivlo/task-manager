const mongoose = require('mongoose');

const dbConnectionUrl = 'mongodb://127.0.0.1:27017/task-manager-api';

mongoose.connect(dbConnectionUrl, {
    useNewUrlParser: true,
    useCreateIndex: true
});

const Task = mongoose.model('Task', {
    description: {
        type: String,
        trim: true,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    }
});

