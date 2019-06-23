const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');

const userOne = {
    name: 'Mike',
    email: 'mike@example.com',
    password: '83248What?'
};

beforeEach(async () => {
    await User.deleteMany();
    await new User(userOne).save();
});

test('Should sign up a new user', async () => {
    await request(app).post('/users').send({
        name: 'Andrew',
        email: 'andrew@example.com',
        password: 'Mypass7329!!'
    }).expect(201);
});

test('Should log in existing user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200);
});

test('Should not log in non existent user', async () => {
    await request(app).post('/users/login').send({
        email: 'unknown@example.com',
        password: 'aPasswored!234'
    }).expect(400);
});
