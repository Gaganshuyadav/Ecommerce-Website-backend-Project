import { configureStore} from "@reduxjs/toolkit";

import productReducer from "./features/Slices/ProductSlice";
import userReducer from "./features/Slices/UserSlice";
import cartReducer from "./features/Slices/CartSlice";

const store = configureStore({
    reducer: {
        products: productReducer,
        user: userReducer,
        cart: cartReducer,
    },
})

export default store;