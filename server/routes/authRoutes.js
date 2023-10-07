const express = require('express');

const router = express.Router();
const {login, signup, forget_psw, userVerify, forgetpswUsersPost} = require('../controller/authController.js');
// const { reset } = require('nodemon');
// const { model } = require('mongoose');

// router.route('/user/getAll').get(userController.getDataControllerFn);

router.post("/login", login)
router.post("/signup", signup)
router.post("/forgetpsw", forget_psw)

router.get("/users/:id/verify/:token", userVerify)

router.post("/forgetpswUsers", forgetpswUsersPost)

module.exports = router;