const request = require('supertest');
const app = require('../src/app');

test('Should sign up a new user', async () => {
    await request(app).post('/users').send({
        name: 'Andrew',
        email: 'andrew@example.com',
        password: 'Mypass7329!!'
    }).expect(201);
});