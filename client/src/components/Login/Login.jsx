import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { baseURL } from "../../utils/constant";
import "../../index.css";
import "./Login.css";

//https://medium.com/boca-code/how-to-encrypt-password-in-your-react-app-before-you-send-it-to-the-api-6e10a06f0a8e

function Login() {
  const history = useNavigate(); //navigate between different pages

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [indicator, setIndicator] = useState(false);
  const [msg, setMsg] = useState("");
  const [errs, setErrs] = useState({});

  function validation(values) {
    let err = {};
    const email_pattern =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (values.email === "") {
      err.email = "Please input your email";
      setIndicator(true);
    } else if (values.email.length >= 50) {
      err.email = "Your email is too long";
      setIndicator(true);
    } else if (!email_pattern.test(values.email)) {
      err.email = "Your email pattern is incorrect";
      setIndicator(true);
    } else {
      err.email = "";
    }

    if (values.password === "") {
      err.password = "Please input your password";
      setIndicator(true);
    } else {
      err.password = "";
    }
    console.log(err);
    return err;
  }

 async function submit(e) {
        setErrMsg("")
        setErrs({})
        setMsg('')
        setIndicator(false)
        e.preventDefault();
        try{
            setErrs(validation({email:email, password:password}))
            if (indicator) {
                console.log("invalid input")
                console.log(errs);
                return
            }
            await axios.post(`${baseURL}/login`, {
                email, password, indicator
            })
            .then(res => {
                // console.log(req)
                if(res.data.data === 'exist') {
                    window.localStorage.setItem("currentUser", JSON.stringify({email: email, token: res.data.token, userId: res.data.userId}));
                    history("/")
                    setMsg("Logged in")
                }
                if(res.data === 'noexist') {
                    setErrs({email:"You input wrong email"});
                }
                if(res.data === "noverify") {
                    setErrs({email: "Your email hasn't been verified for a long time, please register again"})
                }
                if (res.data === 'wrong psw') {
                    setErrs({password: "Your password is wrong"})
                }
                if(res.data === "verify sent") {
                    setMsg("Your Email hasn't been verified! \nA verification link has been sent to your email.");
                }
                if (res.data === "resend") {
                    setIndicator('resend');
                }
        }).catch(e=>{
            setErrMsg("Wrong details")
            console.log(e);})
        } catch(e) {
          console.log(e);
        }
      }

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form action="POST">
        {errMsg && <span className="warn">{errMsg}</span>}
        <div>
          <label htmlFor="email" className="login-label">
            Email:
          </label>
          <br></br>
          <input
            className="login-input"
            type="text"
            placeholder="put_your_email_here@gmail.com"
            id="email"
            autoComplete="off"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
          <br></br>
          {errs.email && <span className="warn">{errs.email}</span>}
        </div>

        <div>
          <label htmlFor="password" className="login-label">
            Password:
          </label>
          <br></br>
          <input
            className="login-input"
            type="password"
            placeholder=""
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
          <br></br>
          {errs.password && <span className="warn">{errs.password}</span>}
        </div>

        {msg && <p className="suc">{msg}</p>}
        <strong>
          No account?{" "}
          <Link to="/signup" className="login-link">
            Register
          </Link>
          !
        </strong>
        <br></br>
        <button type="submit" className="login-btn" id="submit" onClick={submit}>
          Log In
        </button>
        {/* <button className="login-btn" id="test" onClick={test}>
          test
        </button> */}
        <br></br>

        <strong>
          <Link to="/forgetpsw" className="login-link">
            Forget your password
          </Link>
          ?
        </strong>
      </form>
    </div>
  );
}

export default Login;
