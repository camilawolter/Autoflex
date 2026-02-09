import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface RawMaterial {
  id?: number;
  name: string;
  stockQuantity: number;
}

interface MaterialState {
  items: RawMaterial[];
}

const initialState: MaterialState = { items: [] };

const materialSlice = createSlice({
  name: 'materials',
  initialState,
  reducers: {
    setMaterials: (state, action: PayloadAction<RawMaterial[]>) => {
      state.items = action.payload;
    },
    addMaterial: (state, action: PayloadAction<RawMaterial>) => {
      state.items.push(action.payload);
    },
    deleteMaterial: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    updateMaterial: (state, action: PayloadAction<RawMaterial>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) state.items[index] = action.payload;
    },
  },
});

export const { setMaterials, addMaterial, deleteMaterial, updateMaterial } = materialSlice.actions;
export default materialSlice.reducer;