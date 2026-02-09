// Adicione o 'type' aqui dentro das chaves
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface Product {
  id?: number;
  name: string;
  price: number;
}

interface ProductState {
  items: Product[];
}

const initialState: ProductState = { items: [] };

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload;
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.items.push(action.payload);
    },
    deleteProduct: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) state.items[index] = action.payload;
    },
  },
});

export const { setProducts, addProduct, deleteProduct, updateProduct } = productSlice.actions;
export default productSlice.reducer;