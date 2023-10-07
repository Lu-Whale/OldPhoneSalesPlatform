import { useState, useEffect} from "react";
import { useNavigate, Link, useParams} from 'react-router-dom';
import axios from 'axios';
import { baseURL } from "../../utils/constant";
import "../Login/Login.css"

const EmaiilVerify = () => {
    const [validUrl, setValidUrl] = useState(true);
    const param = useParams();

    useEffect(()=>{
        const checkEmailUrl = async() => {
            try {
                const url = `${baseURL}/users/${param.id}/verify/${param.token}`
                const{data} = await axios.get(url);
                console.log(data);
                if(data === "invalid link") {
                    setValidUrl(false)
                }
                else {
                    setValidUrl(true)
                }
            } catch (e) {
                console.log(e)
                setValidUrl(false)
            }
        };
        checkEmailUrl()
    },[param]);


    return (
        <div className="login-container">
            {validUrl ? (<h1>Email verified successfully. <Link to="/login" className='login-link'>Login</Link></h1>) :
            (<h1>Link has expired! Please register your account again</h1>)}  
            </div>
    )
}

export default EmaiilVerify;