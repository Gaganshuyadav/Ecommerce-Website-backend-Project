import { Typography } from "@mui/material";
import { DataGrid, renderActionsCell } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Sidebar from "./Sidebar.jsx";
import { Fragment, useEffect} from "react";
import MetaData from "../layout/MetaData.jsx";
import { getAllOrders, clearError, clearIsDeleted, deleteOrder} from "../../features/Slices/OrderSlice.jsx";
import { useDispatch, useSelector} from "react-redux";
import { useAlert} from "react-alert";
import { Link} from "react-router-dom";
import "./OrderList.css";
import {Button} from "@mui/material";

export default function OrderList(){

    const dispatch = useDispatch();
    const { error, loading, orders, isDeleted} = useSelector(state=>state.order);
    const alert = useAlert()

    // load details
    useEffect(()=>{

        dispatch( getAllOrders());

        if(isDeleted){
            alert.success("product deleted successfully");
            //this is for if the user coming from another page to this page then isDeleted is true and it can show this message , so i do this ,so that this message is deleted after 5 seconds
            setTimeout(()=>{
                dispatch(clearIsDeleted());
            },10000);
        }

        if(error){
            alert.error(error);
            dispatch( clearError());
        }

    }, [ isDeleted, error]);

    const columns = [
        { field: "id", headerName: "Order ID", flex:4},
        { field: "status", headerName:"Status", flex:3},
        { field:"quantity", headerName: "Items Qty", flex:2},
        { field:"amount", headerName:"Amount", flex:2},
        { field:"actions", headerName:"Actions", flex:2, renderCell: ( params)=>{
            return(
                <div className="renderCellEditDelete">
                    <Link to={`/admin/order/${params.row.id}`}>
                        <EditIcon/> 
                    </Link>
                    <Button onClick={ ()=>{ dispatch( deleteOrder( params.row.id))}}>
                        <DeleteIcon/>
                    </Button>
                </div>
            )
        }},
    ]
    
    const rows = orders ? orders.map((order)=>{
        return { id: order._id, status: order.orderStatus, quantity: order.orderItems.length, amount: order.totalPrice};
    }): [];

   

    return(
        <Fragment>
            <div className="dashboard">
                <MetaData title="dashboard - products"/>
                <div className="leftSide">
                    <Sidebar />
                </div>
                <div className="rightSide">
                    <div  className="orderListContainer">
                        <Typography>ALL ORDERS</Typography>
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
                            className="orderListTable"
                            disableRowSelectionOnClick
                        /> 
                    </div>
                </div>
            </div>
        </Fragment>
        
    )
}
