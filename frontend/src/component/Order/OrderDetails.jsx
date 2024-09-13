import { Fragment, useEffect} from "react";
import "./OrderDetails.css";
import { useAlert } from "react-alert";
import { useDispatch, useSelector} from "react-redux";
import { useParams} from "react-router-dom";
import { getOrderDetails} from "../../features/Slices/OrderSlice";
import Loader from "../layout/Loader/Loader";
import { Typography } from "@mui/material";
import { Link} from "react-router-dom";

export default function OrderDetails(){

    const alert = useAlert();
    const params = useParams();
    const dispatch = useDispatch();
    const { order, error, loading} = useSelector( state=>state.order);

    useEffect(()=>{
        dispatch( getOrderDetails(params.id));
        if(error){
            alert.error(error);
        }
    },[error]);

    console.log(order);

    return (
        <Fragment>
            {
            loading
            ?
            <Loader/>
            :
            <div className="orderDetailsPage">
                <div className="orderContainer">
                    <div className="id">
                        <Typography>Order #{order && order._id}</Typography>
                    </div>
                    <div className="shippingInfo">
                        <Typography>Shipping Info</Typography>
                        <div>
                            <div>
                                <p>Name: </p>
                                <span>{order.user && order.user.name}</span>
                            </div>
                            <div>
                                <p>Phone: </p>
                                <span>{order.shippingInfo && order.shippingInfo.phoneNo}</span>
                            </div>
                            <div>
                                <p>Address: </p>
                                <span>{order.shippingInfo && `${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.country}, ${order.shippingInfo.pinCode}, `}</span>
                            </div>
                        </div>
                    </div>
                    <div className="payment">
                    <Typography>Payment</Typography>
                        <div>
                            <div style={{color: order.paymentInfo.status==="succeeded" ? "green" : "red"}} >
                            {order.paymentInfo.status==="succeeded" ? "PAID" : "UNPAID"}
                            </div>
                            <div>
                                <p>Amount: </p>
                                <span>{order.totalPrice && order.totalPrice}</span>
                            </div>
                        </div>
                    </div>
                    <div className="orderStatus">
                    <Typography>Order Status</Typography>
                            <div>
                                <p>{order.orderStatus && `${order.orderStatus}`}</p>
                            </div>
                    </div>
                    <div className="orderItems">
                    <Typography fontSize={26}>Order Items: </Typography>
                    <div className="orderItemsContainer">
                        {
                        order.orderItems && order.orderItems.map( (item)=>{
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
            </div>
            }
            
        </Fragment>
    )
}