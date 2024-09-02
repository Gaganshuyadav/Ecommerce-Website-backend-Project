import { useState, Fragment, useEffect} from "react";
import MailOutlineIcon from "@mui/icons-material/MailOutline"
import "./ForgotPassword.css";
import { useDispatch, useSelector} from "react-redux";
import { useAlert} from "react-alert";
import Loader from "../layout/Loader/Loader";
//functions
import { forgotPassword, clearError } from "../../features/Slices/UserSlice";


export default function ForgotPassword(){
    
    // dispatch, selector, navigate,alert
    const dispatch = useDispatch();
    const { error, loading, message } = useSelector(state=>state.user);
    const alert = useAlert();


    // useEffect
    useEffect(()=>{
        if(message){
            alert.success(message); 
        }
        if(error){
            alert.error(error);
            dispatch(clearError());
        }
    },[ error, message]);

    //useState
    const [ email, setEmail] = useState("");
    
    const SendEmail = (e)=>{
        e.preventDefault();
        const myForm = new FormData();
        myForm.set("email",email);
        
        dispatch( forgotPassword(myForm));
    }

    return (
        <Fragment>
            {
                loading
                ?
                <Loader/>
                :
            <div className="ForgotPasswordContainer">
                <div className="ForgotPasswordBox">
                    <h1>Forgot Password</h1>
                    <form className="ForgotPasswordForm" onSubmit={ SendEmail} >
                        
                        <div className="EmailBox">
                            <MailOutlineIcon/>
                            <input 
                            type="email" 
                            placeholder="Email" 
                            value={ email} 
                            onChange={ (e)=>setEmail(e.target.value)} 
                            required
                            />
                        </div>
                        <input type="submit" value="Send" className="EmailSendBtn"/>
                    </form>
                </div>
            </div>
            }
        </Fragment>
    )
}