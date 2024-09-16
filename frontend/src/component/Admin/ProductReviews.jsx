import "./ProductReviews.css";
import { Fragment, useState, useEffect} from "react";
import StarIcon from '@mui/icons-material/Star';
import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader/Loader";
import { Typography } from "@mui/material";
import { useSelector, useDispatch} from "react-redux";
import Sidebar from "./Sidebar.jsx";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid } from "@mui/x-data-grid";
import { useAlert } from "react-alert";
import { getAllReviews, deleteReview, clearError, clearIsReviewDeleted} from "../../features/Slices/productSlice.jsx";
import { Button} from "@mui/material";

export default function ProductReviews(){

    const { loading, reviews, error, isReviewDeleted } = useSelector( state=>state.products);
    const alert = useAlert(); 
    const dispatch = useDispatch(); 
    
    const [ productId, setProductId] = useState("");

    useEffect(()=>{
       
        if(error){
            alert.error(error);
            dispatch( clearError());
        }

        if(isReviewDeleted){
            alert.success("Review Deleted Successfully");
            dispatch( getAllReviews( productId));
            dispatch( clearIsReviewDeleted());
        }

    }, [ error, isReviewDeleted]);

    const columns = [
        { field: "id", headerName: "Review ID", flex:4},
        { field: "name", headerName:"User", flex:3},
        { field:"comment", headerName: "Comment", flex:2},
        { field:"rating", headerName:"Rating", flex:2, cellClassName:(params)=>{
            return (params.row.rating<3) ? "redColor" : "greenColor"; 
        }},
        { field:"actions", headerName:"Actions", flex:2, renderCell: ( params)=>{
            return(
                <div className="renderCellEditDelete">
                    <Button onClick={ ()=>{ dispatch( deleteReview({ productId: productId, reviewId: params.row.id}))}}>
                        <DeleteIcon/>
                    </Button>
                </div>
            )
        }},
    ]
    const rows = reviews ? reviews.map( ( review, idx)=>{
        return { id: review._id, name: review.name, comment: review.comment, rating: review.rating }
    }) : [] ;

    const handleSubmitButton = (e) =>{
        e.preventDefault();
        dispatch( getAllReviews( productId));

    }

    return(
        <Fragment>
            {
                loading ?
                <Loader/>:
                (
            <div className="dashboard">
                <MetaData title="dashboard - All Reviews - Admin"/>
                <div className="leftSide">
                    <Sidebar />
                </div>
                <div className="rightSide">
                    <div className="ReviewContainer">
                    <Typography>ALL Reviews</Typography>

                        <div className="box111">
                            <form  className="productIdForm" >
                                <div className="productId">
                                  <StarIcon/>
                                  <input type="text" value={ productId} placeholder="Enter Product ID" onChange={(e)=>{setProductId( e.target.value)} } />
                                </div>
                                <button onClick={ handleSubmitButton }>Find</button>
                            </form>
                        </div>

                        <div className="box222">
                            {
                                reviews.length<1
                                ?
                                <Typography>No Reviews Exists</Typography>
                                :
                                <DataGrid 
                                    rows={rows}
                                    columns={columns}
                                    initialState={{
                                        pagination: {
                                            paginationModel:{
                                                pageSize: 10
                                            }
                                        }
                                    }}
                                    className="productListTable"
                                    disableRowSelectionOnClick
                                />

                            } 
                        </div>
                    </div>
                </div>
            </div>
                )
            }
        </Fragment>
    )
}