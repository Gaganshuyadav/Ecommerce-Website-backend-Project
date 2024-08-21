import { Fragment, useState} from "react";
import { useNavigate} from "react-router-dom"; 
import "./Search.css";
import MetaData from "../layout/MetaData";

export default function Search(){

    const navigate = useNavigate();
    let [ keyword, setKeyword] = useState("");

    const handleSearchSubmit = (e)=>{
        e.preventDefault();
        console.log(keyword);
        if(keyword.trim()){
            navigate(`/products/${keyword}`);
        }
        else{
            navigate("/products");
        }
    }

    return(
        <Fragment>
             <MetaData title="Search a Product -- Ecommerce"/>
            <form onSubmit={handleSearchSubmit} className="searchBox">
                <input type="text" onChange={ (e)=>{ setKeyword(e.target.value)}} value={keyword} name="search" placeholder="Search a Product..."/>
                <button> Search</button>
            </form>
        </Fragment>
    )
}