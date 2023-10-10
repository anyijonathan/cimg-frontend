import { createSlice } from "@reduxjs/toolkit";
import { generateHeader, makeRequest } from "./apiConfig";

const initialState = {
	feeSetupId: "",
	pendingFeeSetups: [],
	approvedFeeSetups: [],
	rejectedFeeSetups: [],
};

export const CreateFeeSetup = async (data, email, role) => {
	const apiHeader = generateHeader();
	const header = {
		...apiHeader,
		UserEmail: email,
		Role: role,
	};

	try {
		const response = await makeRequest.post(
			`/api/AirtimeBiller/SaveFeeSetups`,
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

export const ModifyFeeSetup = async (data, email, role) => {
	const apiHeader = generateHeader();
	const header = {
		...apiHeader,
		UserEmail: email,
		Role: role,
	};

	try {
		const response = await makeRequest.post(
			`/api/AirtimeBiller/ModifyFeeSetup`,
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

export const getAllPendingFeeSetups = async (email, role) => {
	const apiHeader = generateHeader();
	const header = {
		...apiHeader,
		UserEmail: email,
		Role: role,
	};

	try {
		const response = await makeRequest.get(
			`/api/AirtimeBiller/GetAllPendingFeeSetups`,
			{
				headers: header,
			}
		);

		return response;
	} catch (error) {
		return error.response;
	}
};

export const getAllApprovedFeeSetups = async (email, role) => {
	const apiHeader = generateHeader();
	const header = {
		...apiHeader,
		UserEmail: email,
		Role: role,
	};

	try {
		const response = await makeRequest.get(
			`/api/AirtimeBiller/GetAllApprovedFeeSetups`,
			{
				headers: header,
			}
		);

		return response;
	} catch (error) {
		return error.response;
	}
};

export const getAllRejectedFeeSetups = async (email, role) => {
	const apiHeader = generateHeader();
	const header = {
		...apiHeader,
		UserEmail: email,
		Role: role,
	};

	try {
		const response = await makeRequest.get(
			`/api/AirtimeBiller/GetAllRejectedFeeSetups`,
			{
				headers: header,
			}
		);

		return response;
	} catch (error) {
		return error.response;
	}
};

export const approveFeeSetup = async (id, telcoId, vendorId, email, role) => {
	const apiHeader = generateHeader();
	const header = {
		...apiHeader,
		UserEmail: email,
		Role: role,
	};

	try {
		const response = await makeRequest.post(
			`/api/AirtimeBiller/ApproveFeeSetup`,
			{ id: id, telcoId: telcoId, vendorId: vendorId },
			{
				headers: header,
			}
		);
		return response.data;
	} catch (error) {
		return error;
	}
};

export const rejectFeeSetup = async (id, telcoId, vendorId, email, role) => {
	const apiHeader = generateHeader();
	const header = {
		...apiHeader,
		UserEmail: email,
		Role: role,
	};

	try {
		const response = await makeRequest.post(
			`/api/AirtimeBiller/RejectFeeSetup`,
			{ id: id, telcoId: telcoId, vendorId: vendorId },
			{
				headers: header,
			}
		);
		return response.data;
	} catch (error) {
		return error;
	}
};

export const getFeeSetupById = async (id, email, role) => {
	const apiHeader = generateHeader();
	const header = {
		...apiHeader,
		UserEmail: email,
		Role: role,
	};

	try {
		const response = await makeRequest.get(
			`/api/AirtimeBiller/GetFeeSetupById?Id=${id}`,
			{
				headers: header,
			}
		);

		return response;
	} catch (error) {
		return error.response;
	}
};

let feeSetUpSlice = createSlice({
	name: "feeSetup",
	initialState: initialState,
	reducers: {
		setPendingSetups: function (state, action) {
			state.pendingFeeSetups = action.payload;
		},
		setApprovedSetups: function (state, action) {
			state.approvedFeeSetups = action.payload;
		},
		setRejectedSetups: function (state, action){
			state.rejectedFeeSetups = action.payload;
		},

		setFeeSetupId: function (state, action) {
			state.feeSetupId = action.payload;
		}
	}
});

export const {
	setFeeSetupId,
	setApprovedSetups,
	setRejectedSetups,
	setPendingSetups,
} = feeSetUpSlice.actions;
export const feeSetUpSelector = (state) => state.feeSetup;
export default feeSetUpSlice.reducer;
