import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";




const initialState = {
    isLoading : false,
    productList : [],
}


// this will add new product to the server
export const addNewProduct = createAsyncThunk('products/addNewProduct', async (formData, { rejectWithValue }) => {
    try {
        const result = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/admin/products/add`,
            formData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );
        return result.data;
    } catch (error) {
        return rejectWithValue(error.response ? error.response.data : 'An error occurred');
    }
});

// this will fetch all the products from the server
export const fetchAllProducts = createAsyncThunk('products/fetchAllProducts', async () => {
    const result = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/products/get`);
    return result?.data;
});


// this will edit the product from the server
export const editProduct = createAsyncThunk("product/editProduct", async({id, formData}) => {
        const result = await axios.put(
            `${import.meta.env.VITE_API_URL}/api/admin/products/edit/${id}`,
            formData,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        return result.data;
    }
);

    // this will delete the product from the server
export const deleteProduct = createAsyncThunk('products/deleteProduct', async (id) => {
    const result = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/admin/products/delete/${id}`);

    return result?.data;
});

const AdminProductsSlice = createSlice({
    name: "adminProducts",
    initialState,

    reducers: {
        // fetchAllProductsRequest: (state) => {
        //     state.loading = true;
        // },
        // fetchAllProductsSuccess: (state, action) => {
        //     state.loading = false;
        //     state.products = action.payload;
        // },
        // fetchAllProductsFail: (state, action) => {
        //     state.loading = false;
        //     state.error = action.payload;
        // },
    },

    extraReducers:
        (builder) => {
            builder
            .addCase(fetchAllProducts.pending, (state) => {
                state.isLoading = true;
            });
            builder
            .addCase(fetchAllProducts.fulfilled, (state, action) => {
                // console.log(action.payload, "action.payload.data");
                state.isLoading = false;
                state.productList = action.payload.data;
            });
            builder.addCase(fetchAllProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.productList= [];
            });
    },
});

export default AdminProductsSlice.reducer;