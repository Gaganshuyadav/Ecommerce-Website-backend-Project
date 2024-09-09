import { Fragment, useState, useEffect} from "react";
import Payment from "./Payment";
import axios from "axios";
import { Elements} from "@stripe/react-stripe-js";
import { loadStripe} from "@stripe/stripe-js";

export default function PaymentKey(){

    const [ client_secret, setClient_Secret] = useState("");
    const [ stripeApiKey, setStripeApiKey] = useState("");
    
    const OrderInfo = JSON.parse( sessionStorage.getItem("orderInfo"));

    const paymentData = {
        amount : Number((OrderInfo.totalPrice*100).toFixed(2))
    }

    useEffect(()=>{

        // get the STRIPE_API_KEY from server
        async function getStripeApiKey(){
            const token = localStorage.getItem("token");
            const { data} = await axios.get("http://localhost:3000/api/v1/stripeapikey",{ headers: { "Content-Type":"application/json", 'Authorization': `Bearer ${token}`}});
            setStripeApiKey(data.stripeApiKey);
        }

        async function getClientSecret(){
            const token  = localStorage.getItem("token");
            const config = { 
                headers: {
                    "Content-Type":"application/json",
                    "Authorization":`Bearer ${token}`,
                }
            };

            // take client_secret from backend which contains the secret key
            const { data} = await axios.post("http://localhost:3000/api/v1/payment/process", paymentData, config);
            setClient_Secret(data.client_secret);
        }

        getStripeApiKey();
        getClientSecret();
    },[]);
    return(
        <Fragment>
            {
                stripeApiKey && client_secret && (
            <Elements stripe={ loadStripe( stripeApiKey)} options={{clientSecret: client_secret}}>
                <Payment/>
            </Elements>
            )
            }
        </Fragment>
    )
}