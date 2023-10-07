import React, {useEffect, useState, useParams} from 'react';
import axios from 'axios';
import {useNavigate, Link, useSearchParams } from 'react-router-dom'
import { baseURL } from "../../utils/constant";
import "../../index.css"
import './Login.css'

function ResetPsw() {
    const history = useNavigate(); //navigate between different pages

    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('')
    const [errs, setErrs] = useState({});
    const [msg, setMsg] = useState('');
    const [validUrl, setValidUrl] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const [indicator, setIndicator] = useState(false);

    const id = searchParams.get('id')
    const token = searchParams.get('token')
    

    function validation(values) {
        let err = {}
        const psw_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%]).{8,15}$/
        err.password = ''
        setIndicator(false)
    
        if (values.password === "" || values.repeatPassword === "") {
            err.password = "Please input and repeat your password"
            setIndicator(true)
        }
        else if (values.password.length < 8 || values.password.length > 15) {
            err.password = "Your password should in length from 8 to 15"
            setIndicator(true)
        }
        else if (!psw_pattern.test(values.password)) {
            err.password = "Your password should contain at least 1 upper case character, 1 lower case character, 1 number and a symbol"
            setIndicator(true)
        }
        else if(values.repeatPassword !== values.password) {
            err.password = "Passwords are not same!"
            setIndicator(true)
        }
        else {
            err.password = ''
        } 
        console.log(err)
        return err;
    }

    async function submit(e) {
        setErrs({})
        setValidUrl(true)
        setMsg('')
        e.preventDefault();
        setIndicator(false)
        try{
            setErrs(validation({password:password, repeatPassword: repeatPassword}))
            if (indicator) {
                console.log(errs.password)
                return
            }
            await axios.post(`${baseURL}/forgetpswUsers?id=${id}&token=${token}`, {
                password, repeatPassword
            })
            .then(res => {
                console.log(res);
                if(res.data === "wrong psw") {
                    setErrs({password: "Your password are not same"})
                }
                if(res.data === "wrong length") {
                    setErrs({password: "Your password should in length from 8 to 15"})
                }
                if(res.data === "wrong pattern") {
                    setErrs({password: "Your password should contain at least 1 upper case character, 1 lower case character, 1 number and a symbol"})
                }
                if(res.data === "invalid link") {
                    console.log('invalid')
                    setValidUrl(false)
                }
                if(res.data === "psw reset") {
                    setMsg('Your psw has been reset successfully, please go to log in page')
                    console.log(msg)
                }
            })
        }catch (e) {
            console.log(e)
        }
    }

    return (
        <div className='login-container'>
            {validUrl ? (
        <form action='POST' onSubmit={submit}>
            <h2>Reset Password</h2>
        <div>
                <label htmlFor='password' className='login-label'>Password:</label>
                <input className='login-input'
                type="password"  
                placeholder="password" id = "password"
                onChange={(e)=>(setPassword(e.target.value))}
                value = {password}
                required
                /><br></br>
                {errs.password && <span className='warn'>{errs.password}</span>}
                </div>

                <div>
                <label htmlFor='repeatPassword' className='login-label'>Repeat Password:</label>
                <input className='login-input'
                type="password"  
                placeholder="repeat your password" id = "repeatPassword"
                onChange={(e)=>(setRepeatPassword(e.target.value))}
                value = {repeatPassword}
                required
                /><br></br>
                {errs.password && <span className='warn'>{errs.password}</span>}
                {msg && <span className='suc'>{msg}</span>}
                </div>

            <button type = 'submit' className='login-btn' id='send-reset'>reset password</button>
        </form>) : (
            <h1>404 Not Found. The link has expired, Go back to <Link to="/forgetpsw" className='login-link'>Forget Password</Link> page and resend the link</h1>
        )}
    </div>
    )

}

export default ResetPsw;