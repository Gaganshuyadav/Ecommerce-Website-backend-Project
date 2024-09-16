import { createSlice, createAsyncThunk, isRejectedWithValue, isRejected} from "@reduxjs/toolkit";
import axios from "axios";

//add new review by User
export const newReview = createAsyncThunk("review/new", async ( newReviewData, { rejectWithValue})=>{
    try{
        const token = localStorage.getItem("token");
        const { data} = await axios.put("http://localhost:3000/api/v1/review", newReviewData, { headers: { "Content-Type": "application/json", "Authorization":`Bearer ${token}`}});
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

//Get All Products by Admin
export const getAdminProduct =  createAsyncThunk("/admin/allProduct", async (noParam, { rejectWithValue})=>{
    const token = localStorage.getItem("token");
    try{
        const { data} = await axios.get("http://localhost:3000/api/v1/admin/products", { headers: { "Content-Type":"application/json", "Authorization": `Bearer ${token}`}});
        return data
    }
    catch(error){
        if(error.response){
            return rejectWithValue({message: error.response.data.message});
        }
        else{
            return rejectWithValue({message: error.message});
        }
    }
})

//Add New Product by Admin
export const createProduct = createAsyncThunk("/admin/newProduct", async( newProductFormData, { rejectWithValue})=>{
    const token = localStorage.getItem("token");
   
    try{
        const { data} = await axios.post("http://localhost:3000/api/v1/admin/products/new", newProductFormData, { headers: { "Content-Type":"multipart/form-data", "Authorization": `Bearer ${token}`}});
        console.log(data)
        return data;
    }
    catch(error){
        if(error.response){
            console.log(error)
            return rejectWithValue( { message: error.response.data.message});
        }
        else{
            console.log(error)
            return rejectWithValue({ message: error.message});
        }
    }
    
})

//Delete Product by Admin
export const deleteProduct  = createAsyncThunk("/admin/deleteProduct", async( id, { rejectWithValue})=>{
    let token  = localStorage.getItem("token");
    try{
        const { data} = await axios.delete(`http://localhost:3000/api/v1/admin/products/${id}`, {headers: { "Content-Type":"application/json", "Authorization":`Bearer ${token}`}});
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

//Update Product by Admin
export const updateProduct = createAsyncThunk("/admin/updateProduct", async( { id, formData}, { rejectWithValue})=>{
    const token = localStorage.getItem("token");
    try{
        const { data} = await axios.put(`http://localhost:3000/api/v1/admin/products/${id}`, formData, { headers: { "Content-Type":"multipart/form-data", "Authorization":`Bearer ${token}`}});
        return data;
    }
    catch(error){
        if(error.response){
            return rejectWithValue({message:error.response.data.message});
        }
        else{
            return rejectWithValue({message: error.message});
        }
    }
})

//get Product Details for updation By Admin( this is second time but new way)
export const getProductDetailsForUpdation = createAsyncThunk("/admin/getDetailsForUpdation", async( id, { rejectWithValue})=>{
    const token = localStorage.getItem("token");
    try{
        const { data} = await axios.get(`http://localhost:3000/api/v1/products/${id}` , { headers: { "Content-Type":"application/json", "Authorization":`Bearer ${token}`}});
        return data;
    }
    catch(error){
        if(error.response){
            return rejectWithValue({message:error.response.data.message});
        }
        else{
            return rejectWithValue({message: error.message});
        }
    }
})

//Get All Reviews of a Product
export const getAllReviews = createAsyncThunk("/admin/review/all" , async( productId, { rejectWithValue})=>{
    const token = localStorage.getItem("token");
    try{
        const { data} = await axios.get(`http://localhost:3000/api/v1/reviews?productId=${productId}`, { headers: { "Content-Type":"application/json", "Authorization":`Bearer ${token}`}});
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

// Delete Review of a Product
export const deleteReview = createAsyncThunk("/admin/review/delete", async( { productId, reviewId }, { rejectWithValue})=>{
    const token = localStorage.getItem("token");
    try{
        const { data} = await axios.delete(`http://localhost:3000/api/v1/reviews?productId=${productId}&reviewId=${reviewId}`, { headers: {"Content-Type":"application/json", "Authorization":`Bearer ${token}`}});
        return data;
    }
    catch(error){
        if(error.response){
            return rejectWithValue({message: error.response.data.message});
        }
        else{
            return rejectWithValue({message: error.response});
        }
    }
})

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
        success:false,
        message:"",
        isDeleted: false,
        isUpdated: false,
        reviews:[],
        isReviewDeleted:false,
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
        }, 
        clearError: ( state, action)=>{
            state.error = "";
        },
        clearMessage: ( state, action)=>{
            state.message = "";
            state.isUpdated = false;
            state.isDeleted = false;
        },
        clearSuccess: ( state, action)=>{
            state.success = false;
        },
        clearIsReviewDeleted: ( state, action)=>{
            state.isReviewDeleted = false;
        },
    },
    extraReducers: (builder)=>{
        //add new review
        builder.addCase( newReview.pending, ( state, action)=>{
            state.loading = true;
            state.error = "";
            state.success = false;//success is important part to load the updated details after submitting the new review
        }),
        builder.addCase( newReview.fulfilled, ( state, action)=>{
            state.loading = false;
            state.success = action.payload.success;
            state.message = "Review Added Successfully";
        }),
        builder.addCase( newReview.rejected, ( state, action)=>{
            state.loading = false;
            state.error = action.payload.message;
        }),
        builder.addCase( getAdminProduct.pending , ( state, action)=>{
            state.loading = true;
            state.error = "";
        }),
        builder.addCase( getAdminProduct.fulfilled, ( state, action)=>{
            state.products = action.payload.products;
            state.loading = false;
        }),
        builder.addCase( getAdminProduct.rejected, ( state, action)=>{
            state.error = action.payload.message;
            state.loading = false;
        }),
        builder.addCase( createProduct.pending , ( state, action)=>{
            state.error = "";
            state.loading = true;
            state.success = false;
        }),
        builder.addCase( createProduct.fulfilled, ( state, action)=>{
            state.product  =  action.payload.product;
            state.loading = false;
            state.success = action.payload.success;
        }),
        builder.addCase( createProduct.rejected, ( state, action)=>{
            state.loading = false;
            state.error = action.payload.message;
        }),
        builder.addCase( deleteProduct.pending, ( state, action)=>{
            state.loading = true;
            state.error = "";
            state.isDeleted = false; 
            state.message = "";
        }),
        builder.addCase( deleteProduct.fulfilled, ( state, action)=>{
            state.isDeleted = true;
            state.loading = false;
            state.message = action.payload.message
        }),
        builder.addCase( deleteProduct.rejected, ( state, action)=>{
            state.error = action.payload.message;
            state.loading = false;

        }),
        builder.addCase( updateProduct.pending, ( state, action)=>{
            state.error = "";
            state.loading = true;
            state.message = "";
        }),
        builder.addCase( updateProduct.fulfilled, ( state, action)=>{
            state.loading = false;
            state.message = "Product Updated Successfully";
            state.isUpdated = true;
        }),
        builder.addCase( updateProduct.rejected, ( state, action)=>{
            state.error = action.payload.message;
            state.loading =  false;
        }),
        builder.addCase( getProductDetailsForUpdation.pending, ( state, action)=>{
            state.error = "";
            state.loading = true;
        }),
        builder.addCase( getProductDetailsForUpdation.fulfilled, ( state, action)=>{
            state.loading = false;
            state.product = action.payload.product ? action.payload.product : "";
        }),
        builder.addCase( getProductDetailsForUpdation.rejected, ( state, action)=>{
            state.error = action.payload.message;
            state.loading =  false;
        }),
        builder.addCase( getAllReviews.pending, ( state, action)=>{
            state.error = "";
            state.loading = true;
        }),
        builder.addCase( getAllReviews.fulfilled, ( state, action)=>{
            state.loading = false;
            state.reviews = action.payload.reviews;
        }),
        builder.addCase( getAllReviews.rejected, ( state, action)=>{
            state.error = action.payload.message;
            state.loading = false;
        }),
        builder.addCase( deleteReview.pending, ( state, action)=>{
            state.error = "";
            state.loading = true;
        }),
        builder.addCase( deleteReview.fulfilled, ( state, action)=>{
            state.loading = false;
            state.isReviewDeleted = action.payload.success;
        }),
        builder.addCase( deleteReview.rejected, ( state, action)=>{
            state.error = action.payload.message;
            state.loading = false;
        })
    }
})

export const { getProduct, getProductDetails, clearError, clearMessage, clearSuccess, clearIsReviewDeleted} = productSlice.actions;
export default productSlice.reducer;