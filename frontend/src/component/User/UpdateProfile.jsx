import { useState, Fragment, useEffect} from "react";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PersonIcon from '@mui/icons-material/Person';
import "./UpdateProfile.css";
import { useNavigate} from "react-router-dom";
import { useDispatch, useSelector} from "react-redux";
import { useAlert} from "react-alert";
import Loader from "../layout/Loader/Loader";
import MetaData from "../layout/MetaData";
//functions
import { updateProfile, clearUpdate, loadUser, clearError } from "../../features/Slices/UserSlice";



export default function UpdateProfile(){

    // dispatch, selector, navigate,alert
    const dispatch = useDispatch();
    const { error, loading, isAuthenticated, user, isUpdated} = useSelector(state=>state.user);
    const navigate = useNavigate();
    const alert = useAlert();

    const [ name, setName] = useState(""); 
    const [ email, setEmail] = useState("");
    const [ avatar, setAvatar] = useState("");
    const [ avatarPreview, setAvatarPreview] = useState("/images/Profile.png");
    
    // useEffect
    useEffect(()=>{
        if(user){
            setName(user.name);
            setEmail(user.email);
            setAvatarPreview(user.avatar.url);
        }
        if(isUpdated){
            alert.success("Profile Updated Successfully"); 
            dispatch(loadUser());
            navigate("/account");
            dispatch(clearUpdate());
        }
        if(error){
            alert.error(error);
            dispatch(clearError());
        }
    },[ user, isUpdated, error]);

    //changeImages
    const UpdateProfileChange = (e)=>{
            const reader = new FileReader();
            reader.onload = (e) => {
                if(reader.readyState === 2){
                    setAvatarPreview(reader.result);
                    setAvatar(reader.result);
                } 
            };
            reader.readAsDataURL(e.target.files[0]);
    
    }


    const UpdateProfileSubmit = (e)=>{
        e.preventDefault();
        const myForm = new FormData();
        myForm.set("name",name);
        myForm.set("email",email);
        myForm.set("avatar", avatar);
        
        dispatch( updateProfile( myForm));
    }

    return (
        <Fragment>
            <MetaData title="Update Profile --Ecommerce" />
            {
                loading
                ?
                <Loader/>
                :
            <div className="UpdateProfileContainer">
                <div className="UpdateProfileBox">
                    <h1>Update Profile</h1>
                    <form className="UpdateProfileForm" onSubmit={ UpdateProfileSubmit} encType="multipart/form-data">
                        <div className="updateName">
                            <PersonIcon/>
                            <input type="text" placeholder="Name" name="name" value={ name} onChange={ (e)=>setName(e.target.value)} required/>
                        </div>
                        <div className="updateEmail">
                            <MailOutlineIcon/>
                            <input type="email" placeholder="Email" name="email" value={ email} onChange={ (e)=>setEmail(e.target.value) } required/>
                        </div>

                        <div className="updateImage">
                            <img src={ avatarPreview} alt="Avatar Preview" />
                            <input type="file" name="avatar" accept="image/*" onChange={ UpdateProfileChange} />
                        </div>
                        <input type="submit" value="Update" className="UpdateBtn"/>
                    </form>
                </div>
            </div>
            }
        </Fragment>
    )
}