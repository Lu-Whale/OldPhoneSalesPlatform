const UserList = require('../model/userlist.js')
const TokenVerify = require("../model/tokenVerify.js")
const TokenForgetPsw = require("../model/tokenForgetPsw.js")
const sendEmail = require("../utils/sendEmail")
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const jwtToken = require('../utils/jwt.js')
const mongoose = require('mongoose')
const {WEBSITE_URL} = require("../env.js");

const salt = bcrypt.genSaltSync(10)

const login = async(req, res) => {
    let{email, password, indicator} = req.body
    if(indicator) {
      res.json('err')
      return
    }
    let usr = 2;
    let token = 3;
    // console.log(password)
    try{
      usr = await UserList.findOne({email:email})
      if (usr) {
        const cmp_psw = bcrypt.compareSync(password, usr.password)
        console.log(usr);
        let usr_id = usr._id.toString()
        if(!usr.verified) {
          //send verification link
          token = await TokenVerify.findOne({userId: usr_id});
          if(!token) {
            await TokenVerify.deleteMany({userId: usr_id})
            await TokenForgetPsw.deleteMany({userId: usr_id})
            await UserList.deleteMany({email: email})
            res.json("noverify")
            return;
          }   
          res.json("verify sent");
          return
        }
        if (!cmp_psw) {
            res.json("wrong psw")
            return
        }
        const payload = {
          loginUser: {
            email: email,
          },
        };
        const loginToken = jwtToken.generateToken(payload);
        // console.log(req)
        res.json({ token: loginToken, data:'exist', userId: usr_id});
      }
      else {
        // no such user find in db
        res.json("noexist")
      }
    } catch(e) {
      // err of db
      console.log(e)
      res.json("err")
    }
}

const signup = async(req, res) => {
    let{email, password, repeatPassword, firstname, lastname} = req.body
    // password =bcrypt.hashSync(password, salt)
    if(password !== repeatPassword) {
      res.json("wrong psw")
      return
    }
    const email_pattern =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const name_pattern = /^[A-Za-z0-9]+$/;
    const psw_pattern =
      /^(?=.*\d)(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%]).{8,15}$/;

    if (email.length >= 50) {
      res.json("invalid input")
      return;
    } else if (!email_pattern.test(email)) {
      res.json("invalid input")
      return;
    }
    if (password.length < 8 || password.length > 15) {
      res.json("invalid input")
      return;
    } else if (!psw_pattern.test(password)) {
      res.json("invalid input")
      return;
    }

    if (firstname.length >= 50) {
      res.json("invalid input")
      return;
    } else if (!name_pattern.test(firstname)) {
      res.json("invalid input")
      return;
    }

    if (lastname.length >= 50) {
      res.json("invalid input")
      return;
    } else if (!name_pattern.test(lastname)) {
      res.json("invalid input")
      return;
    }

    const data = {
      email: email,
      password: password,
      firstname: firstname,
      lastname: lastname,
      verified: false,
    }
    data.password = bcrypt.hashSync(password, salt)
    let cur_usr = '';
    try{
      cur_usr = await UserList.findOne({email:email})
      console.log(cur_usr)
      if (cur_usr) {
        if(cur_usr.verified) {
          res.json("exist")
        }
        else {
          let usr_id = cur_usr._id.toString()
          let token = await TokenVerify.findOne({userId: usr_id});
          if(!token) {
            await TokenVerify.deleteMany({userId: usr_id})
            await TokenForgetPsw.deleteMany({userId: usr_id})
            await UserList.deleteMany({email: email})
            res.json("noexist")
            return;
          }        
          res.json("verify sent")
        }
      }
      else {
        await UserList.insertMany([data]);
        cur_usr = await UserList.findOne({email: email})
        let usr_id = cur_usr._id.toString()
        const token = await new TokenVerify({
            userId: usr_id,
            token: crypto.randomBytes(32).toString("hex")
        }).save();
        const url = `${WEBSITE_URL}/users/${usr_id}/verify/${token.token}`
        await sendEmail(email, "Click the Link to Verify Your Email", url)
        console.log("send (sign up)!");
        res.json("verify sent")
      }
    } catch(e) {
      console.log(e)
      res.json("err")
    }
  }

const forget_psw = async(req, res) => {
  let{email} = req.body
  try {
    let usr = await UserList.findOne({email: email})
    console.log(usr);
    if (!usr) {
      res.json("noexist")
    } 
    else {
      let usr_id = usr._id.toString()
      if (!usr.verified) {
        let token = await TokenVerify.findOne({userId: usr_id})
        if (!token) {
          // delete user data of users who do not verify their account
          await TokenVerify.deleteMany({userId: usr_id})
          await TokenForgetPsw.deleteMany({userId: usr_id})
          await UserList.deleteMany({email: email})
          res.json("noexist")
          return;
        } 
        res.json("verify sent");
      }
      else {
        let tokenForgetPsw = await TokenForgetPsw.findOne({userId: usr_id})
        if (!tokenForgetPsw) {
          tokenForgetPsw = await new TokenForgetPsw({
            userId: usr_id,
            token: crypto.randomBytes(32).toString("hex"),
            email: email
          }).save();
        const url = `${WEBSITE_URL}/forgetpswUsers?id=${usr_id}&token=${tokenForgetPsw.token}`
        await sendEmail(email, "Click the Link to Reset Your Password", url)
        console.log("send (reset psw)!");
      }
      res.json("reset sent")
    }
  }
  } catch (error) {
    console.log(error)
  }
}


const userVerify = async(req, res) => {
  let id = new mongoose.Types.ObjectId(req.params.id);
  console.log("verify email router")
  try {
      const usr = await UserList.findOne({_id: id});
      if(!usr) {
          res.json("indvalid user")
          return
      }
      if(usr.verified) {
        res.json("verify")
        return
      }
      const token = await TokenVerify.findOne({
          userId: req.params.id,
          token: req.params.token
      })
      console.log(token)
      if (!token) {
          res.json("invalid link")
          return
      }
      await UserList.updateOne({_id: id}, {verified: true})
      await TokenVerify.deleteMany({userId: req.params.id})
      console.log("verify")
  } catch (e) {
      console.log(e)
      res.json("email server err")
  }
}


const forgetpswUsersPost = async(req, res) => {
  console.log(req.query)
  let id = new mongoose.Types.ObjectId(req.query.id);
  console.log("forget psw router "+id+" "+req.query.id)
  try {
      const token = await TokenForgetPsw.findOne({
          userId: req.query.id,
          token: req.query.token
      })
      console.log(token)
      if (!token) {
          res.json("invalid link")
          return
      }
      const usr = await UserList.findOne({email: token.email});
      if(!usr) {
          res.json("indvalid link")
          return
      }
      let{password, repeatPassword} = req.body
      const psw_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%]).{8,15}$/
      if(password != repeatPassword) {
        res.json("wrong psw")
        return
      }
      if (password.length < 8 || password.length > 15) {
        res.json("wrong length")
        return
      }
      else if (!psw_pattern.test(password)) {
        res.json("wrong pattern")
        return
      }
      password = bcrypt.hashSync(password, salt)
      await UserList.updateOne({email: token.email}, {password: password})
     // console.log("psw reset")
      await TokenForgetPsw.deleteMany({userId: req.query.id});
      res.json("psw reset")
  } catch (e) {
      console.log(e)
  }
}

module.exports = {
    login,
    signup,
    forget_psw,
    userVerify,
    forgetpswUsersPost,
}