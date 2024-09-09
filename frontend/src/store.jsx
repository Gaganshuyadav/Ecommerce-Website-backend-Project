import { configureStore} from "@reduxjs/toolkit";

import productReducer from "./features/Slices/ProductSlice";
import userReducer from "./features/Slices/UserSlice";
import cartReducer from "./features/Slices/CartSlice";
import orderReducer from "./features/Slices/OrderSlice";

const store = configureStore({
    reducer: {
        products: productReducer,
        user: userReducer,
        cart: cartReducer,
        order: orderReducer,
    },
})

export default store;