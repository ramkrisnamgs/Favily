import { configureStore } from "@reduxjs/toolkit";
import authReducer from './auth-slice'
import AdminProductsSlice from './admin/products-slice';
import adminOrderSlice from './admin/order-slice';

import shoppingProductsSlice from './shop/products-slice';
import shoppingCartSlice from './shop/cart-slice';
import shoppingAddressSlice from './shop/address-slice';
import shoppingOrderSlice from './shop/order-slice';
import shoppingSearchSlice from './shop/search-slice';
import shoopingReviewSlice from './shop/review-slice';

import commonFeatureSlice from './common-slice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        AdminProducts: AdminProductsSlice,
        adminOrder: adminOrderSlice,
        
        shoppingProducts: shoppingProductsSlice,
        shopCart: shoppingCartSlice,
        shopAddress: shoppingAddressSlice,
        shopOrder: shoppingOrderSlice,
        shopSearch: shoppingSearchSlice,
        shopReview: shoopingReviewSlice,

        commonFeature: commonFeatureSlice,
    },
    // middleware: (getDefaultMiddleware) => 
    //     getDefaultMiddleware()
    //         .concat(thunk),
    //devTools: true, // this will enable the redux dev tools
})

export default store;

// where do we import store? => we import store in the App.js file and then we wrap the App component with the Provider component and pass the store as a prop to the Provider component