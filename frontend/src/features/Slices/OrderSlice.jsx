import { createSlice, createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";
import axios from "axios";
import { FaTruckMedical } from "react-icons/fa6";

//create new Order by user
export const createOrder = createAsyncThunk("order/create", async( orderData, { rejectWithValue})=>{
    try{
        console.log(orderData)
        const token = localStorage.getItem("token");
        const { data} = await axios.post("http://localhost:3000/api/v1/order/new", orderData, { headers: { "Content-Type": "application/json", "Authorization":`Bearer ${token}`}});
        console.log(data)
        return data;
        
    }
    catch(error){
        if(error.response){
            console.log(error);
            return rejectWithValue( { message: error.response.data.message});
            
        }
        else{
            console.log(error);
            return rejectWithValue( { message: error.message});
            
        }
    }

})

//My Orders use the token for logged user id( req._id) to find orders
export const myOrders = createAsyncThunk("order/myAllOrders", async( noPara, { rejectWithValue})=>{
    try{
        const token = localStorage.getItem("token");
        const { data} = await axios.get("http://localhost:3000/api/v1/orders/me", { headers: { "Content-Type":"application/json", "Authorization": `Bearer ${token}`}})
        return data;
    }
    catch(error){
        if(error.response){
            return rejectWithValue( { message: error.response.data.message});
        }
        else{
            return rejectWithValue( { message: error.message});
        }
    }
})

//Get Order Details
export const getOrderDetails = createAsyncThunk("order/orderDetails", async ( id, { rejectWithValue})=>{
    try{
        const token = localStorage.getItem("token");
        const { data} = await axios.get(`http://localhost:3000/api/v1/order/${id}`, { headers: { "Content-Type":"application/json", "Authorization":`Bearer ${token}`}});
        return data;
    }
    catch(error){
        if(error.response){
            return rejectWithValue({message:error.response.data.message});
        }
        else{
            return rejectWithValue({message:error.message});
        }
    }

})

//Get all orders By Admin
export const getAllOrders = createAsyncThunk("admin/getAllOrders", async( noParam, { rejectWithValue})=>{
    const token = localStorage.getItem("token");
    try{
        const { data} = await axios.get("http://localhost:3000/api/v1/admin/orders", { headers: { "Content-Type":"application/json", "Authorization":`Bearer ${token}`}});
        return data;
    }
    catch(error){
        if(error.response){
            return rejectWithValue({ message: error.response.data.message});
        }
        else{
            return rejectWithValue({ message: error.message});
        }
    }
})

//update order status by admin
export const updateOrder = createAsyncThunk("admin/updateOrder", async( { id, formData }, { rejectWithValue})=>{
    const token = localStorage.getItem("token");
    try{
        const { data} = await axios.put(`http://localhost:3000/api/v1/order/${id}`, formData, { headers:{ "Content-Type":"application/json", "Authorization":`Bearer ${token}`}});
        return data;
    }
    catch(error){
        if(error.response){
            return rejectWithValue({ message: error.response.data.message});
        }
        else{
            return rejectWithValue({ message: error.message});
        }
    }
})

//delete order by Admin
export const deleteOrder = createAsyncThunk("admin/deleteOrder", async( id, { rejectWithValue})=>{
    try{
        const token = localStorage.getItem("token");
        const { data} = await axios.delete(`http://localhost:3000/api/v1/admin/order/${id}`, { headers: { "Content-Type":"application/json", "Authorization":`Bearer ${token}`}});
        return data;
    }
    catch(error){
        if(error.response){
            return rejectWithValue( { message: error.response.data.message});
        }
        else{
            return rejectWithValue( { message: error.message});
        }
    }
    
})

//( orderSlice)
export const orderSlice = createSlice({
    name: "order",
    initialState: {
        order: {},
        orders: [],
        totalAmount:0,
        loading: false,
        error:"",
        isUpdated:  false,
        isDeleted: false,
    },
    reducers:{
        clearError: ( state, action)=>{
            state.error = "";
        },
        clearIsUpdated: ( state, action)=>{
            state.isUpdated = false;
        },
        clearIsDeleted: ( state, action)=>{
            state.isDeleted = false;
        },
    },
    extraReducers: ( builder)=>{
         //createOrder
         builder.addCase( createOrder.pending, ( state, action)=>{
            state.loading = true;
            state.error = "";
        }),
        builder.addCase( createOrder.fulfilled, ( state, action)=>{
            state.order = action.payload.order;
            state.loading = false;
        }),
        builder.addCase( createOrder.rejected, ( state, action)=>{
            state.error = action.payload.message;
            state.loading = false;
        }),
        builder.addCase( myOrders.pending, ( state, action)=>{
            state.error = "";
            state.loading = true;
        }),
        builder.addCase( myOrders.fulfilled, ( state, action)=>{
            state.loading = false;
            state.orders = action.payload.orders;
        }),
        builder.addCase( myOrders.rejected, ( state, action)=>{
            state.loading = false;
            state.error = action.payload.message;
        }),
        builder.addCase( getOrderDetails.pending, ( state, action)=>{
            state.loading = true;
            state.error = "";
            state.order = {};
        }),
        builder.addCase( getOrderDetails.fulfilled, ( state, action)=>{
            state.loading = false;
            state.order = action.payload.order;
        }),
        builder.addCase( getOrderDetails.rejected, ( state, action)=>{
            state.loading = false;
            state.error = action.payload.message;
        }),
        builder.addCase( getAllOrders.pending, ( state, action)=>{
            state.loading = true;
            state.error = "";
        }),
        builder.addCase( getAllOrders.fulfilled, ( state, action)=>{
            state.loading = false;
            state.orders = action.payload.orders;
            state.totalAmount = action.payload.totalAmount;
        }),
        builder.addCase( getAllOrders.rejected, ( state, action)=>{
            state.loading = false;
            state.error = action.payload.error;
        }),
        builder.addCase( updateOrder.pending, ( state, action)=>{
            state.error = "";
            state.loading = true;
        }),
        builder.addCase( updateOrder.fulfilled, ( state, action)=>{
            state.loading = false;
            state.isUpdated = action.payload.success;
        }),
        builder.addCase( updateOrder.rejected, ( state, action)=>{
            state.loading = false;
            state.error = action.payload.message; 
        }),
        builder.addCase( deleteOrder.pending, ( state, action)=>{
            state.loading = false;
            state.error = "";
        }),
        builder.addCase( deleteOrder.fulfilled , ( state, action)=>{
            state.loading = false;
            state.isDeleted = action.payload.success;
        }),
        builder.addCase( deleteOrder.rejected, ( state, action)=>{
            state.loading = false;
            state.error = action.payload.message;
        })

    },

})

export const { clearError, clearIsDeleted, clearIsUpdated} = orderSlice.actions;

export default orderSlice.reducer;




