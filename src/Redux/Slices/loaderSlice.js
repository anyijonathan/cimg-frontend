import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
};

let loaderSlice = createSlice({
  name: "loader",
  initialState: initialState,
  reducers: {
    closeLoader: function (state, action) {
      state.isLoading = false;
    },

    openLoader: function (state, action) {
      state.isLoading = true;
    },
  },
});

export const { openLoader, closeLoader } = loaderSlice.actions;
export const loaderSelector = (state) => state.loader;
export default loaderSlice.reducer;
