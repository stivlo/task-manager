const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Server is up on port ' + port);
});

const jwt = require('jsonwebtoken');

const myFunction = async () => {
    const secret = 'super secret password';
    const token = jwt.sign({ _id: 'abc123' }, secret, { expiresIn: '7 days' });
    console.log(token);
    const data = jwt.verify(token, secret);
    console.log(data);
};

myFunction();
