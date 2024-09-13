import TuneIcon from '@mui/icons-material/Tune';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import ReorderIcon from "@mui/icons-material/Reorder";
import { Fragment} from "react";
import Sidebar from "./Sidebar";
import MetaData from "../layout/MetaData";
import "./NewProduct.css";
import { useState, useEffect } from "react";
import { Typography } from '@mui/material';
import { useDispatch, useSelector} from "react-redux";
import { createProduct, clearError, clearSuccess} from "../../features/Slices/ProductSlice";
import { useAlert} from "react-alert";
import Loader from '../layout/Loader/Loader';

export default function NewProduct(){

    const dispatch = useDispatch();
    const alert = useAlert();
    const loading=false;
    const { success, error} = useSelector( state=>state.products);
    const categories = [ "Laptop", "Footwear", "Bottom", "Tops", "Attire", "Camera", "SmartPhones", "Shoes"];


    const [ name, setName] = useState("");
    const [ price, setPrice] = useState("");
    const [ description, setDescription] = useState("");
    const [ category, setCategory] = useState("");
    const [ stock, setStock] = useState("");
    const [ images, setImages] = useState([]);
    const [ imagesPreview, setImagesPreview] = useState([]);


    const createProductSubmitHandler = (e) =>{
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
        console.log(images.length);
        
        dispatch( createProduct(formData));
       
    }

    const createProductImagesChange = (e) =>{
        const reader = new FileReader();
        reader.onload = (e)=>{
            if(reader.readyState === 2){
                setImages( (old)=>[ ...old, reader.result]);
                imagesPreview.push(reader.result);
            }
        };

        reader.readAsDataURL(e.target.files[0]);
    }

    useEffect(()=>{
        if(success){
            alert.success("new product created successfully");
            dispatch(clearSuccess());
        }
        if(error){
            alert.error(error);
            dispatch(clearError());
        }
    },[error,success]);


    return(
        <Fragment>
            {
                loading ?
                <Loader/>:(
            
            <div className="dashboard">
                <MetaData title="dashboard - create new Product"/>
                <div className="leftSide">
                    <Sidebar />
                </div>
                <div className="rightSide">
                    <div className="newProductContainer">
                        <Typography>Create Product</Typography>
                        <form  className="createProductForm" onSubmit={createProductSubmitHandler}  encType='multipart/form-data'>
            
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
                            <input type="file" name="productImages" accept="image/*" onChange={createProductImagesChange} multiple/>
                        </div>

                        <div className="previewAllImages">
                            {
                                imagesPreview.map( (image, idx)=>{
                                    return(
                                        <div key={idx} className="image">
                                            <img src={image} alt={`image-${idx}`}/>
                                        </div>
                                    )
                                })
                            }
                        </div>

                        <button>Create</button>
                        </form>
                    </div>
                </div>
            </div>
                )
            }
        </Fragment>
    )
}