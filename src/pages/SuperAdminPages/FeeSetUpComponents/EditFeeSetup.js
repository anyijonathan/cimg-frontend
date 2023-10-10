import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Breadcrumb from "../../../components/Breadcrumb";
import Button from "../../../components/Button";
import FormInput from "../../../components/FormInput";
import FormSelect from "../../../components/FormSelect";
import Notification from "../../../components/Notification";
import { userSelector } from "../../../Redux/Slices/authSlice";
import {
	feeSetUpSelector,
	getFeeSetupById,
	ModifyFeeSetup,
} from "../../../Redux/Slices/feeSetUpSlice";
import { getAllActiveTelcos } from "../../../Redux/Slices/telcoSlice";
import { getAllActiveVendors } from "../../../Redux/Slices/vendorSlice";
import { decryptEcb } from "../../../utils/HelperFunction";

const EditFeeSetup = () => {
	const { emailAddress, userRole } = useSelector(userSelector);
	const { feeSetupId } = useSelector(feeSetUpSelector);

	let vendorType = [
		{
			id: 1,
			value: "",
			name: "Select vendor",
		},
	];

	let telcoType = [
		{
			id: 1,
			value: "",
			name: "Select telco",
		},
	];

	let chargeType = [
		{
			id: 0,
			value: "",
			name: "Select Charge Type",
		},
		{
			id: 1,
			value: "PERCENTAGE",
			name: "PERCENTAGE",
		},
	];

	const [data, setData] = useState([]);
	const [userId, setUserId] = useState(null);

	const [feeInfo, setFeeInfo] = useState({
		chargeTypeValue: "",
		value: "",
		vendorShare: "",
		bankShare: "",
		telcoShare: "",
		dataSuspenseAccount: "",
		airtimeSuspenseAccount: "",
		bankAccount: "",
		vendorAccount: "",
		vendorOptions: vendorType,
		telcoOptions: telcoType,
		chargeOptions: chargeType,
		vendorName: "",
		vendorId: "",
		telcoName: "",
		telcoId: "",
	});

	const [generalStates, setGeneralStates] = useState({
		notificationText: "",
		status: "",
		isLoading: false,
		disabled: true,
	});

	const handleFeeInfoChange = (e) => {
		const { value } = e.target;
		setFeeInfo({
			...feeInfo,
			[e.target.name]: value,
		});
	};

	const handleChargeType = (e) => {
		const { value } = e.target;
		setFeeInfo({
			...feeInfo,
			chargeTypeValue: value,
		});
	};

	const fetchVendorList = async () => {
		let newOptions = {};
		let newVendorOptions = [...vendorType];
		try {
			let responseData = await getAllActiveVendors(
				emailAddress,
				userRole
			);
			responseData.dataList.filter((vendor) => {
				newOptions.id = vendor.id;
				newOptions.name = vendor.vendorName;
				newOptions.value = vendor.vendorName;
				newVendorOptions.push(newOptions);
				newOptions = {};
				return newVendorOptions;
			});
			setFeeInfo((prevState) => ({
				...prevState,
				vendorOptions: newVendorOptions,
			}));
		} catch (error) {
			setGeneralStates((prevState) => ({
				...prevState,
				status: "failure",
				notificationText: "an error occured, could not fetch vendors",
			}));
		}
	};

	const fetchTelcoList = async () => {
		let newOptions = {};
		let newTelcoOptions = [...telcoType];
		try {
			let responseData = await getAllActiveTelcos();
			responseData.dataList.filter((telco) => {
				newOptions.id = telco.id;
				newOptions.name = telco.telcoName;
				newOptions.value = telco.telcoName;
				newTelcoOptions.push(newOptions);
				newOptions = {};
				return newTelcoOptions;
			});
			setFeeInfo((prevState) => ({
				...prevState,
				telcoOptions: newTelcoOptions,
			}));
		} catch (error) {
			setGeneralStates((prevState) => ({
				...prevState,
				status: "failure",
				notificationText: "an error occured, could not fetch telcos",
			}));
		}
	};

	const getFeeSetup = async () => {
		try {
			const response = await getFeeSetupById(
				feeSetupId,
				emailAddress,
				userRole
			);
			if (response.data.code === "00") {
				let fee = response.data.data;
/* 
				let decryptedTelcoSuspenseDataAccount = decryptEcb(
					fee.telcoSuspenseDataAccount,
					process.env.REACT_APP_AES_KEY
				);

				let decryptedTelcoSuspenseAirtimeAccount = decryptEcb(
					fee.telcoSuspenseAirtimeAccount,
					process.env.REACT_APP_AES_KEY
				);

				let decryptedFcmbIncomeAccount = decryptEcb(
					fee.fcmbIncomeAccount,
					process.env.REACT_APP_AES_KEY
				);

				let decryptedVendorIncomeAccount = decryptEcb(
					fee.vendorIncomeAccount,
					process.env.REACT_APP_AES_KEY
				); */

				setFeeInfo((prevState) => ({
					...prevState,
					chargeTypeValue: fee.chargeType,
					value: fee.value,
					vendorShare: fee.vendorRate,
					bankShare: fee.fcmbRate,
					telcoShare: fee.telcoRate,
					dataSuspenseAccount: fee.telcoSuspenseDataAccount,
					airtimeSuspenseAccount:
						fee.telcoSuspenseAirtimeAccount,
					bankAccount: fee.fcmbIncomeAccount,
					vendorAccount: fee.vendorIncomeAccount,
					vendorName: fee.vendorName,
					vendorId: fee.vendorId,
					telcoName: fee.telcoName,
					telcoId: fee.telcoId,
				}));
			} else {
				setGeneralStates((prevState) => ({
					...prevState,
					status: "failure",
					notificationText: "an error occured",
				}));
			}
		} catch (error) {
			setGeneralStates((prevState) => ({
				...prevState,
				status: "failure",
				notificationText:
					"an error occured, could no retrieve fee setup",
			}));
		}
	};

	useEffect(() => {
		fetchTelcoList();
		fetchVendorList();
	}, []);

	const modifyFee = async () => {
		const data = {
			id: feeSetupId,
			telcoId: feeInfo.telcoId,
			vendorId: feeInfo.vendorId,
			telcoName: feeInfo.telcoName,
			vendorName: feeInfo.vendorName,
			value: feeInfo.value,
			fcmbRate: feeInfo.bankShare,
			telcoRate: feeInfo.telcoShare,
			vendorRate: feeInfo.vendorShare,
			telcoSuspenseAirtimeAccount: feeInfo.airtimeSuspenseAccount,
			telcoSuspenseDataAccount: feeInfo.dataSuspenseAccount,
			fcmbIncomeAccount: feeInfo.bankAccount,
			vendorIncomeAccount: feeInfo.vendorAccount,
			chargeType: feeInfo.chargeTypeValue,
		};

		if (
			data.telcoName === "" ||
			data.vendorName === "" ||
			data.value === 0 ||
			data.fcmbRate === 0 ||
			data.telcoRate === 0 ||
			data.vendorRate === 0 ||
			data.telcoSuspenseAirtimeAccount === "" ||
			data.telcoSuspenseDataAccount === "" ||
			data.vendorIncomeAccount === "" ||
			data.fcmbIncomeAccount === ""
		) {
			setGeneralStates((prevState) => ({
				...prevState,
				status: "failure",
				notificationText: "all fields are required",
			}));
		} else {
			try {
				setGeneralStates((prevState) => ({
					...prevState,
					isLoading: true,
					disabled: true,
				}));

				let response = await ModifyFeeSetup(
					data,
					emailAddress,
					userRole
				);
				if (response.code === "00") {
					setGeneralStates((prevState) => ({
						...prevState,
						status: "success",
						notificationText: response.description,
					}));

					setTimeout(() => {
						setGeneralStates((prevState) => ({
							...prevState,
							status: "",
							notificationText: "",
							isLoading: false,
							disabled: false,
						}));
					}, 2000);
				} else {
					setGeneralStates((prevState) => ({
						...prevState,
						status: "failure",
						notificationText: response.description,
						isLoading: false,
						disabled: false,
					}));

					setTimeout(() => {
						setGeneralStates((prevState) => ({
							...prevState,
							status: "",
							notificationText: "",
						}));

						setFeeInfo((prevState) => ({
							...prevState,
							chargeTypeValue: "",
							value: "",
							vendorShare: 0,
							bankShare: 0,
							telcoShare: 0,
							dataSuspenseAccount: "",
							airtimeSuspenseAccount: "",
							bankAccount: "",
							vendorAccount: "",
							vendorOptions: vendorType,
							telcoOptions: telcoType,
							chargeOptions: chargeType,
							vendorName: "",
							vendorId: 0,
							telcoName: "",
							telcoId: 0,
						}));
					}, 2000);
				}
			} catch (error) {
				setGeneralStates((prevState) => ({
					...prevState,
					isLoading: false,
					disabled: false,
					status: "failure",
					notificationText: "an error occured, please try again",
				}));
			}
		}
	};

	useEffect(() => {
		getFeeSetup();
	}, []);

	return (
		<div className="font-circular-std">
			<Notification
				notificationText={generalStates.notificationText}
				status={generalStates.status}
			/>

			<Breadcrumb
				firstLayer="Fee Setup"
				secondLayer="Edit Setup"
				firstLayerLink="/app/admin/fee-setup"
			/>

			<div className="mt-11 rounded-lg pt-6 h-full  bg-other-background">
				<h3 className="pb-4 pl-10 text-black-secondary text-lg font-medium">
					Complete the form below
				</h3>
				<hr className="w-full" />
				{/* <div className=" pl-10 pr-28"> */}
				<div className="">
					<div className="p-10 flex justify-between">
						<FormInput
							label="Vendor Name"
							className="w-full md:w-[20rem] h-12"
							type="text"
							name="vendorName"
							//onChange={handleFeeInfoChange}
							value={feeInfo.vendorName || ""}
							readOnly
						/>

						<FormInput
							label="Telco Name"
							className="w-full md:w-[20rem] h-12"
							type="text"
							name="telcoName"
							//onChange={handleFeeInfoChange}
							value={feeInfo.telcoName || ""}
							readOnly
						/>
					</div>
					<div className="p-10 flex justify-around">
						<FormInput
							label="Charge type"
							className="w-full md:w-[20rem] h-12"
							name= "chargeType"
							type = "text"
						//	options={feeInfo.chargeOptions}
						//	onChange={handleChargeType}
							value={feeInfo.chargeTypeValue}
							readOnly
						/>

						<FormInput
							label="Value"
							className="w-full md:w-[20rem] h-12"
							type="number"
							name="value"
							onChange={handleFeeInfoChange}
							value={feeInfo.value || ""}
							readOnly
						/>
						<FormInput
							label="Vendor share (%)"
							className="w-full md:w-[20rem] h-12"
							type="number"
							name="vendorShare"
							onChange={handleFeeInfoChange}
							value={feeInfo.vendorShare || ""}
							readOnly
						/>
					</div>
					<div className="p-10 flex justify-around">
						<FormInput
							label="Bank share (%)"
							className="w-full md:w-[20rem] h-12"
							type="number"
							name="bankShare"
							onChange={handleFeeInfoChange}
							value={feeInfo.bankShare || ""}
							readOnly
						/>
						<FormInput
							label="Telco share (%)"
							className="w-full md:w-[20rem] h-12"
							type="number"
							name="telcoShare"
							onChange={handleFeeInfoChange}
							value={feeInfo.telcoShare || ""}
							readOnly
						/>
						<FormInput
							label="Telco Suspense Account (Data)"
							className="w-full md:w-[20rem] h-12"
							type="text"
							name="dataSuspenseAccount"
							onChange={handleFeeInfoChange}
							value={feeInfo.dataSuspenseAccount || ""}
							maxLength={16}
							readOnly
						/>
					</div>
					<div className="p-10 flex justify-around">
						<FormInput
							label="Telco Suspense Account (Airtime)"
							className="w-full md:w-[20rem] h-12"
							type="text"
							name="airtimeSuspenseAccount"
							onChange={handleFeeInfoChange}
							value={feeInfo.airtimeSuspenseAccount || ""}
							maxLength={16}
							readOnly
						/>

						<FormInput
							label="Bank Income Account"
							className="w-full md:w-[20rem] h-12"
							type="text"
							name="bankAccount"
							onChange={handleFeeInfoChange}
							value={feeInfo.bankAccount || ""}
							maxLength={16}
							readOnly
						/>

						<FormInput
							label="Vendor Income Account"
							className="w-full md:w-[20rem] h-12"
							type="text"
							name="vendorAccount"
							onChange={handleFeeInfoChange}
							value={feeInfo.vendorAccount || ""}
							maxLength={16}
							readOnly
						/>
					</div>
					<div className="ml-10 mt-9">
						<Button
							onClick={modifyFee}
							className="newfee-button"
							isLoading={generalStates.isLoading}
							disabled={generalStates.disabled}
						>
							Update
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default EditFeeSetup;
