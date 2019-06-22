const mongoose = require('mongoose');

const dbConnectionUrl = process.env.MONGODB_URL;

mongoose.connect(dbConnectionUrl, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
});
