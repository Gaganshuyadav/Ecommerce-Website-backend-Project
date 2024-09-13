import { Fragment, useEffect} from "react";
import { DataGrid} from "@mui/x-data-grid";
import LaunchIcon from '@mui/icons-material/Launch';
import { useDispatch, useSelector} from "react-redux";
import {  Link} from "react-router-dom";
import { myOrders, clearError} from "../../features/Slices/OrderSlice";
import { useAlert } from "react-alert"; 
import Loader from "../layout/Loader/Loader";
import "./MyOrders.css";
import { Typography } from "@mui/material";

export default function MyOrders(){

    const alert = useAlert();
    const dispatch = useDispatch();
    const { user} = useSelector(state=>state.user); 
    const { orders, error, loading} = useSelector(state=>state.order);

    const columns = [
        { field: "id", headerName: "Order ID", width:400, flex:4},
        { field: "status", 
            headerName: "Status", 
            width:300,flex:4, 
            cellClassName: (params)=>{
                return params.row.status==="Processing"? "ProcessRed" : "DeliverGreen"
            }
        },
        { field: "itemsQty", headerName: "Items Qty", width:150,flex:2},
        { field: "amount", headerName: "Amount", width:150,flex:2, font:"red"},
        { field: "actions", 
            headerName: "Actions", 
            width:90,
            flex:1, 
            sortable:false, 
            renderCell: (params)=>{
            return <Link to={`/order/details/${params.row.id}`}>
                <LaunchIcon/>
            </Link>
        }
    },]

    const rows = orders 
    ? (orders.map( (item, idx)=>{
        return { id: item._id, status: item.orderStatus, itemsQty: item.orderItems.length, amount: item.totalPrice }
    }) ) 
    : [];

    useEffect(()=>{

        //load all my orders
        dispatch(myOrders());

        if(error){
            alert.error(error);
            dispatch(clearError());
        }

    },[error]);

    return(
        <Fragment>
            {
            loading
            ?
            <Loader/>
            :
            <div className="myOrdersPage">
              <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                  pagination: {
                      paginationModel:{
                          pageSize: 10
                      },
                  },
                }}
                className="myOrdersTable MuiDataGrid-columnHeader"
                disableRowSelectionOnClick
              />
              <Typography>{user.name}'s Orders</Typography>
            </div>
            }
        </Fragment>
    )
}