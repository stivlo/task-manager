const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();

// app.use((req, res, next) => {
//     res.status(503).send('Site is under maintanance');
// });

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Server is up on port ' + port);
});

const Task = require('./models/task');
const User = require('./models/user');
const main = async (message) => {
    // const user = await User.findById('5d09511c7e0c670896f48c76');
    // await user.populate('tasks').execPopulate();
    // console.log(user.tasks);
};
 

