import { Fragment, useState} from "react";
import { SpeedDial} from '@mui/material';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { Backdrop} from "@mui/material";
import { useNavigate} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAlert} from "react-alert";
import { logout } from "../../../features/Slices/UserSlice";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

export default function UserOptions({ user}){

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const alert = useAlert();
    const {cartItems} = useSelector(state=>state.cart);

    const orders = () =>{
        navigate("/orders")
    }
    const account = () =>{
        navigate("/account")
    }
    const Userlogout = () =>{
        dispatch( logout());
        alert.success("Logout Successfully");

    }
    const cart = () =>{
        navigate("/cart");
    }

    const dashboard = () =>{
        navigate("/dashboard")
    }

    const options = [
        { icon: <ListAltIcon/>, name: "Orders", func: orders},
        { icon: <AccountCircleIcon/>, name: "Account", func: account},
        { icon: <ShoppingCartIcon style={ {color: cartItems.length>0 ? "tomato" : "unset" }}/>, name: `Cart(${cartItems.length})`, func: cart},
        { icon: <LogoutIcon/>, name: "Logout", func: Userlogout}
    ]; 

    if(user.role==="admin"){
        options.unshift({ icon: <DashboardIcon/>, name: "Dashboard", func: dashboard});
    }

    let [ open, setOpen] = useState(false);
    return(
        <Fragment>
            <Backdrop open={open} style={{zIndex:"11"}} />
                <SpeedDial 
                  ariaLabel="SpeedDial User" 
                  direction="down"
                  onOpen={ ()=>{setOpen(true)}}
                  onClose={ ()=>{setOpen(false)}}
                  open={ true}
                  sx={{position:"fixed", right:"25px", top:"15px",zIndex:"12"}}
                  icon={<img src={user.avatar.url ? user.avatar.url : "https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0= "} 
                        style={{width:"70px",height:"70px",objectFit:"fix",borderRadius:"50%"}} alt="Profile" 
                        />}
                >
                { options.map(( item)=>{
                        return(
                            <SpeedDialAction key={item.name} icon={item.icon} tooltipTitle={item.name} onClick={item.func}></SpeedDialAction>
                        )
                    })
                }
                </SpeedDial>
        </Fragment>
    )
}