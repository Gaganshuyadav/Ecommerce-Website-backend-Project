import { useState, Fragment, useEffect} from "react";
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import "./ResetPassword.css";
import { useNavigate, useParams} from "react-router-dom";
import { useDispatch, useSelector} from "react-redux";
import { useAlert} from "react-alert";
import Loader from "../layout/Loader/Loader";
//functions
import { resetPassword, clearError } from "../../features/Slices/UserSlice";


export default function UpdatePassword(){
    
    // dispatch, selector, navigate, params, alert
    const dispatch = useDispatch();
    const { error, loading, success} = useSelector(state=>state.user);
    const navigate = useNavigate();
    const { token} = useParams();
    const alert = useAlert();

    const [ newPassword, setNewPassword] = useState("");
    const [ confirmPassword, setConfirmPassword] = useState("");
    const [ eye1, setEye1] = useState(false);
    const [ eye2, setEye2] = useState(false);
    
    // useEffect
    useEffect(()=>{

        if(success){
            alert.success("Password Updated Successfully"); 
            navigate("/login");
        }
        if(error){
            alert.error(error);
            dispatch(clearError());
        }
    },[ success, error]);
    
    const ResetPasswordSubmit = (e)=>{
        e.preventDefault();
        const myForm = new FormData();
        myForm.set("newPassword",newPassword);
        myForm.set("confirmPassword", confirmPassword);
        
        dispatch( resetPassword({myForm, token}));
    }

    return (
        <Fragment>
            {
                loading
                ?
                <Loader/>
                :
            <div className="ResetPasswordContainer">
                <div className="ResetPasswordBox">
                    <h1>Reset Password</h1>
                    <form className="ResetPasswordForm" onSubmit={ ResetPasswordSubmit} >

                        <div className="newPassword">
                            <LockOpenIcon/>
                            <input 
                            type={eye2 ? "text" : "password" } 
                            placeholder="New Password" 
                            value={ newPassword} 
                            onChange={ (e)=>setNewPassword(e.target.value) } 
                            required
                            />
                            { eye2 ? <span onClick={()=>setEye2(false)}> <VisibilityIcon/> </span> : <span onClick={()=>setEye2(true)}> <VisibilityOffIcon/> </span> }
                        </div>

                        <div className="confirmPassword">
                            <LockIcon/>
                            <input 
                            type={eye1 ? "text" : "password" } 
                            placeholder="Confirm Password" 
                            value={confirmPassword} 
                            onChange={ (e)=>setConfirmPassword(e.target.value)} 
                            required
                            />
                            { eye1 ? <span onClick={()=>setEye1(false)}> <VisibilityIcon/> </span> : <span onClick={()=>setEye1(true)}> <VisibilityOffIcon/> </span> }
                        </div>
                        
                        <input type="submit" value="Change" className="PasswordChangeBtn"/>
                    </form>
                </div>
            </div>
            }
        </Fragment>
    )
}