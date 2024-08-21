import { Fragment, useEffect} from "react";
import axios from "axios";
import { useParams} from "react-router-dom";
import { useSelector, useDispatch} from "react-redux";
import { getProductDetails} from "../../features/Slices/ProductSlice";
import { useAlert} from "react-alert";
import Carousel from "react-material-ui-carousel";
import Loader from "../layout/Loader/Loader";
import ReactStars from "react-rating-stars-component";
import ReviewCard from "./ReviewCard.jsx";
import "./ProductDetails.css";
import MetaData from "../layout/MetaData.jsx";

export default function ProductDetails(){

    const params = useParams();
    const { product, loading, error} = useSelector(state=>state.products);
    const dispatch = useDispatch();
    const alert = useAlert();

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
    },[]);


    const options ={
        edit:false,
        color: "rgba(20,20,20,0.1)",
        size: window.innerWidth < 600 ? 19 : 26,
        activeColor:"tomato",
        value: product ? product.ratings : 0 ,
        isHalf: true,

    };

    return(
        
        <Fragment>
        {
        loading
        ?
        <Loader/>
        :
          <Fragment>
             <MetaData title={`${product.name} -- Ecommerce`}/>
            <div className="ProductDetails">
                <div className="block-1">
                <Carousel>
                    {
                        product.images && product.images.map(( item, i)=>{
                            return(
                                <img
                                className="CarouselImage"
                                key={item.url}
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
                                <button>-</button>
                                <input type="number"/>
                                <button>+</button>
                            </div>
                            <div className="details-3-1-2">
                                <button>Add to Cart</button>
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
                    <button className="submitreview">
                        Submit Review
                    </button>
                </div>
            </div>


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