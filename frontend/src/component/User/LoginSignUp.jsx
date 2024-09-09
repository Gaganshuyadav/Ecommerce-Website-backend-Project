import { useRef, useState, Fragment, useEffect} from "react";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PersonIcon from '@mui/icons-material/Person';
import "./LoginSignUp.css";
import { Link, useNavigate} from "react-router-dom";
import { useDispatch, useSelector} from "react-redux";
import { useAlert} from "react-alert";
import Loader from "../layout/Loader/Loader";
//functions
import { login, register, clearError} from "../../features/Slices/UserSlice";

//----------


export default function LoginSignUp(){

    const loginTab = useRef(null);
    const registerTab = useRef(null);
    const switcherTab = useRef(null);

    // dispatch, selector, navigate,alert
    const dispatch = useDispatch();
    const { error, loading, isAuthenticated} = useSelector(state=>state.user);
    const navigate = useNavigate();
    const alert = useAlert();
    

    //Redirect To ( by Cart)
    const redirectTo = location.search ? `/${location.search.split("=")[1]}` : "/account";
   

    // useEffect
    useEffect(()=>{
        if(error){
            alert.error(error);
            dispatch(clearError);
        }
        if(isAuthenticated){
            navigate(redirectTo);
        }
    },[ error, isAuthenticated]);
   
    //login
    const [ loginEmail, setLoginEmail] = useState("");
    const [ loginPassword, setLoginPassword] = useState("");
    const [ eye, setEye] = useState(false);
    //signUp
    const [ user, setUser] = useState({ name:"", email: "", password: ""});
    const { name, email, password} = user;

    const [ avatar, setAvatar] = useState("");
    const [ avatarPreview, setAvatarPreview] = useState("/images/Profile.png");



    //login functions
    const loginSubmit = (e) =>{
        e.preventDefault();
        dispatch( login( { email: loginEmail, password: loginPassword}));
    }

    const switchTabs = ( e, toggle) =>{
       if( toggle === "login"){
        
          switcherTab.current.classList.add("shiftRightToLeft");
          switcherTab.current.classList.remove("shiftLeftToRight");

          registerTab.current.classList.remove("shiftLeftToRightFormRegister");
          loginTab.current.classList.remove("shiftLeftToRightFormLogin");
       }
       if( toggle === "register"){
          switcherTab.current.classList.add("shiftLeftToRight");
          switcherTab.current.classList.remove("shiftRightToLeft");

          registerTab.current.classList.add("shiftLeftToRightFormRegister");
          loginTab.current.classList.add("shiftLeftToRightFormLogin");
       }
    }

    //datachange
    const registerDataChange = (e)=>{
        if( e.target.name === "avatar"){
            const reader = new FileReader();
            reader.onload = (e) => {
                if(reader.readyState === 2){
                    setAvatarPreview(reader.result);
                    setAvatar(reader.result);
                } 
            };
            // reader.readAsDataURL(e.target.files[0]);
            reader.readAsArrayBuffer(e.target.files[0]);
        }
        else{
            setUser( (user)=>{
                return { ...user, [e.target.name]: e.target.value};
            })
        }
    }


    const registerSubmit = (e)=>{
        e.preventDefault();
        const myForm = new FormData();
        myForm.set("name",name);
        myForm.set("email",email);
        myForm.set("password",password);
        myForm.set("avatar", avatar);

        // for(let key of myForm.keys()){
        //     console.log(`${key} = ${myForm.get(key)}`);
        // }
        dispatch( register( myForm));
    }

    return (
        <Fragment>
            {
                loading
                ?
                <Loader/>
                :
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

                    <form className="signUpForm" ref={registerTab} onSubmit={registerSubmit} encType="multipart/form-data">
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
                            <input type={eye ? "text": "password"} placeholder="Password" name="password" value={password} onChange={ registerDataChange} required/>
                            <div className="eye">
                            <VisibilityIcon style={{display:eye? "inline" :"none"}} onClick={()=>{ setEye(false)}}/>
                            <VisibilityOffIcon style={{display:eye? "none" :"inline"}} onClick={()=>{setEye(true)}}/>
                            </div>
                        </div>
                        <div className="registerImage">
                            <img src={ avatarPreview} alt="Avatar Preview" />
                            <input type="file" name="avatar" accept="image/*,video/*" onChange={ registerDataChange} />
                        </div>
                        <input type="submit" value="Register" className="signUpBtn"/>
                    </form>
                </div>
            </div>
            }
        </Fragment>
    )
}