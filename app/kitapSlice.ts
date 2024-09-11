import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Kitap } from './kitapTypes'; // Kitap türünüzü doğru şekilde import edin

// Kitapların saklanacağı state'in yapısı
interface KitapState {
  kitaplar: Kitap[];
}

// İlk durum (state)
const initialState: KitapState = {
  kitaplar: [],
};

// Slice tanımı
const kitapSlice = createSlice({
  name: 'kitaplar',
  initialState,
  reducers: {
    // Kitapları ayarla
    setKitaplar(state, action: PayloadAction<Kitap[]>) {
      state.kitaplar = action.payload;
    },
    // Kitap ekle
    addKitap(state, action: PayloadAction<Kitap>) {
      state.kitaplar.push(action.payload);
    },
    // Kitap güncelle
    updateKitap(state, action: PayloadAction<Kitap>) {
      const index = state.kitaplar.findIndex(kitap => kitap.id === action.payload.id);
      if (index !== -1) {
        state.kitaplar[index] = action.payload;
      }
    },
  },
});

// Aksiyonları export et
export const { setKitaplar, addKitap, updateKitap } = kitapSlice.actions;

// Reducer'ı export et
export default kitapSlice.reducer;
