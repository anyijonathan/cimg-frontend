import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { generateHeader, makeRequest } from "./apiConfig";

const initialState = {
	pendingList: [],
	approvedList: [],
	rejectedList: [],
	notificationText: "",
	status: "",
};

export const SwitchTelcoToVendor = async (data, email, role) => {
	const apiHeader = generateHeader();
	const header = {
		...apiHeader,
		UserEmail: email,
		Role: role,
	};

	try {
		const response = await makeRequest.post(
			`/api/Switch/ModularSwitchAVendorToATelco`,
			data,
			{
				headers: header,
			}
		);

		return response.data;
	} catch (error) {
		throw error;
	}
};

export const CreateVendorTelcoMap = async (data, email, role) => {
	const apiHeader = generateHeader();
	const header = {
		...apiHeader,
		UserEmail: email,
		Role: role,
	};

	try {
		const response = await makeRequest.post(
			`/api/AirtimeBiller/MapTelcoToVendor`,
			data,
			{
				headers: header,
			}
		);

		return response.data;
	} catch (error) {
		throw error;
	}
};

export const getAllPendingMapping = async (email, role) => {
	const apiHeader = generateHeader();
	const header = {
		...apiHeader,
		UserEmail: email,
		Role: role,
	};

	try {
		const response = await makeRequest.get(
			`/api/AirtimeBiller/GetAllPendingTelcoVendorMaps`,
			{
				headers: header,
			}
		);

		return response.data;
	} catch (error) {
		throw error;
	}
};

export const getAllApprovedMapping = async (email, role) => {
	const apiHeader = generateHeader();
	const header = {
		...apiHeader,
		UserEmail: email,
		Role: role,
	};

	try {
		const response = await makeRequest.get(
			`/api/AirtimeBiller/GetAllApprovedTelcoVendorMaps`,
			{
				headers: header,
			}
		);

		return response.data;
	} catch (error) {
		throw error;
	}
};

export const getAllRejectedMapping = async (email, role) => {
	const apiHeader = generateHeader();
	const header = {
		...apiHeader,
		UserEmail: email,
		Role: role,
	};

	try {
		const response = await makeRequest.get(
			`/api/AirtimeBiller/GetAllRejectedTelcoVendorMaps`,
			{
				headers: header,
			}
		);

		return response.data;
	} catch (error) {
		throw error;
	}
};

export const ApproveTelcoToVendorMap = async (data, email, role) => {
	const apiHeader = generateHeader();
	const header = {
		...apiHeader,
		UserEmail: email,
		Role: role,
	};

	try {
		const response = await makeRequest.post(
			`/api/AirtimeBiller/ApproveTelcoVendorMap`,
			data,
			{
				headers: header,
			}
		);

		return response.data;
	} catch (error) {
		throw error;
	}
};

export const DeclineTelcoToVendorMap = async (data, email, role) => {
	const apiHeader = generateHeader();
	const header = {
		...apiHeader,
		UserEmail: email,
		Role: role,
	};

	try {
		const response = await makeRequest.post(
			`/api/AirtimeBiller/RejectTelcoVendorMap`,
			data,
			{
				headers: header,
			}
		);

		return response.data;
	} catch (error) {
		throw error;
	}
};

let mappingSlice = createSlice({
	name: "mapping",
	initialState: initialState,
	reducers: {
		setPendingList: function (state, action) {
			state.pendingList = action.payload;
		},
		setApprovedList: function (state, action) {
			state.approvedList = action.payload;
		},
		setRejectedList: function (state, action) {
			state.rejectedList = action.payload;
		},

		setNotificationText: function (state, action) {
			state.notificationText = action.payload;
		},
		setStatus: function (state, action) {
			state.status = action.payload;
		},
	},
});

export const {
	setPendingList,
	setRejectedList,
	setApprovedList,
	setNotificationText,
	setStatus,
} = mappingSlice.actions;

export const VendorTelcoSelector = (state) => state.mapping;
export default mappingSlice.reducer;
