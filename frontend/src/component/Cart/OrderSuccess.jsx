import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Fragment } from 'react';
import { Typography } from '@mui/material';
import { Link} from "react-router-dom";
import "./OrderSuccess.css";

export default function OrderSuccess(){

    return(
        <Fragment>
            <div className="orderSuccess">
                <CheckCircleIcon/>
                <Typography style={{fontSize:"2vmax"}}>Your Order has been Placed successfully</Typography>
                <Link to="/orders">View Orders</Link>
            </div>
        </Fragment>
    )
}