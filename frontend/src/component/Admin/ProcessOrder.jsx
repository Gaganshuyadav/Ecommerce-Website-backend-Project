import { Fragment, useEffect, useState} from "react";
import { useSelector, useDispatch} from "react-redux";
import "./ProcessOrder.css";
import MetaData from "../layout/MetaData.jsx";
import Typography from "@mui/material/Typography";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getOrderDetails, clearError } from "../../features/Slices/OrderSlice.jsx";

export default function ConfirmOrder(){

    const dispatch = useDispatch();
    const params  = useParams();
    const { order, loading, error} = useSelector( state=>state.order); 
    const { category, setCategory} = useState("");

    useEffect(()=>{

        dispatch( getOrderDetails( params.id));

        if(error){
            alert.error(error);
            setTimeout(()=>{
                clearError();
            },10000);
        }
    },[ error]);

    console.log(order);
    return(
        <Fragment>
            <MetaData title="Process Order"/>
           <div className="processOrderPage">
              <div className="box1">
                <div className="processShippingArea">
                    <Typography fontSize={26}>Shipping Info</Typography>
                    <div className="processShippingAreaBox">
                        <div>
                            <p>Name:</p>
                            <span>{ order && order.user && order.user.name}</span>
                        </div>
                        <div>
                            <p>Phone:</p>
                            <span>{ order && order.shippingInfo && order.shippingInfo.phoneNo}</span>
                        </div>
                        <div>
                            <p>Address:</p>
                            <span>{ order && order.shippingInfo && `${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.pinCode}, ${order.shippingInfo.country}`}</span>
                        </div>
                    </div>
                </div>
                <div className="processOrderItems">
                    <Typography fontSize={26}>Order Items</Typography>
                    <div className="Container">
                        {
                            order && order.orderItems && order.orderItems.map( ( item, idx)=>{
                                return(
                                    <div key={item.productId}>
                                        <div>
                                        <img src={item.image}/>
                                        <Link to={`/product/${item.productId}`}>{item.name}</Link>
                                        </div>
                                        <span>{item.quantity} &#215; {item.price} = <b>&#8377;{item.quantity*item.price}</b></span>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
              </div>

              <div className="box2">  
                <div className="processSummery">
                <Typography fontSize={26}>Process Order</Typography>
                <div className="processOrder">
                    <select value={ category} onClick={( e)=>{setCategory( e.target.value)}}>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                    </select>
                </div>
                <button onClick={()=>{dispatch(updateOrder(category))}}>Process</button>
                </div>
              </div>
           </div>
        </Fragment>
    )
}