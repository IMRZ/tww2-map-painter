import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type MapOverlay = {
  key: string;
  label: string;
  visible: boolean;
};

const initialState = {
  overlays: {} as Record<any, MapOverlay>,
};

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    overlayCreated: (state, action: PayloadAction<[string, string]>) => {
      const [key, label] = action.payload;
      state.overlays[key] = { key, label, visible: true };
    },
    overlayChanged: (state, action: PayloadAction<[string, boolean]>) => {
      const [key, visible] = action.payload;
      state.overlays[key].visible = visible;
    },
  },
});

export const { overlayCreated, overlayChanged } = mapSlice.actions;

export default mapSlice.reducer;
