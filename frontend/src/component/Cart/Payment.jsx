import { Fragment, useRef, useState} from "react";
import CheckoutSteps from "./CheckoutSteps.jsx";
import { useAlert} from "react-alert";
import { useDispatch, useSelector} from "react-redux";
import { useNavigate} from "react-router-dom";
//------------------------------------
import {
    PaymentElement,
    CardElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js";
//------------------------------------
import Typography from "@mui/material/Typography";
import MetaData from ".././layout/MetaData.jsx";
import "./Payment.css";
import { createOrder} from "../../features/Slices/OrderSlice.jsx";


export default function Payment(){

    const { shippingInfo, cartItems} = useSelector( state=>state.cart);
    const { user} = useSelector( state=>state.user);

    const OrderInfo = JSON.parse( sessionStorage.getItem("orderInfo"));
    const payBtn = useRef();
    const alert = useAlert();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    //add to order for createOrder
    const order = {
        shippingInfo,
        orderItems: cartItems,
        itemsPrice: OrderInfo.subTotal,
        taxPrice: OrderInfo.tax,
        shippingPrice: OrderInfo.shippingCharges,
        totalPrice: OrderInfo.totalPrice
    }


    // useStripe() and useElements() is used to wait for stripe elements to become available,because stripe elments may not be available immediately because they are loaded lazily. means that the stripe js library and elements instance only when they are actually needed.( they both are acts as Promises that resolve when the stripe instance and elements are fully loaded and initialized (just like await)). 

    // stripe instance provides a set of methods and properties that allow you to interact with th stripe API, such as creating payment methods, handling payments, and handling subscriptions.
    const stripe = useStripe();
    // elements refers to the Stripe elements instance, which is a set of pre-build UI components for collecting payment informations, such as card numbers, expiration dates, and CVC codes and more.
    const elements = useElements();

    const handleChange = (e) =>{
        if(e.error){
            alert.error(e.error.message);
        }
    }

    const submitHandler = async ( e)=>{
        e.preventDefault();
        payBtn.current.disabled = true;
        
        try{
            if(!stripe || !elements){
                return;
            }

            const result = await stripe.confirmPayment({
                    elements,
                    billing_details: {
                        name: user.name,
                        email: user.email,
                        address: {
                            line1: shippingInfo.address,
                            city: shippingInfo.city,
                            state: shippingInfo.state,
                            postal_code: shippingInfo.pinCode,
                            country: shippingInfo.country,
                        },
                    },
                    confirmParams:{
                        return_url:"http://localhost:5173/success/exit",
                    },
                    redirect: "if_required",
            });

            if(result.error){
                payBtn.current.disabled = false;
                alert.error(result.error.message);
            }
            else{
                if(result.paymentIntent && result.paymentIntent.status == "succeeded"){

                    order.paymentInfo ={
                        id: result.paymentIntent.id,
                        status: result.paymentIntent.status,
                    }
                    dispatch( createOrder(order));
                    navigate("/success");
                    alert.success("payment Done");
                }
            }
        }
        catch(error){
            payBtn.current.disabled = false;
            alert.error(error);
        }
    }
    return(
        <Fragment>
            <MetaData title="Payment" />
            <CheckoutSteps activeStep={2}/>

            <div className="paymentContainer">  
                <Typography style={{fontSize:"25px",marginTop:"10px", marginBottom:"5px"}} >Card Info</Typography>
                <form className="paymentForm" onSubmit={ submitHandler}>

                    <PaymentElement onChange={handleChange}/>

                    <input 
                    type="submit" 
                    value={`Pay - ${ OrderInfo && (OrderInfo.totalPrice).toFixed(2)}`}
                    ref={payBtn}
                    className="paymentFormBtn"
                    />
                </form>
            </div>

        </Fragment>
    )
}
