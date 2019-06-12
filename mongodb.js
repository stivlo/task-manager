// CRUD: create, read, update, delete

// const MongoClient = require('mongodb').MongoClient;
// const ObjectId = MongoClient.ObjectId;

const { MongoClient, ObjectId } = require('mongodb');
const connectionUrl = 'mongodb://127.0.0.1:27017';
const dbName = 'task-manager';
const id = new ObjectId();
console.log(id);
console.log(id.getTimestamp());

MongoClient.connect(connectionUrl, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        return console.log('Unable to connect to database');
    }
    const db = client.db(dbName);

    // db.collection('users').insertOne({
    //     name: 'Vikram',
    //     location: 'Brighton'
    // }, (error, result) => {
    //     if (error) {
    //         return console.log('Unable to insert user');
    //     }
    //     console.log(result.ops);
    //     console.log(result.insertedId);
    // });

    // db.collection('users').insertMany([{
    //     name: 'Jen',
    //     location: 'Derby'
    // }, 
    // {
    //     name: 'Nick',
    //     location: 'York'
    // }], (error, result) => {
    //     if (error) {
    //         return console.log('Unable to insert documents!');
    //     }
    //     console.log(result.ops);
    //     console.log(result.insertedIds);
    // });

    // db.collection('tasks').insertMany([
    //     {
    //         description: 'Soy Milk',
    //         completed: false
    //     },
    //     {
    //         description: 'Bananas',
    //         completed: true
    //     },
    //     {
    //         description: 'Potatoes',
    //         completed: false
    //     }
    // ], (error, result) => {
    //     if (error) {
    //         return console.log('Unable to insert documents!');
    //     }
    //     console.log(result.ops);
    //     console.log(result.insertedIds);
    // });

});
