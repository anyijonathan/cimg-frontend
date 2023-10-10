import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	openTimeoutModal: false,
};

let sessionTimeoutSlice = createSlice({
	name: "timeoutModal",
	initialState: initialState,
	reducers: {
		closeModal: function (state, action) {
			state.openTimeoutModal = false;
		},

		openModal: function (state, action) {
			state.openTimeoutModal = true;
		},
	},
});

export const { openModal, closeModal } = sessionTimeoutSlice.actions;

export default sessionTimeoutSlice.reducer;
