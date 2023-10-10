import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
	generateHeader,
	makeAdRequest,
	makeRequest,
	makeSwaggerRequest,
} from "./apiConfig";
import CryptoJS from "crypto-js";

const initialState = {
	isAuthenticated: false,
	userRole: "",
	userName: "",
	emailAddress: "",
};

export const userLogin = async (data) => {
	const apiHeader = generateHeader();
	const header = {
		...apiHeader,
	};

	try {
		// const response = await makeRequest.post(
		// 	`/api/Account/AuthenticateOnPremADEncryptJsonTwoECBWithEncryptResponseAndRoleV2`,
		// 	data,
		// 	{ headers: header }
		// );
		const response = await makeRequest.post(
			`/api/Account/AuthenticateOnPremADEncryptJsonTwoECBWithEncryptResponseAndRole`,
			data,
			{ headers: header }
		);

		return response.data;
	} catch (error) {
		throw error;
		// return error;
	}
};

export const getUserDetails = async (email, Token) => {
	const apiHeader = generateHeader();
	const header = {
		...apiHeader,
	};

	try {
		const response = await makeRequest.post(
			`/api/Account/GetUserDetails?email=${email}&Token=${Token}`,
			"",
			{
				headers: header,
			}
		);

		return response.data;
	} catch (error) {
		throw error;
		// return error;
	}
};

let authSlice = createSlice({
	name: "auth",
	initialState: initialState,
	reducers: {
		logout: function (state, action) {
			state.isAuthenticated = false;
		},

		setUserRole: function (state, action) {
			state.userRole = action.payload;
		},

		setIsAuthenticated: function (state, action) {
			state.isAuthenticated = action.payload;
		},
		setUsername: function (state, action) {
			state.userName = action.payload;
		},
		setEmail: function (state, action) {
			state.emailAddress = action.payload;
		},
	},
});

export const {
	logout,
	setUserRole,
	setIsAuthenticated,
	setUsername,
	setEmail,
} = authSlice.actions;

export const userSelector = (state) => state.auth;
export default authSlice.reducer;
