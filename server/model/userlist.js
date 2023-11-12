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

// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
//
// const userListSchema = new mongoose.Schema({
//     firstname: {
//         type: String,
//         required: true // 假设名字是必需的
//     },
//     lastname: {
//         type: String,
//         required: true // 假设姓氏是必需的
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true, // 确保电子邮件地址的唯一性
//         match: [/.+\@.+\..+/, 'Please fill a valid email address'] // 简单的电子邮件格式验证
//     },
//     password: {
//         type: String,
//         required: true,
//         minlength: 6 // 设置密码的最小长度
//     },
//     verified: {
//         type: Boolean,
//         default: false // 默认应该是未验证状态
//     }
// },{
//     versionKey: false // 禁用版本键
// });
//
// // 密码哈希中间件
// userListSchema.pre('save', async function(next) {
//     if (!this.isModified('password')) return next();
//
//     try {
//         const salt = await bcrypt.genSalt(10);
//         this.password = await bcrypt.hash(this.password, salt);
//         next();
//     } catch (error) {
//         next(error);
//     }
// });
//
// // 索引
// userListSchema.index({ email: 1 });
//
// const UserList = mongoose.model('UserList', userListSchema, 'userlistdemo');
//
// module.exports = UserList;
