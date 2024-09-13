import { Link } from "react-router-dom"; 
import  ReactStars from "react-rating-stars-component";
import "./Home.css";

export default function Product({ product }){

    const options ={
        edit:false,
        color: "rgba(20,20,20,0.1)",
        size: window.innerWidth < 600 ? 19 : 26,
        activeColor:"#faaf00",
        value: product.ratings,
        isHalf: true,

    };

    return(
        <Link className="productCard" to={`/product/${product._id}`}>
            <img src={ product.images[0].url} alt={ product.name} />
            <p>{product.name}</p>
            <div className="rating"> 
            <ReactStars {...options} /><span>( {product.numOfReviews} Reviews)</span>
            </div>
            <span>&#8377;{product.price}</span>
        </Link>
    )
}