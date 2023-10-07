import React, { useState } from "react";
import axios from "axios";
import { baseURL } from "../../../utils/constant";
import "../../../index.css";

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  let email = JSON.parse(localStorage.getItem("currentUser")).email;
  const [errorMsg, setErrorMsg] = useState("");
  const [errs, setErrs] = useState({});
  const [indicator, setIndicator] = useState(false);

  const handleCurrentPasswordChange = (event) => {
    setCurrentPassword(event.target.value);
  };

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  function validation() {
    let err = {};
    setIndicator(false);
    const psw_pattern =
      /^(?=.*\d)(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%]).{8,15}$/;

    if (currentPassword === "") {
      err.password = "Please input your current password";
      setIndicator(true);
    }

    if (newPassword === "") {
      err.newPassword = "Please input your new password";
      setIndicator(true);
    }

    if (!psw_pattern.test(newPassword)) {
      err.newPassword =
        "Your password should contain at least 1 upper case character, 1 lower case character, 1 number and a symbol";
      setIndicator(true);
    }
    return err;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMsg("");

    try {
      setErrs(validation());
      console.log(currentPassword + " " + newPassword);
      if (indicator) {
        console.log("err input");
        return;
      }
      email = JSON.parse(localStorage.getItem("currentUser")).email;
      const response = await axios.post(`${baseURL}/profile/change-password`, {
        email,
        currentPassword,
        newPassword,
      });

      if (response.data === "no user") {
        console.log("hi");
        setErrorMsg("User not found, you may need to login again");
      }
      if(response.data === 'invalid psw') {
        setErrorMsg("Your new password should be in length from 8 to 15, and contains at least 1 number, 1 lowercase letter and 1 uppercase letter")
      }

      if (response.data === "wrong psw") {
        setErrorMsg("Current password invalid");
      }

      if (response.data.data === 'good') {
        setErrorMsg("Password changed successfully!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="manage-user-container">
      <h2>Change Password</h2>
      <div>
        <label htmlFor="current-password" className="profile-label">
          Current Password:{" "}
        </label>
        <input
          type="password"
          id="current-password"
          value={currentPassword}
          onChange={handleCurrentPasswordChange}
          className="profile-input"
          required
        />
        <br></br>
        {errs.password && <span className="profile-warn">{errs.password}</span>}
      </div>
      <div>
        <label htmlFor="new-password" className="profile-label">
          New Password:{" "}
        </label>
        <input
          type="password"
          id="new-password"
          value={newPassword}
          onChange={handleNewPasswordChange}
          className="profile-input"
          required
        />
        <br></br>
        {errs.newPassword && <span className="profile-warn">{errs.newPassword}</span>}
      </div>
      <br></br>
      {errorMsg && <p className="profile-suc">{errorMsg}</p>}
      <button type="submit" className="btn btn-yellow">
        Change Password
      </button>
    </form>
  );
}

export default ChangePassword;
