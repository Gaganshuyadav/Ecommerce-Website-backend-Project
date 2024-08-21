import { configureStore} from "@reduxjs/toolkit";

import productReducer from "./features/Slices/ProductSlice";

const store = configureStore({
    reducer: {
        products: productReducer
    },
})

export default store;