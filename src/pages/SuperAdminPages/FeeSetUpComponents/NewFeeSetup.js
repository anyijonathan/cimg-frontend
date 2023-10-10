import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Breadcrumb from "../../../components/Breadcrumb";
import Button from "../../../components/Button";
import FormInput from "../../../components/FormInput";
import FormSelect from "../../../components/FormSelect";
import FormSelectWithId from "../../../components/FormSelectWithId";
import Notification from "../../../components/Notification";
import { userSelector } from "../../../Redux/Slices/authSlice";
import { CreateFeeSetup } from "../../../Redux/Slices/feeSetUpSlice";
import { getAllActiveTelcos } from "../../../Redux/Slices/telcoSlice";
import { getAllActiveVendors } from "../../../Redux/Slices/vendorSlice";
import { encryptEcb } from "../../../utils/HelperFunction";

const NewFeeSetup = () => {
	const { emailAddress, userRole } = useSelector(userSelector);

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
		chargeType: "",
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
		disabled: false,
	});

	const handleFeeInfoChange = (e) => {
		const { value } = e.target;
		setFeeInfo({
			...feeInfo,
			[e.target.name]: value,
		});
	};

	const handleVendorChange = (e) => {
		const { value } = e.target;
		setFeeInfo({
			...feeInfo,
			vendorName: value.split("#")[0],
			vendorId: value.split("#")[1],
		});
	};

	const handleTelcoChange = (e) => {
		const { value } = e.target;
		setFeeInfo({
			...feeInfo,
			telcoName: value.split("#")[0],
			telcoId: value.split("#")[1],
		});
	};

	const handleChargeType = (e) => {
		const { value } = e.target;
		setFeeInfo({
			...feeInfo,
			chargeType: value,
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

	useEffect(() => {
		fetchTelcoList();
		fetchVendorList();
	}, []);

	const createFee = async () => {
		let encryptedAirtimeSuspenseAccount = encryptEcb(
			feeInfo.airtimeSuspenseAccount,
			process.env.REACT_APP_AES_KEY
		);

		let encryptedDataSuspenseAccount = encryptEcb(
			feeInfo.dataSuspenseAccount,
			process.env.REACT_APP_AES_KEY
		);

		let encryptedBankAccount = encryptEcb(
			feeInfo.bankAccount,
			process.env.REACT_APP_AES_KEY
		);

		let encryptedVendorAccount = encryptEcb(
			feeInfo.vendorAccount,
			process.env.REACT_APP_AES_KEY
		);

		const data = {
			telcoId: feeInfo.telcoId,
			vendorId: feeInfo.vendorId,
			telcoName: feeInfo.telcoName,
			vendorName: feeInfo.vendorName,
			value: feeInfo.value,
			fcmbRate: feeInfo.bankShare,
			telcoRate: feeInfo.telcoShare,
			vendorRate: feeInfo.vendorShare,
			telcoSuspenseAirtimeAccount: encryptedAirtimeSuspenseAccount,
			telcoSuspenseDataAccount: encryptedDataSuspenseAccount,
			fcmbIncomeAccount: encryptedBankAccount,
			vendorIncomeAccount: encryptedVendorAccount,
			chargeType: feeInfo.chargeType,
		};

		if (
			data.telcoName === "" ||
			data.vendorName === "" ||
			data.value === "" ||
			data.fcmbRate === "" ||
			data.telcoRate === "" ||
			data.vendorRate === "" ||
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

				let response = await CreateFeeSetup(
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

	return (
		<div className="font-circular-std">
			<Notification
				notificationText={generalStates.notificationText}
				status={generalStates.status}
			/>

			<Breadcrumb
				firstLayer="Fee Setup"
				secondLayer="New Setup"
				firstLayerLink="/app/admin/fee-setup"
			/>

			{/* <div className="mt-11 rounded-lg pt-6  md:h-[48.75rem] bg-other-background"> */}
			<div className="mt-11 rounded-lg pt-6 h-full  bg-other-background">
				<h3 className="pb-4 pl-10 text-black-secondary text-lg font-medium">
					Complete the form below
				</h3>
				<hr className="w-full" />
				{/* <div className=" pl-10 pr-28"> */}
				<div className="">
					<div className="p-10 flex justify-between">
						<FormSelectWithId
							label="Vendor name"
							className="w-full md:w-[27.5rem] h-12"
							options={feeInfo.vendorOptions}
							onChange={handleVendorChange}
						/>
						<FormSelectWithId
							label="Telco name"
							className="w-full md:w-[27.5rem] h-12"
							options={feeInfo.telcoOptions}
							onChange={handleTelcoChange}
						/>
					</div>
					<div className="p-10 flex justify-around">
						<FormSelect
							label="Charge type"
							className="w-full md:w-[20rem] h-12"
							options={feeInfo.chargeOptions}
							onChange={handleChargeType}
						/>

						<FormInput
							label="Value"
							className="w-full md:w-[20rem] h-12"
							type="number"
							name="value"
							onChange={handleFeeInfoChange}
						/>
						<FormInput
							label="Vendor share (%)"
							className="w-full md:w-[20rem] h-12"
							type="number"
							name="vendorShare"
							onChange={handleFeeInfoChange}
						/>
					</div>
					<div className="p-10 flex justify-around">
						<FormInput
							label="Bank share (%)"
							className="w-full md:w-[20rem] h-12"
							type="number"
							name="bankShare"
							onChange={handleFeeInfoChange}
						/>
						<FormInput
							label="Telco share (%)"
							className="w-full md:w-[20rem] h-12"
							type="number"
							name="telcoShare"
							onChange={handleFeeInfoChange}
						/>
						<FormInput
							label="Telco Suspense Account (Data)"
							className="w-full md:w-[20rem] h-12"
							type="text"
							name="dataSuspenseAccount"
							onChange={handleFeeInfoChange}
							maxLength={16}
						/>
					</div>
					<div className="p-10 flex justify-around">
						<FormInput
							label="Telco Suspense Account (Airtime)"
							className="w-full md:w-[20rem] h-12"
							type="text"
							name="airtimeSuspenseAccount"
							onChange={handleFeeInfoChange}
							maxLength={16}
						/>

						<FormInput
							label="Bank Income Account"
							className="w-full md:w-[20rem] h-12"
							type="text"
							name="bankAccount"
							onChange={handleFeeInfoChange}
							maxLength={16}
						/>

						<FormInput
							label="Vendor Income Account"
							className="w-full md:w-[20rem] h-12"
							type="text"
							name="vendorAccount"
							onChange={handleFeeInfoChange}
							maxLength={16}
						/>
					</div>

					<div className="ml-10 mt-9">
						<Button
							onClick={createFee}
							className="newfee-button"
							isLoading={generalStates.isLoading}
							disabled={generalStates.disabled}
						>
							Submit
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NewFeeSetup;
