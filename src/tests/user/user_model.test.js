const mongoose = require('mongoose');
const UserModel = require('../../models/user');

const userData = { 'name': 'test', 'email': 'test@test.com', 'password': 'test1234', 'username': 'testname' };

describe('User Model Tests', ()=> {

    afterEach(() => {
        mongoose.connection.collections['users'].drop( function() {});
    });

    it('Create a new user', async ()=> {
        const user = new UserModel(userData);
        const savedUser = await user.save();

        expect(savedUser._id).toBeDefined();
        expect(savedUser.name).toBe(userData.name);
        expect(savedUser.email).toBe(userData.email);
        expect(savedUser.password).toBe(userData.password);
        expect(savedUser.username).toBe(userData.username);
    })

    it('Create a user with invalid fields', async ()=> {
        var invalidUserData = {...userData};
        delete invalidUserData.email;
        const user = new UserModel(invalidUserData);
        
        let error;

        try{
            const savedUser = await user.save();
            error = savedUser;
        }catch(err){
            error = err;
        }

        expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
        expect(error.errors.email).toBeDefined();
    })

    it('Create user that already exists', async ()=>{
        await new UserModel(userData).save();

        let error;

        try{
            const repeatedUser = new UserModel(userData);
            await repeatedUser.save();
        }catch(err){
            error = err;
        }

        expect(error).toBeDefined();
        expect(error.code).toBe(11000);
    })

    it('Create user with undefined fields', async ()=>{
        var newUserData = {...userData};
        delete newUserData.name;
        const user = new UserModel(newUserData);
        await user.save();

        expect(user._id).toBeDefined();
        expect(user.name).toBeUndefined();
    })


})
