import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//config

// (actions):-

//login
export const login = createAsyncThunk("user/login", async ( userData, { rejectWithValue})=>{
        // console.log(thunkAPI);
        try{
            const { data} = await axios.post("http://localhost:3000/api/v1/login",{ email: userData.email ,password: userData.password },{ headers: { "Content-Type":"application/json"}});
            localStorage.setItem("token", data.token);
            return data;
        }
        catch(err){
            if(err.response){
                return rejectWithValue({ message: err.response.data.message});
            }
            else{
                return rejectWithValue( { message: err.message });
            }

        }
})

//register
export const register = createAsyncThunk("user/register", async ( formData, { rejectWithValue})=>{

    try{
        const { data}  = await axios.post("http://localhost:3000/api/v1/register", formData, { headers: { "Content-Type":"multipart/form-data"}});
        localStorage.setItem("token", data.token);
        return data;
    }
    catch(err){
        if(err.response){
            return rejectWithValue({ message: err.response.data.message});
        }
        else{
            return rejectWithValue( { message: err.message });
        }
    }
    
}) 

//loadUser
export const loadUser = createAsyncThunk("user/me", async ( noPara , { rejectWithValue})=>{
    try{
        const token = localStorage.getItem("token");
        const { data} = await axios.get("http://localhost:3000/api/v1/me",{ headers: { 'Authorization': `Bearer ${token}`}});
        return data;
    }   
    catch(err){
        console.log(err);
        if(err.response){
            return rejectWithValue({ message: err.response.data.message});
        }
        else{
            return rejectWithValue({  message: err.message});
        }
    }
    
})

// logout
export const logout = createAsyncThunk( "user/logout", async ( noPara, { rejectWithValue})=>{
    try{
        const { data} = await axios.get("http://localhost:3000/api/v1/logout");
        localStorage.setItem("token",null);
        return data;
    }
    catch(err){
        if(err.response){
            return rejectWithValue({ message: err.response.data.message});
        }
        else{
            return rejectWithValue({ message: err.message});
        }
    }
})

// Update Profile
export const updateProfile = createAsyncThunk( "user/updateProfile", async( formData, { rejectWithValue})=>{
    try{
        const token = localStorage.getItem("token");
        const { data} = await axios.put("http://localhost:3000/api/v1/me/update", formData, { headers: { "Content-Type":"multipart/form-data","Authorization":`Bearer ${token}`}});
        return data;
    }
    catch(err){
        if(err.response){
            return rejectWithValue({ message: err.response.data.message});
        }
        else{
            return rejectWithValue({ message: err.message});
        }
    }
})

// Update Password 
export const updatePassword = createAsyncThunk( "user/updatePassword" , async( formData, { rejectWithValue})=>{
    try{
        const token = localStorage.getItem("token");
        const { data} = await axios.put( "http://localhost:3000/api/v1/password/update", formData, { headers: { "Content-Type": "application/json","Authorization":`Bearer ${token}`}});
        return data;
    }
    catch(err){
        if(err.response){
            return rejectWithValue({ message: err.response.data.message});
        }
        else{
            return rejectWithValue({ message: err.message});
        }
    }
})

// Forgot Password
export const forgotPassword = createAsyncThunk( "user/forgotPassword", async( formData, { rejectWithValue})=>{
    try{
        const { data} = await axios.post("http://localhost:3000/api/v1/password/forgot", formData, { headers: { "Content-Type": "application/json"}});
        return data;
    }
    catch(err){
        if(err.response){
            return rejectWithValue({ message: err.response.data.message});
        }
        else{
            return rejectWithValue({ message: err.message});
        }
    }
})

//Reset Password
export const resetPassword = createAsyncThunk( "user/resetPassword", async( { myForm, token} ,{ rejectWithValue})=>{

    try{
        const { data} = await axios.post(`http://localhost:3000/api/v1/password/reset/${token}`, myForm, { headers: { "Content-Type": "application/json" }});
        return data;
    }
    catch(err){
        if(err.response){
            return rejectWithValue({ message: err.response.data.message});
        }
        else{
            return rejectWithValue({ message: err.message});
        }
    }
})

// get All users --Admin
export const getAllUsers = createAsyncThunk( "admin/users", async( noParam, { rejectWithValue})=>{
    const token = localStorage.getItem("token");
    try{
        const { data} = await axios.get("http://localhost:3000/api/v1/admin/users", { headers: { "Content-Type":"application/json", "Authorization":`Bearer ${token}`}});
        return data;
    }
    catch(error){
        if( error.response){
            return rejectWithValue({message: error.response.data.message});
        }
        else{
            return rejectWithValue({message: error.message});
        }
    }
})

// get user Details --Admin
export const getUserDetails = createAsyncThunk( "admin/user/:id", async( id, { rejectWithValue})=>{
    const token =  localStorage.getItem("token");
    try{
        const { data} = await axios.get(`http://localhost:3000/api/v1/admin/user/${id}`, { headers: {"Content-Type":"application/json", "Authorization":`Bearer ${token}`}});
        return data;
    }
    catch(error){
        if(error.response){
            return rejectWithValue({message: error.response.data.message});
        }
        else{
            return rejectWithValue({message:error.message});
        }
    }
})

// update user --Admin
export const updateUser = createAsyncThunk( "admin/user/update", async( { id, formData}, { rejectWithValue})=>{
    const token = localStorage.getItem("token");
    try{
        const { data} = await axios.put(`http://localhost:3000/api/v1/admin/user/${id}`, formData, { headers: { "Content-Type":"application/json", "Authorization":`Bearer ${token}`}});
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

// delete user --Admin
export const deleteUser = createAsyncThunk( "admin/user/delete", async( id, { rejectWithValue})=>{
    const token = localStorage.getItem("token");
    try{
        const { data} = await axios.delete(`http://localhost:3000/api/v1/admin/user/${id}`, { headers: { "Content-Type":"application/json", "Authorization":`Bearer ${token}`}});
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




// (userSlice):-
export const userSlice = createSlice({
    name:"user",
    initialState: {
        user: null,
        isAuthenticated:false,
        loading: false,
        error:"",
        message:"",
        isUpdated:false,
        success: false,
        users:[],
        isDeleted:false,
    },
    reducers:{
        clearError: ( state, action)=>{
            state.error = "";
        },
        clearUpdate: ( state, action)=>{
            state.isUpdated = false;
        },
        clearIsDeleted: ( state, action)=>{
            state.isDeleted = false;
        },
        clearMessage: ( state, action)=>{
            state.message = "";
        }
    },
    extraReducers: ( builder)=>{
        //login
        builder.addCase( login.pending, (state,action)=>{
            state.loading = true;
            state.error = "";                  // needed to show the error in each request
        }),
        builder.addCase( login.fulfilled, ( state, action)=>{
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.error = "";
        }),
        builder.addCase( login.rejected, ( state, action)=>{
            state.loading = false;
            state.error = action.payload.message;
        }),
        //register
        builder.addCase( register.pending, ( state, action)=>{
            state.loading = true;
            state.error = "";
        }),
        builder.addCase( register.fulfilled, ( state, action)=>{
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.error = "";
        }),
        builder.addCase( register.rejected, ( state, action)=>{
            state.loading = false;
            state.error = action.payload.message;
        }),
        //loadUser
        builder.addCase( loadUser.pending, ( state,action)=>{
            state.error = "";
        }),
        builder.addCase( loadUser.fulfilled, ( state, action)=>{
            state.user = action.payload.user;
            state.isAuthenticated = true;
            state.error = "";
        }),
        builder.addCase( loadUser.rejected, ( state, action)=>{
            state.error = action.payload.message;             //user loaded at starting
        }),
        //logout
        builder.addCase( logout.pending, (state, action)=>{
            state.loading = true;
            state.error = "";
        }),
        builder.addCase( logout.fulfilled, ( state, action)=>{
            state.loading = false;
            state.isAuthenticated = false;
            state.user = "";
            state.message = action.payload.message;
        }),
        builder.addCase( logout.rejected, ( state, action)=>{
            state.error = action.payload.message;              
            state.loading = false;
        }),
        //updateProfile
        builder.addCase( updateProfile.pending, (state,action)=>{
            state.loading = true;
            state.error = "";
        }),
        builder.addCase( updateProfile.fulfilled, (state,action)=>{
            state.loading = false;
            state.isUpdated = true;
            state.user = action.payload.user;
        }),
        builder.addCase( updateProfile.rejected, (state,action)=>{
            state.loading = false;
            state.error = action.payload.message;
        }),
        //updatePassword
        builder.addCase( updatePassword.pending, ( state,action)=>{
            state.loading = true;
            state.error = "";
        }),
        builder.addCase( updatePassword.fulfilled, ( state, action)=>{
            state.loading = false;
            state.user = action.payload.user;
            state.isUpdated = true;
        }),
        builder.addCase( updatePassword.rejected, ( state, action)=>{
            state.loading = false;
            state.error = action.payload.message;
        }),
        //forgotPassword
        builder.addCase( forgotPassword.pending, (state,action)=>{
            state.loading = true;
            state.error = "";
            state.message = "";
        }),
        builder.addCase( forgotPassword.fulfilled, ( state, action)=>{
            state.loading = false;
            state.message = action.payload.message;
        }),
        builder.addCase( forgotPassword.rejected, ( state, action)=>{
            state.loading = false;
            state.error = action.payload.message;
        }),
        //resetPassword
        builder.addCase( resetPassword.pending, ( state, action)=>{
            state.loading = true;
            state.error = "";
            state.success = false;
        }),
        builder.addCase( resetPassword.fulfilled, ( state,action)=>{
            state.loading = false;
            state.success = action.payload.success;
        }),
        builder.addCase( resetPassword.rejected, ( state, action)=>{
            state.loading = false;
            state.error = action.payload.message;
        }),
        //all users --Admin
        builder.addCase( getAllUsers.pending, ( state, action)=>{
            state.error = "";
            state.loading = true;
        }),
        builder.addCase( getAllUsers.fulfilled, ( state, action)=>{
            state.users = action.payload.users;
            state.loading = false;
        }),
        builder.addCase( getAllUsers.rejected, ( state, action)=>{
            state.error = action.payload.message;
            state.loading = false;
        }),
        // user details
        builder.addCase( getUserDetails.pending, ( state, action)=>{
            state.error = "";
            state.loading = true;
        }),
        builder.addCase( getUserDetails.fulfilled, ( state, action)=>{
            state.user = action.payload.user;
            state.loading = false;
        }),
        builder.addCase( getUserDetails.rejected, ( state, action)=>{
            state.error = action.payload.message;
            state.loading = false;
        }),
        //update user --Admin
        builder.addCase( updateUser.pending, ( state, action)=>{
            state.error = "";
            state.loading = true;
        }),
        builder.addCase( updateUser.fulfilled, ( state, action)=>{
            state.isUpdated = true;
            state.loading = false;
            state.message = action.payload.message
        }),
        builder.addCase( updateUser.rejected, ( state, action)=>{
            state.error = action.payload.message;
            state.loading = false;
        }),
        //delete user --Admin
        builder.addCase( deleteUser.pending, ( state, action)=>{
            state.error = "";
            state.loading = true;
        }),
        builder.addCase( deleteUser.fulfilled, ( state, action)=>{
            state.isDeleted = true;
            state.loading = false;
            state.message = action.payload.message;
        }),
        builder.addCase( deleteUser.rejected, ( state, action)=>{
            state.error = action.payload.message;
            state.loading = false;
        })
    }

}) 

export const { clearError, clearUpdate, clearIsDeleted, clearMessage} = userSlice.actions;

export default userSlice.reducer;