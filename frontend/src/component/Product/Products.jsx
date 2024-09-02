import "./Products.css";
import { useEffect, Fragment, useState} from "react";
import axios from "axios";
import { useSelector, useDispatch} from "react-redux";
import { useParams} from "react-router-dom";
import { getProduct} from "../../features/Slices/ProductSlice";
import ProductCard from "../home/ProductCard";
import { useAlert} from "react-alert";
import Loader from "../layout/Loader/Loader";
import Pagination from "react-js-pagination";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import MetaData from "../layout/MetaData";

export default function Products(){
    const dispatch = useDispatch();
    const { products, loading,error,productsCount , resultPerPage, filteredProductsCount} = useSelector(state=>state.products);
    const params = useParams();
    const  alert = useAlert();
    const [currentPage, setCurrentPage] = useState(1);
    const [price, setPrice] = useState([0,90000]);
    const [tempValue, setTempValue] = useState([0,90000]);
    const [category, setCategory] = useState("");
    const [ratings, setRatings] = useState(1);
    
    //pagination
    const setCurrentPageNo = (pn)=>{
        setCurrentPage(pn);
    }
    //price-range
    const handleTempChange = (event, newTempValue)=>{
        setTempValue(newTempValue);
    }
    const handleChangePrice = (event, newPrice)=>{
        console.log(newPrice);
        setPrice(newPrice);
    }
    const marks=[ { value:0,label:`\u20B90`}, { value:25000,label:`\u20B925000`}, { value:50000,label:`\u20B950000`}, { value:90000,label:`\u20B990000`}, ];
    const textPrice = ( value)=>{
        return `\u20B9${value}`;
    }
    //category
    const categories = [ "Laptop", "Footwear", "Bottom", "Tops", "Attire", "Camera", "SmartPhones", "Shoes"];

    //main-logic(axios)
    useEffect(()=>{
        async function get(){
            dispatch(getProduct({ loading:true, products:[], productsCount:0, error:""}));
          
            //empty object and arrays is true always
           if(params.keyword==undefined){
            params.keyword="";
           }
                      
            try{
                let link = `http://localhost:3000/api/v1/products?keyword=${params.keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&ratings[gte]=${ratings}`;
                
                if(category){
                    link = `http://localhost:3000/api/v1/products?keyword=${params.keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&category=${category}&ratings[gte]=${ratings}`;
                }

                const { data} = await axios.get(link);
                console.log(data);
                dispatch(getProduct({ ...data, loading:false}));
            }
            catch(err){
                dispatch(getProduct({loading:false, error: err.response.data.message }))
                console.log(err);
                return alert.error(err.response.data.message); 
            } 
        }
        get();
    },[ currentPage, price, category, ratings]);
    
    return(
        <Fragment>
        {
            loading
            ?
            <Loader/>
            :
            <Fragment>
            <MetaData title="Products -- Ecommerce"/>
            <div className="right-side">
            <h2 className="productsHeading">Products</h2>
            <div className="products">
                {
                    products && products.map( ( product, idx)=>{
                        return(
                            <ProductCard key={idx} product={product} />
                        )
                    }) 
                }
            </div>
            <div className="filterBox">
                <Typography>Price</Typography>
                   <div className="price-range">
                   <Slider
                    aria-labelledby="range-Slider"
                    valueLabelDisplay="auto"
                    size="small"
                    value={ tempValue}
                    onChange={handleTempChange}
                    onChangeCommitted={ handleChangePrice}
                    min={0}
                    max={90000}
                    getAriaValueText={ textPrice}
                    marks={marks}
                    />  
                    </div>
                    <Typography>Categories</Typography>
                    <ul className="categoryBox">
                    { categories.map( ( ctg, idx)=>{
                            return <li key={idx} style={ ctg===category ? { color:"rgb(0, 0, 0)",fontWeight: "600",fontSize: "18px",cursor: "pointer",letterSpacing: "8px",transition: "all 0.6s"}:{}} 
                            onClick={()=>{ setCategory(ctg)}} >{ctg}</li>
                        })
                    }
                    </ul>
                    <div className="ratings">
                        <fieldset>
                            <legend><Typography style={{fontSize:"14px"}}>&nbsp;Ratings Above &nbsp;</Typography></legend>
                            <Slider
                            aria-labelledby="single-Slider"
                            valueLabelDisplay="auto"
                            size="small"
                            value={ ratings}
                            onChange={ (e,rat)=>{ setRatings(rat)}}
                            min={1}
                            max={5}
                            marks={[{ value:1,label:`1`}, { value:2,label:`2`}, { value:3,label:`3`}, { value:4,label:`4`}, { value:5,label:`5`} ]}
                            />  
                        </fieldset>
                    </div>
            </div>
          

            {
                filteredProductsCount > resultPerPage   && (

            <div className="paginationBox">
                <Pagination
                activePage={ currentPage}
                itemsCountPerPage={ resultPerPage}
                totalItemsCount={ filteredProductsCount}
                onChange={ setCurrentPageNo}
                pageRangeDisplayed={3}

                prevPageText="Prev"
                nextPageText="Next"
                firstPageText={"1st"}
                lastPageText="Last"

                itemClass="page-item"
                linkClass="page-link"
                itemClassFirst="page-item-first"
                itemClassLast="page-item-last"
                activeClass="page-active-item"
                activeLinkClass="page-active-item-link"
                itemClassPrev="disabled"
                itemClassNext="disabled"
                />
            </div>)
           
            }
            </div>
            </Fragment>
        }
        </Fragment>
    )
}