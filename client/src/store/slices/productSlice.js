import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productAPI, categoryAPI } from '../../services/api';

export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async (params, { rejectWithValue }) => {
    try {
      const response = await productAPI.getAll(params);
      return response.data; // expects { products, total, page, pages }
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchProductBySlug = createAsyncThunk(
  'product/fetchProductBySlug',
  async (slug, { rejectWithValue }) => {
    try {
      const response = await productAPI.getBySlug(slug);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchFeatured = createAsyncThunk(
  'product/fetchFeatured',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productAPI.getFeatured();
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'product/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await categoryAPI.getAll();
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const initialState = {
  products: [],
  featured: [],
  current: null,
  categories: [],
  loading: false,
  error: null,
  total: 0,
  page: 1,
  pages: 1
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    clearCurrentProduct(state) {
      state.current = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        // If it's page 1, replace. If it's > 1, append (for load more).
        if (action.meta.arg?.page > 1) {
          state.products = [...state.products, ...action.payload.products];
        } else {
          state.products = action.payload.products;
        }
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Product by Slug
      .addCase(fetchProductBySlug.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload.product || action.payload;
      })
      .addCase(fetchProductBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Featured
      .addCase(fetchFeatured.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeatured.fulfilled, (state, action) => {
        state.loading = false;
        state.featured = action.payload.products || action.payload;
      })
      .addCase(fetchFeatured.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload.categories || action.payload;
      });
  }
});

export const { clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;
