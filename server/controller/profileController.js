const User = require("../model/userlist");
const PhoneListing = require("../model/PhoneListModel");
const sendEmail = require("../utils/sendEmail")
const bcrypt = require('bcryptjs')
const { default: mongoose } = require("mongoose");
const salt = bcrypt.genSaltSync(10)



async function getUser(req, res) {
  try {
    let userIdStr = req.body.currentUserId;
    let usrId = new mongoose.Types.ObjectId(userIdStr);

  let usr = await User.findOne({ _id: usrId });
  if(!usr) {
    res.json("no user");
  } else {
    res.json({firstname: usr.firstname, lastname: usr.lastname, email: usr.email, password:usr.password })
  }
  } catch (error) {
    return res.status(400).json(error);
  }
}

//Edit profile
async function editProfile(req, res) {
    try {
      // Extract the user id and update information from the request
      const { email, firstName, lastName, password, userId } = req.body;
      let currUserId = new mongoose.Types.ObjectId(userId);
      let currUser = await User.findById(currUserId);
      if(password === "") {
        return res.json("empty psw")
      }

      // If user information is not updated in the database, return an error
      if (!currUser) {
        res.json("no user");
        return;
      }
      let isPasswordCorrect = bcrypt.compareSync(password, currUser.password);

      //check password match
      if(!isPasswordCorrect) {
        return res.json('wrong password')
      }
  
      // Check if the email already exists in the database
      if(email !== "") {
        const checkExistUser = await User.findOne({ email: email });
        if (checkExistUser && checkExistUser._id.toString() !== userId) {
          res.json('email used');
          return;
        }
        await User.updateOne({_id: currUserId},{email: email});
      }

      // Update user information in the database
      if(firstName !== "") {
        await User.updateOne({_id: currUserId},{firstname: firstName});
      }
      if(lastName !== "") {
        await User.updateOne({_id: currUserId},{lastname: lastName});
      }
  
      // Return the updated user information
      currUser = await User.findById(currUserId);
      return res.json({data:"good", user: currUser});
    } catch (error) {
      // If an error occurs, return the error message and the stack trace
      console.log(error);
      return res.status(400).send({ error: error.message, stack: error.stack });
    }
}

async function changePassword(req, res) {
  const {email, currentPassword, newPassword } = req.body;

  try{

    const currUser = await User.findOne({email: email});

    if (!currUser) {
      return res.json('no user');
    }

    //check password match
    const isPasswordCorrect = bcrypt.compareSync(currentPassword, currUser.password);
    if(!isPasswordCorrect) {
      return res.json('wrong psw')
    }

    //hash password and update password to database
    const psw_pattern =
      /^(?=.*\d)(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%]).{8,15}$/;
    if (newPassword.length < 8 || newPassword.length > 15 || !psw_pattern.test(newPassword)) {
      return res.json('invalid psw')
    }
    const hashPSW = bcrypt.hashSync(newPassword, salt);
    await User.findOneAndUpdate({email: email}, {password: hashPSW});

    //send email
    await sendEmail(email, 'Your password has been changed', 'Your password has been changed successfully.');

    return res.json({data: "good", message: 'Password changed successfully'});
  }catch (error) {
    console.error(error);
    res.status(500).send({message: 'Internal server error'})
  }
}


async function addNewPhoneListing(req, res) {
  try {

    const {title, brand, price, stock, currentUserId } = req.body;

    let errors = {};
    let hasError = false;

    // Check each required field and add an error message if it's missing
    const requiredFields = ["title", "brand", "price", "stock"];
    requiredFields.forEach((field) => {
      if (!req.body[field]) {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`;
        hasError = true;
      }
    });

    if (hasError) {
      return res.status(400).json({errors});
    }

    const newPhoneListing = await PhoneListing.create({
      title,
      brand,
      image: "./imgs/" + brand + ".jpeg",
      price,
      stock,
      seller: new mongoose.Types.ObjectId(currentUserId),
    });

    res.status(200).json(newPhoneListing);
  } catch (error) {
    return res.status(400).json({error: error.toString()});
  }
}


async function getPhoneListingByUser(req, res) {
  try {
    const currentUserIdStr = req.body.currentUserId;
    // const currentUserId = new mongoose.Types.ObjectId(currentUserIdStr);

    const items = [];
    const phonelistings = await PhoneListing.find({ seller: currentUserIdStr });

    if (!phonelistings || phonelistings.length === 0) {
      return res.json('no item');
    }

    for(const phonelisting of phonelistings) {

      items.push({
        title: phonelisting.title,
        brand: phonelisting.brand,
        enable: phonelisting.enable,
        phone_id: phonelisting._id.toString(),
      });
    }

    if(!items || items.length === 0) {
      res.json("no item");
      return;
    }

    return res.status(200).json({item: items, data: 'good'});
  } catch (error) {
    console.log(error)
    return res.status(400).json({ error: error.toString() });
  }
}


async function updatePhonelistingEnableStatus(req, res) {
  try {
    const {phone_id} = req.body;

    const phonelisting = await PhoneListing.findOne({_id: phone_id});
    if(!phonelisting) {
      res.json("no item");
      return;
    }

    const updatedEnable = ! phonelisting.enable;
    const updateResult = await PhoneListing.findOneAndUpdate(
        {_id: phone_id},
        {enable: updatedEnable}
    )

    if(!updateResult) {
      res.json("no item");
      return;
    }else {
      res.json("good");
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error: " + error.toString() });
  }
}

async function deletePhoneListingById(req, res) {
  try {
    const phonelistingId = req.params.id;
    if(!phonelistingId) {
      res.json("Bad delete");
      return;
    }

    const phone = await PhoneListing.findOne({_id: phonelistingId});
    if (!phone) {
      res.json("Bad delete");
      return;
    }

    await PhoneListing.findOneAndRemove({_id: phonelistingId});
    res.json("Delete success");
  } catch (err) {
    return res.status(400).json({ error: err.toString() });
  }
}

// reviewerFirstName: String,
// rating: Number,
// comment: String,
// hidden: Boolean,
// brand: the phone brand of this comment left
// title: the phone title of this comment left
//   comment_id: object id (in string type) of this current comment

async function getCommentsByPhoneListingsUser(req, res) {

  try {
    const currUserIdStr = req.query.currentUserId;
    // const currUserId = new mongoose.Types.ObjectId(currUserIdStr);
    const phoneListings = await PhoneListing.find({seller: currUserIdStr});

    const comments = [];

    if(!phoneListings) {
      res.json("no item");
      return;
    }

    for(const phoneListing of phoneListings) {
      let commentIndex = 0;
      for(const review of phoneListing.reviews) {
        const reviewerIdStr = review.reviewer;
        const reviewerId = new mongoose.Types.ObjectId(reviewerIdStr);
        const reviewer = await User.findById(reviewerId);
        if(!reviewer) {
          res.json("no item");
          return;
        }

        comments.push({
          phoneListingId: phoneListing._id.toString(), //add phonelisting_id to comment for find comment and update hidden status
          reviewerFirstName: reviewer.firstname,
          rating: review.rating,
          comment: review.comment,
          hidden: review.hidden,
          brand: phoneListing.brand,
          title: phoneListing.title,
          comment_id: commentIndex,
        });
        commentIndex++;
      }
    }

    res.json({data: 'good', comments: comments}); // frontend should be res.data.data

  }catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function updateCommentHiddenStatus(req,res) {
  try{
    const {phonelisting_id, comment_id} = req.body;

    const phonelistingId = new mongoose.Types.ObjectId(phonelisting_id)
    const phoneListing = await PhoneListing.findById(phonelistingId);
    // const phonelisting = await PhoneListing.findOne(phonelisting_id); //if below two lines work failed, use this line
    const review = phoneListing.reviews[comment_id];
    review.hidden = !review.hidden;
    await phoneListing.save();

    res.json("update success");

  }catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }

}

module.exports = {
  getUser,
  editProfile,
  changePassword,
  addNewPhoneListing,
  getPhoneListingByUser,
  updatePhonelistingEnableStatus,
  deletePhoneListingById,
  getCommentsByPhoneListingsUser,
  updateCommentHiddenStatus,
}



