import { Typography } from "@mui/material";
import { DataGrid, renderActionsCell } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Sidebar from "./Sidebar.jsx";
import { Fragment, useEffect} from "react";
import MetaData from "../layout/MetaData.jsx";
import { deleteUser, getAllUsers, clearIsDeleted, clearMessage, clearError } from "../../features/Slices/UserSlice.jsx";
import { useDispatch, useSelector} from "react-redux";
import { useAlert} from "react-alert";
import { Link} from "react-router-dom";
import "./UserList.css";
import {Button} from "@mui/material";

export default function ProductList(){

    const dispatch = useDispatch();
    const { users, isDeleted, error, loading, message} = useSelector( state => state.user);
    const alert = useAlert()

    const columns = [
        { field: "id", headerName: "User ID", flex:4},
        { field: "email", headerName:"Email", flex:3},
        { field:"name", headerName: "Name", flex:2},
        { field:"role", headerName:"Role", flex:2, cellClassName:(params)=>{
            return (params.row.role==="user") ? "redColor" : "greenColor"; 
        }},
        { field:"actions", headerName:"Actions", flex:2, renderCell: ( params)=>{
            return(
                <div className="renderCellEditDelete">
                    <Link to={`/admin/user/${params.row.id}`}>
                        <EditIcon/> 
                    </Link>
                    <Button onClick={ ()=>{ dispatch( deleteUser( params.row.id))}}>
                        <DeleteIcon/>
                    </Button>
                </div>
            )
        }},
    ]
    const rows = users ? users.map( ( user, idx)=>{
        return { id: user._id, email: user.email, name: user.name, role: user.role }
    }) : [] ;


    useEffect(()=>{

        dispatch( getAllUsers());
        
        if(error){
            alert.error(error);
            dispatch( clearError());
        }

        if(isDeleted){
            alert.success(message);
            dispatch( getAllUsers());
            setTimeout(()=>{
                dispatch(clearMessage());
                dispatch(clearIsDeleted());
            },5000);
        }
    },[error, isDeleted, message]);

    return(
        <Fragment>
            <div className="dashboard">
                <MetaData title="dashboard - users"/>
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