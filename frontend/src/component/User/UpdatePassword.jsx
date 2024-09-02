import { useState, Fragment, useEffect} from "react";
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import "./UpdatePassword.css";
import { useNavigate} from "react-router-dom";
import { useDispatch, useSelector} from "react-redux";
import { useAlert} from "react-alert";
import Loader from "../layout/Loader/Loader";
import MetaData from "../layout/MetaData";
//functions
import { updatePassword, clearUpdate, clearError } from "../../features/Slices/UserSlice";


export default function UpdatePassword(){
    
    // dispatch, selector, navigate,alert
    const dispatch = useDispatch();
    const { error, loading, isUpdated} = useSelector(state=>state.user);
    const navigate = useNavigate();
    const alert = useAlert();

    const [ oldPassword, setOldPassword] = useState(""); 
    const [ newPassword, setNewPassword] = useState("");
    const [ confirmPassword, setConfirmPassword] = useState("");
    const [ eye1, setEye1] = useState(false);
    const [ eye2, setEye2] = useState(false);
    
    // useEffect
    useEffect(()=>{
        
        if(isUpdated){
            alert.success("Password Updated Successfully"); 
            navigate("/account");
            dispatch(clearUpdate());
        }
        if(error){
            alert.error(error);
            dispatch(clearError());
        }
    },[ isUpdated, error]);
    
    const UpdatePasswordSubmit = (e)=>{
        e.preventDefault();
        const myForm = new FormData();
        myForm.set("oldPassword",oldPassword);
        myForm.set("newPassword",newPassword);
        myForm.set("confirmPassword", confirmPassword);
        
        dispatch( updatePassword( myForm));
    }

    return (
        <Fragment>
            {
                loading
                ?
                <Loader/>
                :
            <div className="UpdatePasswordContainer">
                <div className="UpdatePasswordBox">
                    <h1>Update Password</h1>
                    <form className="UpdatePasswordForm" onSubmit={ UpdatePasswordSubmit} >
                
                       <div className="oldPassword">
                            <VpnKeyIcon/>
                            <input 
                            type={eye1 ? "text" : "password" } 
                            placeholder="Old Password" 
                            value={oldPassword} 
                            onChange={ (e)=>setOldPassword(e.target.value)} 
                            required
                            />
                            { eye1 ? <span onClick={()=>setEye1(false)}> <VisibilityIcon/> </span> : <span onClick={()=>setEye1(true)}> <VisibilityOffIcon/> </span> }
                        </div>

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
                            type="password" 
                            placeholder="Confirm Password" 
                            value={ confirmPassword} 
                            onChange={ (e)=>setConfirmPassword(e.target.value)} 
                            required
                            />
                        </div>
                        <input type="submit" value="Change" className="PasswordChangeBtn"/>
                    </form>
                </div>
            </div>
            }
        </Fragment>
    )
}