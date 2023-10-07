const mongoose = require('mongoose');

const userListSchema = new mongoose.Schema({
    userId: {
        type: String,
        default: null
    },
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    verified: {
        type: Boolean,
        default: true
    },
},{
	versionKey: false 
});

const UserList = mongoose.model('UserList', userListSchema, 'userlistdemo');

module.exports = UserList;