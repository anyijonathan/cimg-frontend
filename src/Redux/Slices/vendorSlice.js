import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { generateHeader, makeRequest } from "./apiConfig";
import { encryptEcb } from "../../utils/HelperFunction";

const initialState = {
	allVendorsList: [],
	pendingVendorsList: [],
	approvedVendorsList: [],
	declinedVendorsList: [],
	vendorId: 0,
	vendorInfo: {
		description: "",
		data: {
			vendorName: "",
			status: "",
			platform: "",
			dateAdded: "",
			addedBy: null,
			approvedBy: null,
			airtimeDataBillerVendorTransactionsAggregate: {
				totalDailySuccess: null,
				totalDailyFailed: null,
				totalWeeklySuccess: null,
				totalWeeklyFailed: null,
				totalmonthlySuccess: null,
				totalmonthlyFailed: null,
				totalAllSuccess: "",
				totalAllFailed: "",
			},
			telcos: [],
		},
		dataList: null,
	},
};

export const getAllVendors = async (email, role) => {
	const apiHeader = generateHeader();
	const header = {
		...apiHeader,
		UserEmail: email,
		Role: role,
	};

	try {
		const response = await makeRequest.get(
			`/api/AirtimeBiller/GetAllVendors`,
			{
				headers: header,
			}
		);

		return response.data;
	} catch (error) {
		throw error;
	}
};

export const getAllActiveVendors = async (email, role) => {
	const apiHeader = generateHeader();
	const header = {
		...apiHeader,
		UserEmail: email,
		Role: role,
	};

	try {
		const response = await makeRequest.get(
			`/api/AirtimeBiller/GetApprovedVendors`,
			{
				headers: header,
			}
		);

		return response.data;
	} catch (error) {
		throw error;
	}
};

export const getAllInactiveVendors = async (email, role) => {
	const apiHeader = generateHeader();
	const header = {
		...apiHeader,
		UserEmail: email,
		Role: role,
	};

	try {
		const response = await makeRequest.get(
			`/api/AirtimeBiller/GetInactiveVendors`,
			{
				headers: header,
			}
		);

		return response.data;
	} catch (error) {
		throw error;
	}
};

export const getAllPendingVendors = async (email, role) => {
	const apiHeader = generateHeader();
	const header = {
		...apiHeader,
		UserEmail: email,
		Role: role,
	};

	try {
		const response = await makeRequest.get(
			`/api/AirtimeBiller/GetPendingVendors`,
			{
				headers: header,
			}
		);

		return response.data;
	} catch (error) {
		throw error;
	}
};

export const getAllArchivedVendors = async (email, role) => {
	const apiHeader = generateHeader();
	const header = {
		...apiHeader,
		UserEmail: email,
		Role: role,
	};

	try {
		const response = await makeRequest.get(
			`/api/AirtimeBiller/GetArchivedVendors`,
			{
				headers: header,
			}
		);

		return response.data;
	} catch (error) {
		throw error;
	}
};

export const getAllRejectedVendors = async (email, role) => {
	const apiHeader = generateHeader();
	const header = {
		...apiHeader,
		UserEmail: email,
		Role: role,
	};

	try {
		const response = await makeRequest.get(
			`/api/AirtimeBiller/GetRejectedVendors`,
			{
				headers: header,
			}
		);

		return response.data;
	} catch (error) {
		throw error;
	}
};

export const addVendor = async (data, email, role) => {
	const apiHeader = generateHeader();
	let encryptedEmail = encryptEcb(email, process.env.REACT_APP_AES_KEY);

	const header = {
		...apiHeader,
		UserEmail: encryptedEmail,
		Role: role,
	};

	try {
		const response = await makeRequest.post(
			`/api/AirtimeBiller/AddVendor`,
			data,
			{ headers: header }
		);

		return response.data;
	} catch (error) {
		return error.response.data;
	}
};

export const editVendor = async (data, email, role) => {
	const apiHeader = generateHeader();
	const header = {
		...apiHeader,
		UserEmail: email,
		Role: role,
	};

	try {
		const response = await makeRequest.post(
			`/api/AirtimeBiller/AddVendor`,
			data,
			{ headers: header }
		);

		return response.data;
	} catch (error) {
		return error.response.data;
	}
};

export const approveCreatedVendor = async (id, email, role) => {
	const apiHeader = generateHeader();
	const header = {
		...apiHeader,
		UserEmail: email,
		Role: role,
	};

	try {
		const response = await makeRequest.post(
			`api/AirtimeBiller/ApproveCreatedVendor`,
			{ id: id },
			{
				headers: header,
			}
		);
		return response.data;
	} catch (error) {
		return error;
	}
};

export const declineCreatedVendor = async (id, email, role) => {
	const apiHeader = generateHeader();
	const header = {
		...apiHeader,
		UserEmail: email,
		Role: role,
	};

	try {
		const response = await makeRequest.post(
			`api/AirtimeBiller/RejectCreatedVendor`,
			{ id: id },
			{
				headers: header,
			}
		);
		return response.data;
	} catch (error) {
		return error;
	}
};

export const enableVendor = async (id, email, role) => {
	const apiHeader = generateHeader();
	const header = {
		...apiHeader,
		UserEmail: email,
		Role: role,
	};

	try {
		const response = await makeRequest.post(
			`/api/AirtimeBiller/EnableVendor`,
			{ id: id },
			{
				headers: header,
			}
		);
		return response.data;
	} catch (error) {
		return error;
	}
};

export const disableVendor = async (id, email, role) => {
	const apiHeader = generateHeader();
	const header = {
		...apiHeader,
		UserEmail: email,
		Role: role,
	};

	try {
		const response = await makeRequest.post(
			`api/AirtimeBiller/DisableVendor`,
			{ id: id },
			{
				headers: header,
			}
		);
		return response.data;
	} catch (error) {
		return error;
	}
};

export const archiveVendor = async (id, email, role) => {
	const apiHeader = generateHeader();
	const header = {
		...apiHeader,
		UserEmail: email,
		Role: role,
	};

	try {
		const response = await makeRequest.post(
			`api/AirtimeBiller/ArchiveVendor`,
			{ id: id },
			{
				headers: header,
			}
		);
		return response.data;
	} catch (error) {
		return error;
	}
};

export const unArchiveVendor = async (id, email, role) => {
	const apiHeader = generateHeader();
	const header = {
		...apiHeader,
		UserEmail: email,
		Role: role,
	};

	try {
		const response = await makeRequest.post(
			`api/AirtimeBiller/UnarchivingVendor`,
			{ id: id },
			{
				headers: header,
			}
		);
		return response.data;
	} catch (error) {
		return error;
	}
};

export const getVendorInfo = async (vendorTag, email, role) => {
	const apiHeader = generateHeader();
	const header = {
		...apiHeader,
		UserEmail: email,
		Role: role,
	};

	try {
		const response = await makeRequest.get(
			`/api/AirtimeBiller/GetVendorDashboard?vendorTag=${vendorTag}`,
			// { id: id },
			{
				headers: header,
			}
		);
		return response.data;
	} catch (error) {
		return error;
	}
};

let vendorSlice = createSlice({
	name: "vendor",
	initialState: initialState,
	reducers: {
		setAllVendorsList: (state, action) => {
			state.allVendorsList = action.payload;
		},
		setPendingVendorsList: (state, action) => {
			state.pendingVendorsList = action.payload;
		},
		setApprovedVendorsList: (state, action) => {
			state.approvedVendorsList = action.payload;
		},
		setDeclinedVendorsList: (state, action) => {
			state.declinedVendorsList = action.payload;
		},
		setId: function (state, action) {
			state.userId = action.payload;
		},
		getVendor: (state, action) => {
			//  // state.vendorInfo.data.vendorName = action.payload.data.vendorName;
			state.vendorInfo = {
				description: action.payload.description,
				data: {
					vendorName: action.payload.data.vendorName,
					status: action.payload.data.status,
					platform: action.payload.data.platform,
					dateAdded: action.payload.data.dateAdded,
					addedBy: action.payload.data.addedBy,
					approvedBy: action.payload.data.approvedBy,
					airtimeDataBillerVendorTransactionsAggregate: {
						totalDailySuccess:
							action.payload.data
								.airtimeDataBillerVendorTransactionsAggregate
								.totalDailySuccess,
						totalDailyFailed:
							action.payload.data
								.airtimeDataBillerVendorTransactionsAggregate
								.totalDailyFailed,
						totalWeeklySuccess:
							action.payload.data
								.airtimeDataBillerVendorTransactionsAggregate
								.totalWeeklySuccess,
						totalWeeklyFailed:
							action.payload.data
								.airtimeDataBillerVendorTransactionsAggregate
								.totalWeeklyFailed,
						totalmonthlySuccess:
							action.payload.data
								.airtimeDataBillerVendorTransactionsAggregate
								.totalmonthlySuccess,
						totalmonthlyFailed:
							action.payload.data
								.airtimeDataBillerVendorTransactionsAggregate
								.totalmonthlyFailed,
						totalAllSuccess:
							action.payload.data
								.airtimeDataBillerVendorTransactionsAggregate
								.totalAllSuccess,
						totalAllFailed:
							action.payload.data
								.airtimeDataBillerVendorTransactionsAggregate
								.totalAllFailed,
					},
					telcos: action.payload.data.telcos,
				},
			};
		},
	},
});

export const {
	setId,
	getVendor,
	setAllVendorsList,
	setApprovedVendorsList,
	setDeclinedVendorsList,
	setPendingVendorsList,
} = vendorSlice.actions;
export const vendorSelector = (state) => state.vendorModule;
export default vendorSlice.reducer;
