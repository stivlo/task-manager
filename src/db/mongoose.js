const mongoose = require('mongoose');

const dbConnectionUrl = 'mongodb://127.0.0.1:27017/task-manager-api';

mongoose.connect(dbConnectionUrl, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
});

