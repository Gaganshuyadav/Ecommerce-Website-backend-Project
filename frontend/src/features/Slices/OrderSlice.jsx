import { createSlice, createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";
import axios from "axios";

//create new Order
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

//My Orders
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

//( orderSlice)
export const orderSlice = createSlice({
    name: "order",
    initialState: {
        order: {},
        orders: [],
        totalAmount:0,
        loading: false,
        error:"",
    },
    reducers:{
        clearError: ( state, action)=>{
            state.error = "";
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
        })
    },

})

export const { clearError} = orderSlice.actions;

export default orderSlice.reducer;




