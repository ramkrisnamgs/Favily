import axios from 'axios';

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


const initialState = {
    isLoading: false,
    productList: [],
    productDetails: null,
    error: null,
}

export const fetchAllFilteredProducts = createAsyncThunk('products/fetchAllFilteredProducts',
    async ({filterParams, sortParams}) => {
        // console.log("Filter Params:", filterParams); // Log filter params
        // console.log("Sort Params:", sortParams); // Log sort params

        const query = new URLSearchParams({
            ...filterParams,
            sortBy: sortParams,
        });

        try {
            const result = await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/products/get?${query}`);
            console.log("API Response:", result.data); // Log the API response
            
            return result.data;
        } catch (error) {
            if (error.response) {
                console.error("Error fetching filtered products:", error.response.data);
            } else {
                console.error("Error fetching filtered products:", error.message);
            }
            throw error; // Rethrow the error to be handled in extraReducers
        }
    }
);

// this will fetch all the products from the server
// export const fetchAllFilteredProducts = createAsyncThunk(
//     'products/fetchAllFilteredProducts',
//     async () => {
//         const result = await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/products/get`);
//         return result.data;
//     }
// );

export const fetchProductDetails = createAsyncThunk('products/fetchProductDetails',
    async (id) => {

        const result = await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/products/get/${id}`);
        
        // console.log("API Response:", result.data); // Log the API response

        return result?.data;
    }
);

const shoppingProductsSlice = createSlice({
    name: 'shoppingProducts',
    initialState,
    reducers: {
        setProductDetails: (state) => {
            state.productDetails = null;
        }
    },       
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllFilteredProducts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.productList = action.payload.data;
            })
            .addCase(fetchAllFilteredProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.productList = [],
                state.error = action.error.message;
            })
            .addCase(fetchProductDetails.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchProductDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.productDetails = action.payload.data;
            })
            .addCase(fetchProductDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.productDetails = null,
                state.error = action.error.message;
            })
    },
});

export const { setProductDetails } = shoppingProductsSlice.actions;
export default shoppingProductsSlice.reducer; 