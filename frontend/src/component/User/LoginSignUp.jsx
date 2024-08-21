import { useRef, useState, Fragment, useEffect} from "react";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PersonIcon from '@mui/icons-material/Person';
import "./LoginSignUp.css";
import { Link} from "react-router-dom";


export default function LoginSignUp(){

    const loginTab = useRef(null);
    const registerTab = useRef(null);
    const switcherTab = useRef(null);

    const [ loginEmail, setLoginEmail] = useState("");
    const [ loginPassword, setLoginPassword] = useState("");
    const [ eye, setEye] = useState(false);

    const loginSubmit = () =>{
        console.log("submit");
    }

    const switchTabs = ( e, togg) =>{
        console.log("switchtabs");
        if("login"==togg){
            console.log(switcherTab.current);
            switcherTab.current.style.left = "0px";
        }
        else{
            console.log(switcherTab.current);
            switcherTab.current.style.left = "50%";
        }
    }


    return (
        <Fragment>
            <div className="LoginSignUpContainer">
                <div className="LoginSignUpBox">
                    <div className="login_signup_toggle">
                        <p onClick={ (e)=>{ switchTabs(e, "login")}}>Login</p>
                        <p onClick={ (e)=>{ switchTabs(e, "register")}}>Register</p>
                    </div>
                    <button ref={switcherTab}></button>
                    <form className="loginForm" ref={loginTab} onSubmit={loginSubmit}>
                        <div className="loginEmail">
                            <MailOutlineIcon/>
                            <input type="email" placeholder="Email" value={loginEmail} onChange={(e)=>{ setLoginEmail(e.target.value)}} required/>
                        </div>
                        <div className="loginPassword">
                            <LockOpenIcon/>
                            <input type={eye ? "text": "password"} placeholder="Password" value={loginPassword} onChange={(e)=>{ setLoginPassword(e.target.value)}} required/>
                            <div className="eye">
                            <VisibilityIcon style={{display:eye? "inline" :"none"}} onClick={()=>{ setEye(false)}}/>
                            <VisibilityOffIcon style={{display:eye? "none" :"inline"}} onClick={()=>{setEye(true)}}/>
                            </div>
                        </div>
                        <Link to="/password/forgot" >Forgot Password ?</Link>
                        <input type="submit" value="Login" className="loginBtn"/>
                    </form>
                    <form className="signUpForm" ref={registerTab} onSubmit={registerSubmit}>
                    <div className="signUpName">
                            <PersonIcon/>
                            <input type="text" placeholder="Name" name="name" value={ name} onChange={ registerDataChange} required/>
                        </div>
                        <div className="signUpEmail">
                            <MailOutlineIcon/>
                            <input type="email" placeholder="Email" name="email" value={ email} onChange={ registerDataChange} required/>
                        </div>
                        <div className="signUpPassword">
                            <LockOpenIcon/>
                            <input type={eye ? "text": "password"} placeholder="Password" value={password} onChange={ registerDataChange} required/>
                            <div className="eye">
                            <VisibilityIcon style={{display:eye? "inline" :"none"}} onClick={()=>{ setEye(false)}}/>
                            <VisibilityOffIcon style={{display:eye? "none" :"inline"}} onClick={()=>{setEye(true)}}/>
                            </div>
                        </div>
                        <input type="submit" value="Register" className="signUpBtn"/>
                    </form>
                </div>
            </div>
        </Fragment>
    )
}