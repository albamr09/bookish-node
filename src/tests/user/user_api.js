const mongoose = require('mongoose');
const UserModel = require('../models/user');
const userData = { name: 'TekLoon', gender: 'Male', dob: new Date(), loginUsing: 'Facebook' };
const app = require('../app');
const supertest = require('supertest');
const request = supertest(app);

//Endpoint urls
CREATE_USER_URL='/user/sign-up'
TOKEN_URL='/user/login'

const create_user = (payload) => {
    // Create new user
}

describe('Unauthenticated User Api Test', () => {
    it('Create new user sucess', (done)=> {
        const payload = {
            'email': 'test@test.com',
            'password': 'pass1234',
            'name': 'test',
        }

        request
            .post(CREATE_USER_URL)
            .send(payload)
            .expect(201)
            .expect((res) => {
                res.body.email = payload.email;
                res.body.name = payload.name;
                // Check that the password is not in the response
            })
        done()
    })

    it('Create user exists', ()=> {
        const payload = {
            'email': 'test@test.com',
            'password': 'pass1234',
            'name': 'test',
        }

        create_user(payload);

        request
            .post(CREATE_USER_URL)
            .send(payload)
            .expect(400)
        done()
    })

//    it('Generate token success', ()=> {
//        const payload = {
//            'email': 'test@test.com',
//            'password': 'pass1234'
//        }
//
//        create_user(payload);
//
//        request
//            .post(CREATE_USER_URL)
//            .send(payload)
//            .expect(200)
//        done()
//    })

    it('Create new user invalid data', (done)=> {
        const payload = {
            'password': 'pass1234',
            'name': 'test',
        }

        request
            .post(CREATE_USER_URL)
            .send(payload)
            .expect(400)
        done()
    })
})

//describe('Authenticated User Api Test', () => {
//})
// https://tekloon.dev/how-I-setup-unit-test-for-mongodb-using-jest-mongoose
