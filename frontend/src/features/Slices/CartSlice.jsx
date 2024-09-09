import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: "cart",
    initialState:{
        cartItems: JSON.parse( localStorage.getItem("cartItems")) || [],
        shippingInfo: JSON.parse( localStorage.getItem("shippingInfo")) || {},
    },
    reducers:{
        //Add to Cart
        addToCart: ( state, action)=>{
            const item = action.payload;
            const isItemExist = state.cartItems.find( ( cartItem)=>{
                return item.productId === cartItem.productId;                      //don't need to convert _id to string because of res.json, it losts its objectId type 
            });

            if(isItemExist){
                const updatedItems = state.cartItems.map( (cartItem)=>{
                    return cartItem.productId === isItemExist.productId ? item : cartItem 
                })

                state.cartItems = updatedItems;
                localStorage.setItem("cartItems", JSON.stringify(updatedItems));
            }
            else{
                state.cartItems.push( item);
                localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
            }

        },
        //Remove from Cart
        removeFromCart: ( state, action)=>{
            state.cartItems = state.cartItems.filter(( item)=>{
                return item.productId !== action.payload; 
            })

            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },
        // add shinning info
        saveShippingInfo: ( state,action)=>{
            state.shippingInfo = action.payload;
            localStorage.setItem("shippingInfo",JSON.stringify(action.payload));
        },
    },
})

export const { addToCart, removeFromCart, saveShippingInfo} = cartSlice.actions;

export default cartSlice.reducer;


