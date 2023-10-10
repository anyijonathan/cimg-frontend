import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { generateHeader, makeRequest } from "./apiConfig";

const initialState = {
	allTelcoList: [],
	pendingList: [],
	approvedList: [],
	declinedList: [],
	telcoId: 0,
	telcoInfo: {
		description: "",
		data: {
			telco: "",
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

export const getAllTelcos = async (email, role) => {
	const apiHeader = generateHeader();
	const header = {
		...apiHeader,
		UserEmail: email,
		Role: role,
	};

	try {
		const response = await makeRequest.get(
			`api/AirtimeBiller/GetAllTelcos`,
			{
				headers: header,
			}
		);

		return response.data;
	} catch (error) {
		throw error;
	}
};

export const addTelco = async (data, email, role) => {
	const apiHeader = generateHeader();
	const header = {
		...apiHeader,
		UserEmail: email,
		Role: role,
	};

	try {
		const response = await makeRequest.post(
			`/api/AirtimeBiller/AddTelco`,
			data,
			{ headers: header }
		);

		return response.data;
	} catch (error) {
		return error.response.data;
	}
};

export const editTelco = async (data, email, role) => {
	const apiHeader = generateHeader();
	const header = {
		...apiHeader,
		UserEmail: email,
		Role: role,
	};

	try {
		const response = await makeRequest.post(
			`/api/AirtimeBiller/AddTelco`,
			data,
			{ headers: header }
		);

		return response.data;
	} catch (error) {
		return error.response.data;
	}
};

export const enableTelco = async (id, email, role) => {
	const apiHeader = generateHeader();
	const header = {
		...apiHeader,
		UserEmail: email,
		Role: role,
	};

	try {
		const response = await makeRequest.post(
			`/api/AirtimeBiller/EnableTelco`,
			{ id: id },
			{
				headers: header,
			}
		);
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const disableTelco = async (id, email, role) => {
	const apiHeader = generateHeader();
	const header = {
		...apiHeader,
		UserEmail: email,
		Role: role,
	};

	try {
		const response = await makeRequest.post(
			`/api/AirtimeBiller/DisableTelco`,
			{ id: id },
			{
				headers: header,
			}
		);
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const archiveTelco = async (id, email, role) => {
	const apiHeader = generateHeader();
	const header = {
		...apiHeader,
		UserEmail: email,
		Role: role,
	};

	try {
		const response = await makeRequest.post(
			`api/AirtimeBiller/ArchiveTelco`,
			{ id: id },
			{
				headers: header,
			}
		);
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const unArchiveTelco = async (id, email, role) => {
	const apiHeader = generateHeader();
	const header = {
		...apiHeader,
		UserEmail: email,
		Role: role,
	};
	try {
		const response = await makeRequest.post(
			`api/AirtimeBiller/UnarchiveTelco`,
			{ id: id },
			{
				headers: header,
			}
		);
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const approveCreatedTelco = async (id, email, role) => {
	const apiHeader = generateHeader();
	const header = {
		...apiHeader,
		UserEmail: email,
		Role: role,
	};

	try {
		const response = await makeRequest.post(
			`api/AirtimeBiller/ApproveCreatedTelco`,
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

export const declineCreatedTelco = async (id, email, role) => {
	const apiHeader = generateHeader();
	const header = {
		...apiHeader,
		UserEmail: email,
		Role: role,
	};

	try {
		const response = await makeRequest.post(
			`api/AirtimeBiller/RejectCreatedTelco`,
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

export const getAllActiveTelcos = async (email, role) => {
	const apiHeader = generateHeader();
	const header = {
		...apiHeader,
		UserEmail: email,
		Role: role,
	};

	try {
		const response = await makeRequest.get(
			`/api/AirtimeBiller/GetAllApprovedTelcos`,
			{
				headers: header,
			}
		);

		return response.data;
	} catch (error) {
		throw error;
	}
};

export const getAllRejectedTelcos = async (email, role) => {
	const apiHeader = generateHeader();

	const header = {
		...apiHeader,
		UserEmail: email,
		Role: role,
	};

	try {
		const response = await makeRequest.get(
			`/api/AirtimeBiller/GetAllRejectedTelcos`,

			{
				headers: header,
			}
		);

		return response.data;
	} catch (error) {
		throw error;
	}
};

export const getAllInactiveTelcos = async (email, role) => {
	const apiHeader = generateHeader();
	const header = {
		...apiHeader,
		UserEmail: email,
		Role: role,
	};

	try {
		const response = await makeRequest.get(
			`/api/AirtimeBiller/GetAllInactiveTelcos`,
			{
				headers: header,
			}
		);

		return response.data;
	} catch (error) {
		throw error;
	}
};

export const getAllPendingTelcos = async (email, role) => {
	const apiHeader = generateHeader();
	const header = {
		...apiHeader,
		UserEmail: email,
		Role: role,
	};

	try {
		const response = await makeRequest.get(
			`/api/AirtimeBiller/GetAllPendingTelcos`,
			{
				headers: header,
			}
		);

		return response.data;
	} catch (error) {
		throw error;
	}
};

export const getAllArchivedTelcos = async (email, role) => {
	const apiHeader = generateHeader();
	const header = {
		...apiHeader,
		UserEmail: email,
		Role: role,
	};
	try {
		const response = await makeRequest.get(
			`/api/AirtimeBiller/GetAllArchivedTelcos`,
			{
				headers: header,
			}
		);

		return response.data;
	} catch (error) {
		throw error;
	}
};

export const getTelcoInfo = async (telcoTag, email, role) => {
	const apiHeader = generateHeader();
	const header = {
		...apiHeader,
		UserEmail: email,
		Role: role,
	};
	try {
		const response = await makeRequest.get(
			`/api/AirtimeBiller/GetTelcoDashboard?telcoName=${telcoTag}`,
			// { id: id },
			{
				headers: header,
			}
		);
		return response.data;
	} catch (error) {
		throw error;
	}
};

let telcoSlice = createSlice({
	name: "telcoModule",
	initialState: initialState,
	reducers: {
		setAllTelcosList: (state, action) => {
			state.allTelcoList = action.payload;
		},
		setPendingList: (state, action) => {
			state.pendingList = action.payload;
		},
		setApprovedList: (state, action) => {
			state.approvedList = action.payload;
		},
		setDeclinedList: (state, action) => {
			state.declinedList = action.payload;
		},

		setId: function (state, action) {
			state.userId = action.payload;
		},
		getTelco: (state, action) => {
			state.telcoInfo = {
				description: action.payload.description,
				data: {
					telco: action.payload.data.telco,
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
					vendor: action.payload.data.vendor,
				},
			};
		},
	},
});

export const {
	setId,
	getTelco,
	setAllTelcosList,
	setPendingList,
	setApprovedList,
	setDeclinedList,
} = telcoSlice.actions;
export const telcoSelector = (state) => state.telcoModule;
export default telcoSlice.reducer;
