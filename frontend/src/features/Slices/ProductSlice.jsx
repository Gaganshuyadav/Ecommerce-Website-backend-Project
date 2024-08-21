import { createSlice} from "@reduxjs/toolkit";
import axios from "axios";

export const productSlice = createSlice({
    name: "products",
    initialState: {
        loading: false,
        products: [],
        productsCount: 0,
        error:"",
        product: "",
        resultPerPage: 0,
        filteredProductsCount: 0,
    },
    reducers: {
        getProduct: ( state, action)=>{
            if(action.payload.error){
                state.error = action.payload.error;
            }
                state.loading = action.payload.loading;
                state.products = action.payload.products;
                state.productsCount = action.payload.productCount;
                state.resultPerPage = action.payload.resultPerPage;
                state.filteredProductsCount = action.payload.filteredProductsCount;
        },
        getProductDetails: ( state, action)=>{
            if(action.payload.error){
                state.error = action.payload.error;
            }
                state.product = action.payload.product;
                state.loading = action.payload.loading;
        }
    }
})

export const { getProduct, getProductDetails} = productSlice.actions;
export default productSlice.reducer;