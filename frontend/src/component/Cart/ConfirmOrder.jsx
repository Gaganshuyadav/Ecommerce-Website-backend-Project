import { Fragment} from "react";
import { useSelector} from "react-redux";
import CheckoutSteps from "./CheckoutSteps.jsx";
import "./ConfirmOrder.css";
import MetaData from "../../component/layout/MetaData.jsx";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { Country, State} from "country-state-city";
import { useNavigate } from "react-router-dom";

export default function ConfirmOrder(){

    const navigate = useNavigate();
    const { user} = useSelector( state=>state.user);
    const { cartItems, shippingInfo} = useSelector( state=>state.cart);

    const subTotal = cartItems.reduce((total,item)=>{
        return total+(item.price*item.quantity);
    },0)

    const shippingCharges = 2000 > 0 ? 0 : 200;

    const tax = Number((subTotal*0.18).toFixed(2));   // .tofixed(2) convert number to string 

    const totalPrice = subTotal + shippingCharges + tax;

    const country = Country.getCountryByCode(shippingInfo.country).name;
    const state = State.getStateByCode(shippingInfo.state).name;
    const address = ` ${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.pinCode}, ${state}, ${country}`;

    const proceedToPayment = () =>{
        const data = {
            subTotal,
            shippingCharges,
            tax,
            totalPrice
        }

        sessionStorage.setItem("orderInfo", JSON.stringify(data));
        navigate("/process/payment");

    }

    return(
        <Fragment>
            <MetaData title="Confirm Order"/>
           <CheckoutSteps activeStep={1}/>
           <div className="confirmOrderPage">
              <div className="box1">
                <div className="confirmShippingArea">
                    <Typography fontSize={26}>Shipping Info</Typography>
                    <div className="confirmShippingAreaBox">
                        <div>
                            <p>Name:</p>
                            <span>{user.name}</span>
                        </div>
                        <div>
                            <p>Phone:</p>
                            <span>{shippingInfo.phoneNo}</span>
                        </div>
                        <div>
                            <p>Address:</p>
                            <span>{address}</span>
                        </div>
                    </div>
                </div>
                <div className="confirmCartItems">
                    <Typography fontSize={26}>Your Cart Items</Typography>
                    <div className="confirmCartItemsContainer">
                        {
                            cartItems && cartItems.map( (item)=>{
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
                <div className="orderSummery">
                <Typography fontSize={26}>Order Summery</Typography>
                <div>
                    <div>
                        <p>Subtotal:</p>
                        <span>&#8377;{subTotal}</span>
                    </div>
                    <div>
                        <p>Shipping Charges:</p>
                        <span>&#8377;{shippingCharges}</span>
                    </div>
                    <div>
                        <p>GST:</p>
                        <span>{tax}</span>
                    </div>
                </div>
                <div className="totalPrice">
                    <p><b>Total:</b></p>
                    <span><b>{totalPrice}</b></span>
                </div>
                <button onClick={ proceedToPayment}>Proceed To Payment</button>
                </div>
              </div>
           </div>
        </Fragment>
    )
}