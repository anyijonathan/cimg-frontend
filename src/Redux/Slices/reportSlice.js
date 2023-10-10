import { createSlice } from "@reduxjs/toolkit";
import { generateHeader, makeRequest } from "./apiConfig";

const initialState = {
	data: {
		recid: "",
		requestid: "",
		network: "",
		flag: "",
		channel: "",
		vendortag: "",
		tranDate: "",
		amount: "",
		sourcePhone: "",
		sourceAccount: "",
		transType: "",
		customername: "",
		customerPhoneNumber: "",
		platform: "",
		responseDescr: "",
	},
};

export const getAirtimeDataTransaction = async (
	startdate,
	enddate,
	vendorTag,
	telco,
	stat,
	email,
	role
) => {
	const apiHeader = generateHeader();
	const header = {
		...apiHeader,
		UserEmail: email,
		Role: role,
	};

	try {
		const response = await makeRequest.get(
			`/api/AirtimeBiller/GetAirtimeDataTransaction?startdate=${startdate}&enddate=${enddate}&vendortag=${vendorTag}&telco=${telco}&status=${stat}`,
			{
				headers: header,
			}
		);

		return response.data;
	} catch (error) {
		throw error
	}
};

export const getAirtimeDataTransactionInfo = async (
	acntNo,
	reqId,
	email,
	role
) => {
	const apiHeader = generateHeader();
	const header = {
		...apiHeader,
		UserEmail: email,
		Role: role,
	};

	try {
		const response = await makeRequest.get(
			`/api/AirtimeBiller/GetAirtimeDataTransactionWithCustomerDetail?accountNumber=${acntNo}&requestId=${reqId}`,
			{
				headers: header,
			}
		);
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const getAuditLogs = async (startDate, endDate, email, role) => {
	const apiHeader = generateHeader();
	const header = {
		...apiHeader,
		UserEmail: email,
		Role: role,
	};

	try {
		const response = await makeRequest.get(
			`/api/AirtimeBiller/GetAuditActivities?startDate=${startDate}&endDate=${endDate}`,
			{
				headers: header,
			}
		);

		return response.data;
	} catch (error) {
		throw error
	}
};

const reportSlice = createSlice({
	name: "telco",
	initialState: initialState,
	reducers: {
		getTransactionInfo: (state, action) => {
			state.data = {
				recid: action.payload.data.recid,
				requestid: action.payload.data.requestid,
				network: action.payload.data.network,
				flag: action.payload.data.flag,
				channel: action.payload.data.channel,
				vendortag: action.payload.data.vendortag,
				tranDate: action.payload.data.tranDate,
				amount: action.payload.data.amount,
				sourcePhone: action.payload.data.sourcePhone,
				sourceAccount: action.payload.data.sourceAccount,
				transType: action.payload.data.transType,
				customername: action.payload.data.customername,
				customerPhoneNumber: action.payload.data.customerPhoneNumber,
				platform: action.payload.data.platform,
				responseDescr: action.payload.data.responseDescr,
			};
		},
	},
});

export const { getTransactionInfo } = reportSlice.actions;

export default reportSlice.reducer;
