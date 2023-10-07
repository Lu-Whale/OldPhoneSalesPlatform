const express  = require('express');
const cors = require('cors');
const app = express();
var mongoose = require('mongoose');

// ENV virables
const {DB_USERNAME, DB_PASSWORD, BACK_PORT} = require("./env.js");

// Connecting to database
mongoose.connect(`mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@old-phone-list.vp32awt.mongodb.net/?retryWrites=true&w=majority`, 
{ useNewUrlParser: true,
useUnifiedTopology: true ,dbName: 'assignment2'}
).then(() => {
      console.log("Connected to db")

//   //->for update all psw
//   const salt = bcrypt.genSaltSync(10);
//   const hashedPassword = bcrypt.hashSync('Comp5347', salt);
//   userList.updateMany(
//       {password: '<put the encrypted password here>'},
//       { password: hashedPassword })
//       .then(() => {
//         console.log('Passwords updated successfully');
//       })
//       .catch((error) => {
//         console.error('Error updating passwords:', error);
//       });

    }
).catch((e) => {console.log(e);});

app.use(express.json());
// Enable CORS
app.use(cors());

// All routes
const authRoutes = require('./routes/authRoutes.js');
const PhoneListroutes = require ("./routes/PhoneListRoute");
const checkoutRoutes = require("./routes/checkOutRoutes");
const profileRoutes = require("./routes/profileRoute.js");

//Use Routes
app.use("/api",PhoneListroutes);
app.use("/api", authRoutes);
app.use("/api", checkoutRoutes);
app.use("/api",profileRoutes);


//Connecting to Server on port 8000

app.listen(BACK_PORT, function (error) {
  if (error) {
    console.log("error");
  } else {
    console.log("Application started");
//     const obj1=querystring.parse('name=sonoo&company=javatpoint');
// console.log(obj1);
  }
});