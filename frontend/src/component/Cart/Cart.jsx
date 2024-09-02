import { Fragment} from "react";
import "./Cart.css";
import CartItemCard from "./CartItemCard";
import { useSelector, useDispatch} from "react-redux";
import { addToCart} from "../../features/Slices/CartSlice";
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import { Link} from "react-router-dom";

export default function Cart(){

    const { cartItems} = useSelector( state=>state.cart);
    const dispatch = useDispatch(); 

    const increaseQuantity = (item)=>{

        const newQty = item.quantity + 1;
        if(item.stock > item.quantity){
            dispatch(addToCart( { productId: item.productId, name: item.name, price: item.price, image: item.image, stock: item.stock, quantity: newQty}));
        }
    }

    const decreaseQuantity = (item)=>{

        const newQty = item.quantity - 1;
        if(1 < item.quantity){
            dispatch(addToCart( { productId: item.productId, name: item.name, price: item.price, image: item.image, stock: item.stock, quantity: newQty}));
        }
    }
    
    return(
        <Fragment>
        {
            cartItems.length === 0 ? (
            <div className="emptyCart">
                <RemoveShoppingCartIcon/>
                <p>No Product in Your Cart</p>
                <Link to="/products">View Products</Link>
            </div>
            )
            :
            (
            <div className="cartPage">
                    <div className="cartHeader">
                        <p>Product</p>
                        <p>Quantity</p>
                        <p>Subtotal</p>
                    </div>
                    {   cartItems && cartItems.map( (item,i)=>{
                            return(
                                <div className="cartContainer" key={i}>
                                    <CartItemCard item={item}/>
                                    <div className="cartInput">
                                        <button onClick={ ()=>{ decreaseQuantity(item)}} >-</button>
                                        <input type="number" value={item.quantity} readOnly/>
                                        <button onClick={ ()=>{ increaseQuantity(item)}}>+</button>
                                    </div>
                                    <p className="cartSubTotal">&#8377;{item.price*item.quantity}</p>
                                </div>
                            )
                        })
                    }
    
                    <div className="cartGrossTotal">
                        <div></div>
                        <div className="cartGrossTotalBox">
                            <p>Gross Total</p>
                            <p>&#8377;{ cartItems && cartItems.reduce((total,item)=>{ 
                                return (total + (item.price*item.quantity))
                                },0) }
                            </p>
                        </div>
                        <div></div>
                        <div className="checkOutBtn">
                            <button>Check Out</button>
                        </div>  
                    </div>
                    
    
            </div>
            )
        }
        </Fragment>
    )
}