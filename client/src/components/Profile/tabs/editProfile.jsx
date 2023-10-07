import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseURL } from "../../../utils/constant";
import "../../../index.css";
import Popup from "reactjs-popup";

function EditProfile() {
  const currentUser = JSON.parse(window.localStorage.getItem("currentUser"));
  const [errorMsg, setErrorMsg] = useState("");
  const [hintMsg, setHintMsg] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [indicator, setIndicator] = useState(false);
  const [errs, setErrs] = useState({});
  const [validatePsw, setValidatePsw] = useState(false);

  useEffect(() => {
    // Get user data from backend and set initial state
    const fetchUserData = async () => {
      try {
        const res = await axios.post(`${baseURL}/profile/user`, {
          currentUserId: currentUser.userId,
        });
        // console.log(currentUser.userId);
        console.log(res);
        setEmail(res.data.email);
        setFirstName(res.data.firstname);
        setLastName(res.data.lastname);
        setErrorMsg("");
      } catch (error) {
        console.log(error);
        setErrorMsg("Something went wrong, please login again");
      }
    };

    if (currentUser != null) {
      fetchUserData();
    }
  }, []);

  function validation() {
    let err = {};
    const email_pattern =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const name_pattern = /^[A-Za-z0-9]+$/;
    setIndicator(false);

    if (email !== "") {
      if (email.length >= 50) {
        err.email = "Your email is too long";
        setIndicator(true);
      } else if (!email_pattern.test(email)) {
        err.email = "Your email pattern is incorrect";
        setIndicator(true);
      } else {
        err.email = "";
      }
    }

    if (firstName !== "") {
      if (firstName.length >= 50) {
        err.firstname = "Your firstname is too long (less than 50)";
        setIndicator(true);
      } else if (!name_pattern.test(firstName)) {
        err.firstname =
          "Your first name can only contain characters or numbers(no space)";
        setIndicator(true);
      } else {
        err.firstname = "";
      }
    }

    if (lastName !== "") {
      if (lastName.length >= 50) {
        err.lastname = "Your lastname is too long (less than 50)";
        setIndicator(true);
      } else if (!name_pattern.test(lastName)) {
        err.lastname =
          "Your last name can only contain characters or numbers(no space)";
        setIndicator(true);
      } else {
        err.lastname = "";
      }
    }

    if (email === "" && lastName === "" && firstName === "") {
      console.log("hi");
      setErrorMsg("You didn't update anything");
      setIndicator(true);
      return errs;
    }

    if (password === "") {
      err.password =
        "Please input your password to validate and then will be able to update your profile";
      setIndicator(true);
    } else {
      err.password = "";
    }

    return err;
  }

  async function handleUpdateProfile(event) {
    event.preventDefault();
    setErrs({});
    setIndicator(false);

    try {
      // Send updated user data to backend\
      const userId = currentUser.userId;
      setErrs(validation());
      if (indicator) {
        console.log("errs in input");
        return;
      }
      const res = await axios.post(`${baseURL}/profile/edit-profile`, {
        email: email,
        firstName: firstName,
        lastName: lastName,
        password: password,
        userId: userId,
      });
      if(res.data === "empty psw") {
        setErrorMsg("Please input your password to validate and then will be able to update your profile")
      }
      if (res.data.data === "good") {
        setHintMsg("Successfully Update your information!");
        alert("Successfully Update your information!");
        currentUser.email = res.data.user.email;
        window.localStorage.setItem("currentUser", JSON.stringify(currentUser));
      }
      if (res.data === "no user") {
        setErrorMsg("No such user!");
        return;
      }
      if (res.data === "wrong password") {
        setErrs({ password: "The password inputted is wrong" });
        return;
      }
      if (res.data === "email used") {
        setErrs({ email: "The email address provided is already registered." });
        return;
      }
      if (res.status === 400) {
        setErrorMsg(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const offset = {
    left: 10,
    top: 50,
  };

  return (
    <div className="manage-user-container">
      <h2>Edit Profile</h2>
      {hintMsg && <p className="profile-suc">{hintMsg}</p>}
      <label className="profile-label">First Name: </label>
      <input
        type="text"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        className="profile-input"
      />
      <br />
      {errs.firstname && <span>{errs.firstname}</span>}
      <br></br>
      <label className="profile-label">Last Name: </label>
      <input
        type="text"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        className="profile-input"
      />
      <br />
      {errs.lastname && <span className="profile-warn">{errs.lastname}</span>}
      <br></br>
      <label className="profile-label">Email: </label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="profile-input"
      />
      <br></br>
      {errs.email && <span>{errs.email}</span>}
      <br></br>
      <button
        className="btn btn-yellow"
        onClick={() => {
          if (validatePsw) {
            setValidatePsw(false);
          } else {
            setValidatePsw(true);
          }
        }}
      >
        {!validatePsw ? (
          <medium>validate password to change your details</medium>
        ) : (
          <medium>cancel</medium>
        )}
      </button>
      {validatePsw ? (
        <div>
          <br></br>
          <label htmlFor="password" className="profile-label">
            Password:{" "}
          </label>
          <input
            type="password"
            placeholder="input your password"
            id="password"
            autoComplete="off"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="profile-input"
            required
          />
          {errs.password && <p className="profile-warn">{errs.password}</p>}
          <button
            onClick={handleUpdateProfile}
            className="btn btn-yellow"
          >
            validate
          </button>
          {errorMsg && <p className="profile-warn">{errorMsg}</p>}
        </div>
      ) : (
        <br></br>
      )}
      {errorMsg && <p className="profile-warn">{errorMsg}</p>}
    </div>
  );
}

export default EditProfile;
