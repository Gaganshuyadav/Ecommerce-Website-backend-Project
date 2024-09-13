import { Fragment, useEffect, useState} from "react";
import axios from "axios";
import { useParams} from "react-router-dom";
import { useSelector, useDispatch} from "react-redux";
import { getProductDetails, newReview, clearError, clearMessage} from "../../features/Slices/ProductSlice";
import { addToCart} from "../../features/Slices/CartSlice.jsx";
import { useAlert} from "react-alert";
import Carousel from "react-material-ui-carousel";
import Loader from "../layout/Loader/Loader";
import ReactStars from "react-rating-stars-component";
import ReviewCard from "./ReviewCard.jsx";
import "./ProductDetails.css";
import MetaData from "../layout/MetaData.jsx";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import { AffirmMessageElement } from "@stripe/react-stripe-js";


export default function ProductDetails(){

    const params = useParams();
    const { product, loading, error, success, message} = useSelector(state=>state.products);
    const dispatch = useDispatch();
    const alert = useAlert();

    const [ quantity, setQuantity] = useState(1);

    const addToCartHandler = ()=>{
        dispatch(addToCart( { productId: product._id, name: product.name, price: product.price, image: product.images[0].url, stock: product.Stock, quantity: quantity}));
        alert.success("Item Added TO Cart")
    }

    useEffect(()=>{
        async function getDetail(){
            dispatch( getProductDetails({ loading: true, products:[], productsCount: 0, error:"" }));
            try{
                const {data} = await axios.get(`http://localhost:3000/api/v1/products/${params.id}`);
                dispatch( getProductDetails( { loading: false, product: data.product}));
            }
            catch( err){
                dispatch( getProductDetails({ error: err.response.data.message, loading: false, product: ""}));
                if(err){
                    return alert.error(err.response.data.message);
                }
            }
        }
        getDetail();

    },[ success]);              //success is important part to load the updated details after submitting the new review


    //this is for the review error
    useEffect(()=>{
        if(message){
            alert.success(message);
            dispatch(clearMessage());
        }
        if(error){
            alert.error(error);
        }
        dispatch(clearError());
    }, [error, message])

    //ratings
    const options ={
        edit:false,
        color: "rgba(20,20,20,0.1)",
        size: window.innerWidth < 600 ? 19 : 26,
        activeColor:"#faaf00",
        value: product ? product.ratings : 0 ,
        isHalf: true,
 
    };

    //add new rating using dialog
    const [ open, setOpen] = useState(false); 
    const [ ratingValue, setRatingValue] = useState(1);
    const [ textReview, setTextReview] = useState("");

    const handleClickOpen =()=>{
        setOpen(true);
    }

    const handleClickClose =()=>{
        setOpen(false);
    }

    const handleSubmitReview = () =>{
        dispatch( newReview({rating: ratingValue, comment: textReview, productId: params.id}))
        setOpen(false);
    }


    return(
        
        <Fragment>
        {
        loading
        ?
        <Loader/>
        :
          <Fragment>
             <MetaData title={`${product.name} -- Ecommerce`}/>
             {/* product details */}
            <div className="ProductDetails">
                <div className="block-1">
                <Carousel>
                    {
                        product.images && product.images.map(( item, i)=>{
                            return(
                                <img
                                className="CarouselImage"
                                key={i}
                                src={item.url}
                                alt={`${i} Slide`}
                                />
                        )})
                    }
                </Carousel>
                </div>

                <div className="block-2">
                    <div className="detailsBlock-1">
                        <h2>{ product.name}</h2>
                        <p>Product # { product._id}</p>
                    </div>
                    <div className="detailsBlock-2">
                        <ReactStars {...options} /><span>( {product.numOfReviews} Reviews)</span>
                    </div>
                    <div className="detailsBlock-3">
                        <h1>&#8377;{product.price}</h1>
                        <div className="details-3-1">
                            <div className="details-3-1-1">
                                <button onClick={()=>setQuantity( quantity>1 ? quantity-1 : quantity)}>-</button>
                                <input type="number" value={ quantity} readOnly/>
                                <button onClick={()=>{ setQuantity(  product.Stock>quantity ? quantity+1 : quantity )}} >+</button>
                            </div>
                            <div className="details-3-1-2">
                                <button disabled={ product.Stock<1 ? true : false } onClick={ addToCartHandler}>Add to Cart</button>
                            </div>
                        </div>
                    </div>
                    <div className="detailsBlock-4">
                        Status: { product.Stock>1 ? <span className="InS">InStock</span> : <span className="OoS">Out of Stock</span>} 
                    </div>
                    <div className="detailsBlock-5">
                        <h2>Description :</h2>
                        <p>{product.description}</p>
                    </div>
                    <button className="submitreview" onClick={ handleClickOpen}>
                        Submit Review
                    </button>
                </div>
            </div>





            {/* add new reviews */}
              <Dialog
                open={open}
                onClose={handleClickClose}
              >
                <div className="addNewReviewDialog">
                <DialogTitle>Submit Review</DialogTitle>
                <DialogContent>
                    <Rating 
                      name="simple-controlled" 
                      value={ratingValue} 
                      onChange={ ( event, newRatingValue)=>{setRatingValue( newRatingValue)}}
                    />
                    <DialogContentText>
                        <textarea rows="8" cols="40" value={textReview} onChange={(e)=>{ setTextReview(e.target.value)}}/>
                    </DialogContentText>
                    <DialogActions>
                        <Button color="error" onClick={handleClickClose}>CANCEL</Button>
                        <Button color="success" onClick={ handleSubmitReview}>SUBMIT</Button>
                    </DialogActions>
                </DialogContent>
                </div>
              </Dialog>







            {/* all reviews  */}
            <h3 className="reviewsHeading">REVIEWS</h3>
            {
            product.reviews && product.reviews[0]
            ?
            <div className="reviews">
                {product.reviews.map( ( review, i)=>{
                    return(
                        <ReviewCard key={review._id} review={review} />
                    )
                    })
                }
            </div>
            :
            <div className="noReviews">
                No Reviews Yet
            </div>
            }
          </Fragment>
        }
        </Fragment>
    )
}