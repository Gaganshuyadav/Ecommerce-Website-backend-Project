import TuneIcon from '@mui/icons-material/Tune';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import ReorderIcon from "@mui/icons-material/Reorder";
import { Fragment} from "react";
import Sidebar from "./Sidebar";
import MetaData from "../layout/MetaData";
import "./updateProduct.css";
import { useState, useEffect } from "react";
import { useParams} from "react-router-dom";
import { Typography } from '@mui/material';
import { useDispatch, useSelector} from "react-redux";
import { updateProduct, getProductDetailsForUpdation ,clearError, clearMessage} from "../../features/Slices/ProductSlice";
import { useAlert} from "react-alert";
import Loader from '../layout/Loader/Loader';

export default function UpdateProduct(){

    const dispatch = useDispatch();
    const alert = useAlert();
    const params = useParams();
    const {  loading ,isUpdated , error, message, product } = useSelector( state=>state.products);
    const categories = [ "Laptop", "Footwear", "Bottom", "Tops", "Attire", "Camera", "SmartPhones", "Shoes"];


    const [ name, setName] = useState("");
    const [ price, setPrice] = useState("");
    const [ description, setDescription] = useState("");
    const [ category, setCategory] = useState("");
    const [ stock, setStock] = useState("");
    const [ images, setImages] = useState([]);
    const [ imagesPreview, setImagesPreview] = useState([]);
    const [ oldImagesPreview, setOldImagesPreview] = useState([]);

    //useEffect for product load by id
    useEffect(()=>{
        
        //this condition is required because previous product is in the product .so, we have to check that previous user id cannot match with current id
        if( product && product._id===params.id){
            setName(product.name);
            setPrice(product.price);
            setDescription(product.description);
            setCategory(product.category);
            setStock(product.Stock);

            if(oldImagesPreview.length===0){
            //set old images
            for( let image of product.images){
                setOldImagesPreview( (old)=>[ ...old, image.url]);
            }  
            }
        }
        else{
            dispatch( getProductDetailsForUpdation( params.id));
        }

        if(isUpdated){
            alert.success(message);
            dispatch(clearMessage());
            //this is needed to update the state.product component after update ,we load the user information once again , otherwise if any user coming instantly from product list in the same product{ the product is not updated yet because old information stored in state.product }
            dispatch(getProductDetailsForUpdation( params.id));
        }
        if(error){
            alert.error(error);
            dispatch(clearError());
        } 
    },[ error, isUpdated, product]);

    const updateProductSubmitHandler = (e) =>{
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", name);
        formData.append("price", price);
        formData.append("description", description);
        formData.append("category", category);
        formData.append("Stock", stock);

        //if  multiple value with same key ,make an array
        for( let image of images){
            formData.append("images",image);
        }
        
        dispatch( updateProduct( { id: params.id , formData}));
       
    }

    const updateProductImagesChange = (e) =>{
        const reader = new FileReader();
        reader.onload = (e)=>{
            if(reader.readyState === 2){
                setImages( (old)=>[ ...old, reader.result]);
                imagesPreview.push(reader.result);
            }
        };

        reader.readAsDataURL(e.target.files[0]);
    }


    return(
        <Fragment>
            {
                loading ?
                <Loader/>:(
            
            <div className="dashboard">
                <MetaData title="dashboard -update Product"/>
                <div className="leftSide">
                    <Sidebar />
                </div>
                <div className="rightSide">
                    <div className="updateProductContainer">
                        <Typography>Update Product</Typography>
                        <form  className="updateProductForm" onSubmit={updateProductSubmitHandler}  encType='multipart/form-data'>
            
                        <div className="nameArea">
                            <DriveFileRenameOutlineIcon/>
                            <input type="text" value={name} placeholder="Product Name" onChange={( e)=>{setName( e.target.value)} } />
                        </div>

                        <div className="priceArea">
                            <CurrencyRupeeIcon/>
                            <input type="number" value={price} placeholder="Price" onChange={(e)=>{setPrice( e.target.value)} } />
                        </div>

                        <div className="descriptionArea">
                            <ContentPasteIcon/>
                            <input type="text" value={description} placeholder="Product Description" onChange={(e)=>{setDescription( e.target.value)} } />
                        </div>

                        <div className="categoryArea">
                            <TuneIcon/>
                            <select value={category} onChange={(e)=>setCategory(e.target.value)}>
                                <option value="">Select Category</option>
                                {
                                    categories.map( ( item, idx)=>{
                                        return <option key={idx} value={item} >{item}</option>
                                    })
                                }
                            </select>
                        </div>

                        <div className="stockArea">
                            <ReorderIcon/>
                            <input type="number" value={stock} placeholder="Stock" onChange={(e)=>{setStock( e.target.value)} } />
                        </div>

                        <div className="fileArea">
                            <TextSnippetIcon/>
                            <input type="file" name="productImages" accept="image/*" onChange={ updateProductImagesChange} multiple/>
                        </div>

                        <div className="previewAllImages">
                            {
                                imagesPreview.length!==0
                                ?
                                imagesPreview.map( (image, idx)=>{
                                    return(
                                        <div key={idx} className="image">
                                            <img src={image} alt={`image-${idx}`}/>
                                        </div>
                                    )
                                })
                                :
                                oldImagesPreview.map( (image, idx)=>{
                                    return(
                                        <div key={idx} className="image">
                                            <img src={image} alt={`image-${idx}`}/>
                                        </div>
                                    )
                                })
                            }
                        </div>

                        <button>Update</button>
                        </form>
                    </div>
                </div>
            </div>
                )
            }
        </Fragment>
    )
}