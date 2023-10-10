import React, { useEffect, useState } from "react";
import {
	CreateVendorTelcoMap,
	getAllApprovedMapping,
	setApprovedList,
	SwitchTelcoToVendor,
} from "../../Redux/Slices/mappingSlice";
import { userSelector } from "../../Redux/Slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import Notification from "../../components/Notification";
import Searchbar from "../../components/Searchbar";
import FormSelect from "../../components/FormSelect";
import FormInput from "../../components/FormInput";
import { Modal } from "flowbite-react";
import { getAllActiveVendors } from "../../Redux/Slices/vendorSlice";
import { getAllActiveTelcos } from "../../Redux/Slices/telcoSlice";
import Button from "../../components/Button";
import { Pagination } from "@windmill/react-ui";
import Status from "../../components/Status";

const VendorTelco = () => {
	let telcoType = [
		{
			id: 0,
			value: "",
			name: "Select Telco",
		},
	];

	let vendorType = [
		{
			id: 0,
			value: "",
			name: "Select Vendor",
		},
	];

	const dispatch = useDispatch();
	const { emailAddress, userRole } = useSelector(userSelector);

	let ListState = useSelector((state) => {
		return state["mapping"];
	});

	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
	const [notificationText, setNotificationText] = useState("");
	const [status, setStatus] = useState("");
	const [mappingList, setMappingList] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [disabled, setDisabled] = useState(false);

	const [vendorOptions, setVendorOptions] = useState(vendorType);
	const [telcoOptions, setTelcoOptions] = useState(telcoType);
	const [vendorId, setVendorId] = useState();
	const [telcoId, setTelcoId] = useState();
	const [telcoName, setTelcoName] = useState("");

	const [data, setData] = useState([]);

	const [hidePagination, setHidePagination] = useState(false);

	const [page, setPage] = useState(1);

	function openMapModal() {
		setVendorId("");
		setTelcoId("");
		setIsCreateModalOpen(true);
	}

	function closeMapModal() {
		setIsCreateModalOpen(false);
	}

	function openUpdateModal(id, telcoName) {
		setIsUpdateModalOpen(true);
		setTelcoId(id);
		setTelcoName(telcoName);
	}

	function closeUpdateModal() {
		setIsUpdateModalOpen(false);
	}

	const handleVendorChange = (e) => {
		let { value } = e.target;
		setVendorId(value);
	};

	const handleTelcoChange = (e) => {
		let { value } = e.target;
		setTelcoId(value);
	};

	const createMap = async () => {
		const data = {
			telcoId: telcoId,
			vendorId: vendorId,
		};

		if (!telcoId || !vendorId) {
			setStatus("failure");
			setNotificationText("All select fields are required");
			setTimeout(() => {
				setStatus("");
				setNotificationText("");
			}, 4000);
			return;
		}
		try {
			setDisabled(true);
			setIsLoading(true);

			let response = await CreateVendorTelcoMap(
				data,
				emailAddress,
				userRole
			);
			if (response.code === "00") {
				setStatus("success");
				setNotificationText(
					"Telco/vendor map created successfully and sent to admin for approval"
				);
				setDisabled(false);
				setIsLoading(false);
				setIsCreateModalOpen(false);

				setTimeout(() => {
					setStatus("");
					setNotificationText("");
					setVendorId("");
					setTelcoId("");
				}, 3000);
			} else {
				setStatus("failure");
				setNotificationText(response.description);
				setDisabled(false);
				setIsLoading(false);

				setTimeout(() => {
					setStatus("");
					setNotificationText("");
				}, 3000);
			}
		} catch (error) {
			setDisabled(false);
			setIsLoading(false);
			setStatus("failure");
			setNotificationText("an error occured, please try again");
		}
	};

	const switchVendor = async () => {
		const data = {
			telcoId: telcoId,
			vendorId: vendorId,
		};
		try {
			setDisabled(true);
			setIsLoading(true);

			if (!telcoId || !vendorId) {
				setStatus("failure");
				setNotificationText("Please select a vendor");
				setDisabled(false);
				setIsLoading(false);

				setTimeout(() => {
					setStatus("");
					setNotificationText("");
				}, 3000);
				return;
			}

			let response = await SwitchTelcoToVendor(
				data,
				emailAddress,
				userRole
			);
			console.log(response);
			setStatus("success");
			setNotificationText(
				"vendor switch successful and sent to admin for approval"
			);
			setDisabled(false);
			setIsLoading(false);
			setIsUpdateModalOpen(false);

			getCurrentMappings();

			setTimeout(() => {
				setStatus("");
				setNotificationText("");
				setVendorId("");
				setTelcoId("");
			}, 4000);
		} catch (error) {
			console.log(error);
			setDisabled(false);
			setIsLoading(false);
			setStatus("failure");
			setNotificationText("an error occured, please try again");
		}
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
				newOptions.value = vendor.id;
				newVendorOptions.push(newOptions);
				newOptions = {};
				return newVendorOptions;
			});
			setVendorOptions(newVendorOptions);
		} catch (error) {
			setStatus("failure");
			setNotificationText("error fetching vendor list");
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
				newOptions.value = telco.id;
				newTelcoOptions.push(newOptions);
				newOptions = {};
				return newTelcoOptions;
			});
			setTelcoOptions(newTelcoOptions);
		} catch (error) {
			setStatus("failure");
			setNotificationText("error fetching telco list");
		}
	};

	const getCurrentMappings = async () => {
		try {
			const response = await getAllApprovedMapping(
				emailAddress,
				userRole
			);

			if (response.code === "00") {
				setMappingList(response.dataList);
				setData(
					response.dataList.slice(
						(page - 1) * resultsPerPage,
						page * resultsPerPage
					)
				);

				// dispatch(setApprovedList(response.dataList));
			} else {
				setStatus("failure");
				setNotificationText("error fetching current mappings");
			}
		} catch (error) {}
	};

	useEffect(() => {
		getCurrentMappings();
		fetchVendorList();
		fetchTelcoList();
	}, [page]);

	const resultsPerPage = 5;
	const totalResults = mappingList.length;

	// pagination change control
	function onPageChange(p) {
		setPage(p);
	}

	return (
		<div className="font-circular-std">
			<Notification notificationText={notificationText} status={status} />

			{/* ---------------------------------------------- Modals ------------------------------------------- */}
			<Modal
				show={isCreateModalOpen}
				onClose={closeMapModal}
				popup="true"
				size="lg"
				position="center"
			>
				<Modal.Header>
					<div className="p-6">
						<h3 className="w-[90%] text-lg font-bold text-black-secondary">
							Create a new mapping
						</h3>
					</div>
					<div className="md:w-[27.75rem] pb-10">
						<hr />
					</div>
				</Modal.Header>

				<Modal.Body>
					<div className="space-y-6">
						<FormSelect
							className="w-full md:w-[27.25rem] h-12"
							label="Select a Telco"
							onChange={handleTelcoChange}
							options={telcoOptions}
							value={telcoId}
						/>
						<FormSelect
							className="w-full md:w-[27.25rem] h-12"
							label="Select a Vendor"
							onChange={handleVendorChange}
							options={vendorOptions}
							value={vendorId}
						/>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<div className="flex justify-between w-full">
						<Button
							isLoading={isLoading}
							disabled={disabled}
							onClick={createMap}
						>
							Create Mapping
						</Button>
					</div>
				</Modal.Footer>
			</Modal>

			{/* ------------------------------------------------------------------------------------------------------------------------------- */}

			<Modal
				show={isUpdateModalOpen}
				onClose={closeUpdateModal}
				popup={true}
				size="lg"
				position="center"
			>
				<Modal.Header>
					<div className="p-6">
						<h3 className="w-[90%] text-lg font-bold text-black-secondary">
							Update Mapping
						</h3>
					</div>
					<div className="md:w-[27.75rem] pb-10">
						<hr />
					</div>
				</Modal.Header>

				<Modal.Body>
					<div className="space-y-6">
						<FormInput
							className="w-full md:w-[27.25rem] h-12 mb-12 text-black-40"
							label="Telco Name"
							value={telcoName || ""}
							readOnly
						/>

						<FormSelect
							className="w-full md:w-[27.25rem] h-12 mt-4"
							label="Select a Vendor"
							value={vendorId}
							onChange={handleVendorChange}
							options={vendorOptions}
						/>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<div className="flex justify-between w-full">
						<Button
							isLoading={isLoading}
							disabled={disabled}
							onClick={switchVendor}
						>
							Update Mapping
						</Button>
					</div>
				</Modal.Footer>
			</Modal>

			{/*   ------------------------------------------- Modals ----------------------------------------------------  */}

			<h2 className="text-xl font-bold text-black-secondary pb-9">
				Telco/Vendor Mapping
			</h2>
			<div className="col-span-6 h-[27.1875rem]">
				<div className="flex justify-between w-full bg-white h-[4.8125rem] items-center px-6">
					{/* <div className='flex'>
							<Searchbar placeholder= "search vendor" />
						</div>  */}
					<div className="w-full">
						<div className="flex justify-end pr-4">
							<button
								onClick={openMapModal}
								className="p-3 border border-purple-secondary rounded font-circular-std outline-none focus:border-purple-secondary focus:ring-purple-200 ease-in-out duration-150"
							>
								<p className="linear-gradient-text text-sm font-normal">
									Create a new mapping
								</p>
							</button>
						</div>
					</div>
				</div>
				<div className="overflow-x-auto relative bg-white pl-6 pr-14 pb-2 rounded-lg">
					<table className="w-full text-sm text-left">
						<thead className="text-sm text-black-primary bg-dashboard-background">
							<tr>
								<th scope="col" className="py-3 px-6">
									Telco name
								</th>
								<th scope="col" className="py-3 px-6">
									Vendor
								</th>
								{/* <th scope="col" className="py-3 px-6">
									Status
								</th> */}
								<th scope="col" className="py-3 px-6">
									Actions
								</th>
							</tr>
						</thead>
						<tbody>
							{data.map((mapping, i) => (
								<tr
									key={i}
									className="bg-white border-b py-4 px-6"
								>
									<td className="py-6 px-6 font-sm text-black-secondary whitespace-nowrap">
										{mapping.telcoName}
									</td>
									<td className="py-6 px-6 text-black-secondary">
										{mapping.vendorName}
									</td>
									{/* <td className="py-6 px-6 text-black-secondary">
										{mapping.approvedStatus === 0 && (
											<Status pending />
										)}
										{mapping.approvedStatus === 1 && (
											<Status active />
										)}
										{mapping.approvedStatus === 2 && (
											<Status inactive />
										)}
										{mapping.approvedStatus === 4 && (
											<Status archived />
										)}
									</td> */}
									<td className="py-6 px-6 text-red-primary">
										<button
											className="w-32 h-11 p-3 border border-purple-secondary rounded font-circular-std outline-none focus:border-purple-secondary focus:ring-purple-200 ease-in-out duration-150"
											onClick={() => {
												openUpdateModal(
													mapping.telcoId,
													mapping.telcoName
												);
											}}
										>
											<p className="linear-gradient-text text-sm font-normal">
												Update
											</p>
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
					{hidePagination === false && (
						<Pagination
							totalResults={totalResults}
							resultsPerPage={resultsPerPage}
							label="Table navigation"
							onChange={onPageChange}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default VendorTelco;
