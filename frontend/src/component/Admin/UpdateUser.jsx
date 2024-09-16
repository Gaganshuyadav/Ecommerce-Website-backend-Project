import "./UpdateUser.css";
import { Fragment, useState, useEffect} from "react";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import GppGoodIcon from '@mui/icons-material/GppGood';
import Loader from "../layout/Loader/Loader";
import MetaData from "../layout/MetaData";
import Sidebar from "./Sidebar";
import Typography from "@mui/material/Typography";
import { useAlert } from "react-alert";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails, updateUser, clearError, clearMessage, clearUpdate} from "../../features/Slices/UserSlice";
import { useRadioGroup } from "@mui/material";


export default function UpdateUsr(){

    const { user, error, isUpdated, message, loading} = useSelector( state=>state.user);
    const dispatch = useDispatch();
    const alert = useAlert();
    const params = useParams();
    const navigate = useNavigate();

    const [ name, setName] = useState("");
    const [ email, setEmail] = useState("");
    const [ role, setRole] = useState("");

    useEffect(()=>{
        if(user && user._id===params.id){
            setName(user.name);
            setEmail(user.email);
            setRole(user.role);
        }
        else{
            dispatch( getUserDetails( params.id));
        }

        if(error){
            alert.error(error);
            dispatch( clearError());
        }

        if(isUpdated){
            alert.success(message);
            navigate("/admin/users");
            dispatch( clearUpdate());
            dispatch( clearMessage());
        }

    }, [ error, isUpdated, user ]);

    const handleSubmitButton = (e) =>{
        e.preventDefault();
        const formData = new FormData();
        formData.set("name", name);
        formData.set("email", email);
        formData.set("role", role);

        dispatch( updateUser({ id: params.id, formData}));
    }

    return(
        <Fragment>
            {
                loading ?
                <Loader/>:
                (
            
            <div className="dashboard">
                <MetaData title="dashboard -update User"/>
                <div className="leftSide">
                    <Sidebar />
                </div>
                <div className="rightSide">
                    <div className="updateUserContainer">
                        <Typography>Update User</Typography>
                        <form  className="updateUserForm" >
            
                        <div className="updateName">
                            <AccountBoxIcon/>
                            <input type="text" value={name} onChange={(e)=>{setName( e.target.value)} } />
                        </div>

                        <div className="updateEmail">
                            <MailOutlineIcon/>
                            <input type="text" value={email} onChange={(e)=>{setEmail( e.target.value)} } />
                        </div>

                        <div className="updateRole">
                            <GppGoodIcon/>
                            <select value={role} onChange={(e)=>setRole(e.target.value)}>
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        <button onClick={ handleSubmitButton }>UPDATE</button>
                        </form>
                    </div>
                </div>
            </div>
                )
            }
        </Fragment>
    )
}