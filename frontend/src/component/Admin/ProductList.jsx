import { Typography } from "@mui/material";
import { DataGrid, renderActionsCell } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Sidebar from "./Sidebar.jsx";
import { Fragment, useEffect} from "react";
import MetaData from "../layout/MetaData.jsx";
import { getAdminProduct, clearError, clearMessage, deleteProduct} from "../../features/Slices/ProductSlice.jsx";
import { useDispatch, useSelector} from "react-redux";
import { useAlert} from "react-alert";
import { Link} from "react-router-dom";
import "./ProductList.css";
import {Button} from "@mui/material";

export default function ProductList(){

    const dispatch = useDispatch();
    const { products, error, loading, message, isDeleted} = useSelector( state => state.products);
    const alert = useAlert()

    const columns = [
        { field: "id", headerName: "Product ID", flex:4},
        { field: "name", headerName:"Name", flex:3},
        { field:"stock", headerName: "Stock", flex:2},
        { field:"price", headerName:"Price", flex:2},
        { field:"actions", headerName:"Actions", flex:2, renderCell: ( params)=>{
            return(
                <div className="renderCellEditDelete">
                    <Link to={`/admin/product/${params.row.id}`}>
                        <EditIcon/> 
                    </Link>
                    <Button onClick={ ()=>{ dispatch( deleteProduct( params.row.id))}}>
                        <DeleteIcon/>
                    </Button>
                </div>
            )
        }},
    ]
    const rows = products ? products.map( (product, idx)=>{
        return { id: product._id, name: product.name, stock: product.Stock, price: product.price }
    }) : [] ;


    useEffect(()=>{

        dispatch( getAdminProduct());
        
        if(error){
            alert.error(error);
            dispatch( clearError());
        }
        if(isDeleted){
            alert.success(message);
            setTimeout(()=>{
                dispatch(clearMessage());
            }, 10000);
        }

    },[error, isDeleted]);

    
    return(
        <Fragment>
            <div className="dashboard">
                <MetaData title="dashboard - products"/>
                <div className="leftSide">
                    <Sidebar />
                </div>
                <div className="rightSide">
                    <div  className="productListContainer">
                        <Typography>ALL PRODUCTS</Typography>
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
                    </div>
                </div>
            </div>
        </Fragment>
        
    )
}