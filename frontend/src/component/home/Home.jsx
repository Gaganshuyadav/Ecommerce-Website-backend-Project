import { Fragment } from "react";
import { CgMouse} from "react-icons/cg";
import "./Home.css";
import Product from "./ProductCard.jsx";
import MetaData from "../layout/MetaData";
import { useDispatch, useSelector} from "react-redux"
import { getProduct} from "../../features/Slices/ProductSlice";
import { useEffect } from "react";
import axios from "axios";
import Loader from "../layout/Loader/Loader";
import { useAlert} from "react-alert";

export default function Home(){

    const { products, loading, productCount, error } = useSelector(state=>state.products);
    const dispatch = useDispatch();
    const alert = useAlert();

    // setTimeout(()=>{
    //     dispatch(getProduct({hello:"main aa gya"}));
    // },20000);

    useEffect( ()=>{
        async function get(){
        dispatch( getProduct( { loading: true ,products: [], productCount: 0})); 
        try{
            const { data} = await axios.get("http://localhost:3000/api/v1/products");
              dispatch( getProduct({ ...data, loading: false}));
        }
        catch(err){
            dispatch( getProduct({ loading: false, products: [], productCount: 0, error: err.response.data.message }));
            
            if(err){
                alert.error(err.response.data.message);
            }
        }
        }
        get();
    },[]);


    return(
        <Fragment>
            { loading 
            ?
            ( <Loader/>)
            :
            ( <Fragment>
            <MetaData title="Ecommerce"/>

            <div className="banner">
                <p>Welcome to Ecommerce</p>
                <h1>FIND AMAZING PRODUCTS BELOW</h1>
                <a href="#container">
                    <button>
                        Scroll <CgMouse/>
                    </button>
                </a>
            </div>

            <h2 className="homeHeading">Featured Products</h2>

            <div className="container" id="container">
               { products && products.map( ( product)=>{
                    return(
                        <Product key={product._id} product={product} />
                    )
               })
               }
            </div>
            </Fragment>)
            }
        </Fragment>
    )
}