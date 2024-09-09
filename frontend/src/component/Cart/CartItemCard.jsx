import "./CartItemCard.css";
import { Link } from "react-router-dom";
import { useDispatch} from "react-redux";
import { removeFromCart } from "../../features/Slices/CartSlice";

export default function CartItemCard( {item}){

    const dispatch = useDispatch();

    return(
        <div className="cartItemCard">
            <img src={item.image} alt={item.name}/>
            <div>
                <Link to={`/product/${item.productId}`} >{item.name}</Link>
                <span>Price: &#8377;{item.price}</span>
                <p onClick={()=>{ dispatch( removeFromCart(item.productId))} }>Remove</p>
            </div>
        </div>
    )
}