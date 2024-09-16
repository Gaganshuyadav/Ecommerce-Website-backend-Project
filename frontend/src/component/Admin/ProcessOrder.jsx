import { Fragment, useEffect, useState} from "react";
import { useSelector, useDispatch} from "react-redux";
import "./ProcessOrder.css";
import MetaData from "../layout/MetaData.jsx";
import Typography from "@mui/material/Typography";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getOrderDetails, clearError, updateOrder, clearIsUpdated } from "../../features/Slices/OrderSlice.jsx";
import Loader from "./../layout/Loader/Loader.jsx";
import { useAlert} from "react-alert";

export default function ConfirmOrder(){

    const dispatch = useDispatch();
    const params  = useParams();
    const { order, loading, error, isUpdated} = useSelector( state=>state.order); 
    const [ status, setStatus] = useState("");
    const alert = useAlert();

    useEffect(()=>{

        dispatch( getOrderDetails( params.id));

        if(error){
            alert.error(error);
            setTimeout(()=>{
                clearError();
            },10000);
        }

        if(isUpdated){
        dispatch( getOrderDetails( params.id));

        setTimeout(()=>{
            dispatch( clearIsUpdated());
        },10000);
        }

    },[ error, isUpdated]);

    const handleStatusBtn = ()=>{
        const formData = new FormData();
        formData.append("status",status);
        dispatch(updateOrder({id:params.id, formData}));
    };

    console.log(order);
    console.log(status);
    return(
        <Fragment>
            <MetaData title="Process Order"/>
        {
            loading
            ?
            <Loader/>
            :
            (
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

                <div className="paymentArea">
                    <Typography fontSize={26}>Payment</Typography>
                    <div className="paymentAreaBox">
                      <div>
                        <p>Payment Status: </p>
                        <span style={{color: order.paymentInfo && order.paymentInfo.status==="succeeded" ? "green" : "red"}}>{ order.paymentInfo && order.paymentInfo.status==="succeeded" ? "PAID" : "NOT PAID"}</span>
                      </div>
                      <div>
                        <p>Amount: </p>
                        <span>{ order && order.totalPrice}</span>
                      </div>
                    </div>
                </div>

                <div className="statusArea">
                    <Typography fontSize={26}>Order Status</Typography>
                    <div className="statusAreaBox">
                        <span style={{color: order.orderStatus && order.orderStatus==="Processing" ? "red" : ( order.orderStatus==="Shipped" ? "blue" : "green") }}>{ order.orderStatus && order.orderStatus}</span>
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
                    <select value={ status} onChange={(e)=>{ setStatus(e.target.value);console.log(e);console.log(e.target.value)}}>
                       <option value="">Select Status</option>
                       { order && order.orderStatus==="Processing" && (<option value="Shipped" >Shipped</option>) }
                       { order && (order.orderStatus==="Processing" || order.orderStatus==="Shipped")  && (<option value="Delivered">Delivered</option>) }
                    </select>
                </div>
                <button onClick={ handleStatusBtn} style={{backgroundColor: status==="" ? "gray": "tomato" }} 
                disabled={ status===""  ? true : false}>Process</button>
                </div>
              </div>
           </div>
        )
    }
        </Fragment>
        
        
    )
}