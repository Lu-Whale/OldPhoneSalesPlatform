const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tokenSchema2 = new Schema({
    userId:{
        type: String,
        required: true,
        ref:"UserList",
        unique:true,
    },
    email: String,
    token: {type: String, required: true},
    createdAt: {type: Date, default: Date.now(), expires:3600} //1 hour
});

module.exports = mongoose.model("TokenForgetPsw", tokenSchema2, "tokenforgetpsws")