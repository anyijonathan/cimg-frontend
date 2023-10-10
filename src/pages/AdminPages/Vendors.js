import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import FormSelect from "../../components/FormSelect";
import Searchbar from "../../components/Searchbar";
import Status from "../../components/Status";
import { Pagination } from "@windmill/react-ui";
import CreateModal from "../../components/Modals/CreateModal";
import ActionModal from "../../components/Modals/ActionModal";
import Notification from "../../components/Notification";
import { StatusOption } from "../../utils/constants";
import {
	addVendor,
	editVendor,
	getAllVendors,
	enableVendor,
	disableVendor,
	archiveVendor,
	unArchiveVendor,
	getAllActiveVendors,
	getAllInactiveVendors,
	getAllPendingVendors,
	getAllArchivedVendors,
	getVendorInfo,
} from "../../Redux/Slices/vendorSlice";
import { encryptEcb, filterHelper } from "../../utils/HelperFunction";
import { getVendor } from "../../Redux/Slices/vendorSlice";
import { userSelector } from "../../Redux/Slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import Table from "./Table";

const Vendors = () => {
	const history = useHistory();
	const dispatch = useDispatch();

	const { emailAddress, userRole } = useSelector(userSelector);

	const [generalStates, setGeneralStates] = useState({
		isCreateModalOpen: false,
		isActionModalOpen: false,
		actionReceiver: "",
		actionType: "",
		modalHeader: "Add Vendor",
		notificationText: "",
		status: "",
		isLoading: false,
		buttonText: "Add vendor",
		disabled: false,
	});

	const [page, setPage] = useState(1);
	const [data, setData] = useState([]);
	const [vendorList, setVendorList] = useState([]);
	const [id, setId] = useState(null);
	const [vendorInfo, setVendorInfo] = useState({
		vendorName: "",
		description: "",
	});
	const [userId, setUserId] = useState(null);
	const [hidePagination, setHidePagination] = useState(false);

	function openCreateModal() {
		setGeneralStates((prevState) => ({
			...prevState,
			isCreateModalOpen: true,
		}));
		resetVendorForm();
	}

	function closeCreateModal() {
		setGeneralStates((prevState) => ({
			...prevState,
			isCreateModalOpen: false,
		}));
	}

	async function openEditModal(id, vendorTag) {
		setUserId(id);

		setGeneralStates((prevState) => ({
			...prevState,
			isCreateModalOpen: true,
			modalHeader: "Edit Vendor",
			buttonText: "Edit Vendor",
			setStatus: "success",
			setNotificationText: "Fetching Vendor info...",
		}));

		try {
			let responseData = await getVendorInfo(
				vendorTag,
				emailAddress,
				userRole
			);

			setVendorInfo((prevState) => ({
				...prevState,
				vendorName: responseData.data.vendorName,
				description: responseData.data.vendorDescription,
			}));
		} catch (error) {
			setGeneralStates((prevState) => ({
				...prevState,
				status: "failure",
				notificationText:
					"couldn't get Vendor Info, kindly refresh page",
			}));
		}

		// resetVendorForm();
	}

	function openEnableVendorModal(id) {
		setUserId(id);

		setGeneralStates((prevState) => ({
			...prevState,
			actionType: "enable",
			actionReceiver: "vendor",
			isActionModalOpen: true,
		}));
	}

	function openDisableVendorModal(id) {
		setUserId(id);

		setGeneralStates((prevState) => ({
			...prevState,
			actionType: "disable",
			actionReceiver: "vendor",
			isActionModalOpen: true,
		}));
	}

	function openArchiveVendorModal(id) {
		setUserId(id);

		setGeneralStates((prevState) => ({
			...prevState,
			actionType: "archive",
			actionReceiver: "vendor",
			isActionModalOpen: true,
		}));
	}

	function openUnarchiveVendorModal(id) {
		setUserId(id);
		setGeneralStates((prevState) => ({
			...prevState,
			actionType: "unarchive",
			actionReceiver: "vendor",
			isActionModalOpen: true,
		}));
	}

	function closeActionModal() {
		setGeneralStates((prevState) => ({
			...prevState,
			isActionModalOpen: false,
		}));
	}

	// GETTING USER LIST ON PAGE LOAD
	const fetchVendorList = async (vendorList) => {
		try {
			let responseData = await vendorList;

			setVendorList(responseData.dataList);
			setData(
				responseData.dataList.slice(
					(page - 1) * resultsPerPage,
					page * resultsPerPage
				)
			);
		} catch (error) {
			setGeneralStates((prevState) => ({
				...prevState,
				setStatus: "failure",
				setNotificationText:
					"couldn't fetch User list, kindly refresh page",
			}));
		}
	};

	useEffect(() => {
		fetchVendorList(getAllVendors(emailAddress, userRole));
	}, [page]);

	const resultsPerPage = 5;
	const totalResults = vendorList.length;

	// pagination change control
	function onPageChange(p) {
		setPage(p);
	}

	const handleVendorInfoChange = (e) => {
		const { value } = e.target;
		setVendorInfo({
			...vendorInfo,
			[e.target.name]: value,
		});
	};

	// FUNCTION TO RESET VENDOR FORM FIELDS TO EMPTY STRING
	const resetVendorForm = () => {
		setVendorInfo((prevState) => ({
			...prevState,
			vendorName: "",
			description: "",
		}));
	};

	// FUNCTION HANDLING NEW VENDOR CREATION
	async function createVendor() {
		let encryptedVendorName = encryptEcb(
			vendorInfo.vendorName,
			process.env.REACT_APP_AES_KEY
		);
		let encryptedVendorDescription = encryptEcb(
			vendorInfo.description,
			process.env.REACT_APP_AES_KEY
		);

		const data = {
			vendorName: encryptedVendorName,
			description: encryptedVendorDescription,
			approvedStatus: 2, //default approvedStatus for new vendor is 2 i.e inactive
		};

		if (!vendorInfo.vendorName || !vendorInfo.description) {
			setGeneralStates((prevState) => ({
				...prevState,
				status: "failure",
				notificationText: "All fields are required",
			}));
			setTimeout(() => {
				setGeneralStates((prevState) => ({
					...prevState,
					status: "",
					notificationText: "",
					disabled: false,
					isLoading: false,
					buttonText: "Add vendor",
				}));
			}, 4000);
			return;
		}

		try {
			setGeneralStates((prevState) => ({
				...prevState,
				disabled: true,
				isLoading: true,
				buttonText: "creating new vendor...",
			}));

			const responseData = await addVendor(data, emailAddress, userRole);
			if (responseData.code === "00") {
				setGeneralStates((prevState) => ({
					...prevState,
					isCreateModalOpen: false,
					status: "success",
					notificationText: "Vendor added successfully",
				}));
				resetVendorForm();
				setTimeout(() => {
					setGeneralStates((prevState) => ({
						...prevState,
						status: "",
						notificationText: "",
						disabled: false,
						isLoading: false,
						buttonText: "Add vendor",
					}));
					fetchVendorList(getAllVendors(emailAddress, userRole));
				}, 4000);
			} else {
				setGeneralStates((prevState) => ({
					...prevState,
					isCreateModalOpen: false,
					status: "failure",
					notificationText: responseData.description,
				}));

				setTimeout(() => {
					setGeneralStates((prevState) => ({
						...prevState,
						status: "",
						notificationText: "",
						disabled: false,
						isLoading: false,
						buttonText: "Add vendor",
					}));
					fetchVendorList(getAllVendors(emailAddress, userRole));
				}, 4000);
			}
		} catch (error) {
			setGeneralStates((prevState) => ({
				...prevState,
				status: "failure",
				notificationText: error,
			}));
		}
	}

	// FUNCTION HANDLING EDIT VENDOR
	async function editCreatedVendor(id) {
		const data = {
			id: id,
			vendorName: vendorInfo.vendorName,
			description: vendorInfo.description,
			approvedStatus: 2, //default approvedStatus for new vendor is 2
		};

		try {
			setGeneralStates((prevState) => ({
				...prevState,
				disabled: true,
				isLoading: false,
				buttonText: "saving changes...",
			}));

			const responseData = await editVendor(data, emailAddress, userRole);
			if (responseData.code === "00") {
				setGeneralStates((prevState) => ({
					...prevState,
					isCreateModalOpen: false,
					status: "success",
					notificationText: "Vendor edited successfully",
				}));
				resetVendorForm();

				setTimeout(() => {
					setGeneralStates((prevState) => ({
						...prevState,
						status: "",
						notificationText: "",
						disabled: false,
						isLoading: false,
						buttonText: "Edit Vendor",
					}));
					fetchVendorList(getAllVendors(emailAddress, userRole));
				}, 2000);
			} else {
				setGeneralStates((prevState) => ({
					...prevState,
					isCreateModalOpen: false,
					status: "failure",
					notificationText: responseData.description,
				}));
				resetVendorForm();

				setTimeout(() => {
					setGeneralStates((prevState) => ({
						...prevState,
						status: "",
						notificationText: "",
						disabled: false,
						isLoading: false,
						buttonText: "Edit Vendor",
					}));
					fetchVendorList(getAllVendors(emailAddress, userRole));
				}, 2000);
			}
		} catch (error) {
			setGeneralStates((prevState) => ({
				...prevState,
				status: "failure",
				notificationText: error,
			}));
		}
	}

	// FUNCTION HANDLING ENABLE VENDOR
	async function enableCreatedVendor(id) {
		try {
			setGeneralStates((prevState) => ({
				...prevState,
				isActionModalOpen: false,
				status: "success",
				notificationText: `${generalStates.actionReceiver} ${generalStates.actionType}d successfully`,
			}));

			const responseData = await enableVendor(id, emailAddress, userRole);

			setTimeout(() => {
				setGeneralStates((prevState) => ({
					...prevState,
					status: "",
				}));
			}, 2000);

			fetchVendorList(getAllVendors());
		} catch (error) {
			setGeneralStates((prevState) => ({
				...prevState,
				status: "failure",
				notificationText: error,
			}));
		}
	}

	// FUNCTION HANDLING DISABLE VENDOR
	async function disableCreatedVendor(id) {
		try {
			setGeneralStates((prevState) => ({
				...prevState,
				isActionModalOpen: false,
				status: "success",
				notificationText: `${generalStates.actionReceiver} ${generalStates.actionType}d successfully`,
			}));

			const responseData = await disableVendor(
				id,
				emailAddress,
				userRole
			);

			setTimeout(() => {
				setGeneralStates((prevState) => ({
					...prevState,
					status: "",
				}));
			}, 2000);

			fetchVendorList(getAllVendors());
		} catch (error) {
			setGeneralStates((prevState) => ({
				...prevState,
				status: "failure",
				notificationText: error,
			}));
		}
	}

	// FUNCTION HANDLING ARCHIVE VENDOR
	async function archiveCreatedVendor(id) {
		try {
			setGeneralStates((prevState) => ({
				...prevState,
				isActionModalOpen: false,
				status: "success",
				notificationText: `${generalStates.actionReceiver} ${generalStates.actionType}d successfully`,
			}));

			const responseData = await archiveVendor(
				id,
				emailAddress,
				userRole
			);

			setTimeout(() => {
				setGeneralStates((prevState) => ({
					...prevState,
					status: "",
				}));
			}, 2000);

			fetchVendorList(getAllVendors());
		} catch (error) {
			setGeneralStates((prevState) => ({
				...prevState,
				status: "failure",
				notificationText: error,
			}));
		}
	}

	// FUNCTION HANDLING UNARCHIVE VENDOR
	async function unArchiveCreatedVendor(id) {
		try {
			setGeneralStates((prevState) => ({
				...prevState,
				isActionModalOpen: false,
				status: "success",
				notificationText: `${generalStates.actionReceiver} ${generalStates.actionType}d successfully`,
			}));

			const responseData = await unArchiveVendor(
				id,
				emailAddress,
				userRole
			);

			setTimeout(() => {
				setGeneralStates((prevState) => ({
					...prevState,
					status: "",
				}));
			}, 2000);

			fetchVendorList(getAllVendors());
		} catch (error) {
			setGeneralStates((prevState) => ({
				...prevState,
				status: "failure",
				notificationText: error,
			}));
		}
	}

	//FUNCTION TO SELECT CREATE MODAL FUNCTION
	const createModalFunction = async (id) => {
		if (generalStates.modalHeader === "Edit Vendor") {
			await editCreatedVendor(id);
		} else if (generalStates.modalHeader === "Add Vendor") {
			await createVendor();
		}
	};

	//FUNCTION TO SELECT ACTION MODAL FUNCTION
	const actionModalFunction = async (id) => {
		if (generalStates.actionType === "enable") {
			await enableCreatedVendor(id);
		} else if (generalStates.actionType === "disable") {
			await disableCreatedVendor(id);
		} else if (generalStates.actionType === "archive") {
			await archiveCreatedVendor(id);
		} else if (generalStates.actionType === "unarchive") {
			await unArchiveCreatedVendor(id);
		}
	};

	// FUNCTION TO FILTER VENDOR LISt by SEARCH iNPUT

	const filterVendorList = (searchFieldValue) => {
		let filteredResult = filterHelper(vendorList, searchFieldValue);

		if (searchFieldValue !== "") {
			setData(filteredResult);
			setHidePagination(true);
		} else if (searchFieldValue === "") {
			setHidePagination(false);
			fetchVendorList(getAllVendors());
		}
	};

	// HANDLING SELECT FILTER BY VENDOR STATUS (ACTIVE, INACTIVE ETC)
	const handleSelectFilter = (e) => {
		const { value } = e.target;

		if (value === "") {
			fetchVendorList(getAllVendors());
		} else if (value === "active") {
			fetchVendorList(getAllActiveVendors());
		} else if (value === "inactive") {
			fetchVendorList(getAllInactiveVendors());
		} else if (value === "pending") {
			fetchVendorList(getAllPendingVendors());
		} else if (value === "archived") {
			fetchVendorList(getAllArchivedVendors());
		}
	};

	const viewVendorInfo = async (vendorTag) => {
		try {
			setGeneralStates((prevState) => ({
				...prevState,
				status: "success",
				notificationText: "getting vendor info, please wait...",
			}));

			history.push("/app/vendors/vendor-info");
			let responseData = await getVendorInfo(
				vendorTag,
				emailAddress,
				userRole
			);
			dispatch(getVendor(responseData));
			setGeneralStates((prevState) => ({
				...prevState,
				status: "",
				notificationText: "",
			}));
		} catch (error) {
			setGeneralStates((prevState) => ({
				...prevState,
				status: "failure",
				notificationText:
					"couldn't get Vendor Info, kindly refresh page",
			}));
		}
	};

	return (
		<div className="font-circular-std">
			<Notification
				notificationText={generalStates.notificationText}
				status={generalStates.status}
			/>
			{/* ---------------------------------------------- Modals ------------------------------------------- */}
			<CreateModal
				label="Vendor Name"
				onClose={closeCreateModal}
				show={generalStates.isCreateModalOpen}
				modalHeader={generalStates.modalHeader}
				placeholderLabel="Description"
				buttonText={generalStates.buttonText}
				placeholderDescription="Enter description"
				modalAction={() => createModalFunction(userId)}
				onFormChange={handleVendorInfoChange}
				onTextAreaChange={handleVendorInfoChange}
				isLoading={generalStates.isLoading}
				disabled={generalStates.disabled}
				inputName="vendorName"
				textareaName="description"
				inputValue={vendorInfo.vendorName}
				textAreaValue={vendorInfo.description}
			/>
			<ActionModal
				onClose={closeActionModal}
				show={generalStates.isActionModalOpen}
				modalClose={closeActionModal}
				actionReceiver={generalStates.actionReceiver}
				actionType={generalStates.actionType}
				modalAction={() => actionModalFunction(userId)}
				objectId={id}
			/>
			{/*   ------------------------------------------- Modals ----------------------------------------------------  */}

			<h2 className="text-xl font-bold text-black-secondary pb-9">
				Manage Vendors
			</h2>
			<div className="col-span-6 h-[27.1875rem]">
				<div className="flex justify-between w-full bg-white h-[4.8125rem] items-center px-6">
					<div className="flex">
						<Searchbar
							onChange={(e) => {
								e.preventDefault();
								filterVendorList(e.target.value);
							}}
							placeholder="search vendor"
						/>
					</div>
					<div className="items-end">
						<div className="flex">
							<FormSelect
								className="bg-gray-50 border border-none text-black-70 text-sm rounded-lg outline-none focus:border-white focus:ring-white block mt-2  h-11/12"
								options={StatusOption}
								onChange={handleSelectFilter}
							/>
							<button
								onClick={openCreateModal}
								className="p-3 border border-purple-secondary rounded font-circular-std outline-none focus:border-purple-secondary focus:ring-purple-200 ease-in-out duration-150"
							>
								<p className="linear-gradient-text text-sm font-normal">
									Add new vendor
								</p>
							</button>
						</div>
					</div>
				</div>
				<Table
					data={data}
					openEditModal={openEditModal}
					openEnableModal={openEnableVendorModal}
					openDisableModal={openDisableVendorModal}
					openArchiveModal={openArchiveVendorModal}
					openUnarchiveModal={openUnarchiveVendorModal}
					viewInfo={viewVendorInfo}
					hidePagination={hidePagination}
					totalResults={totalResults}
					resultsPerPage={resultsPerPage}
					onPageChange={onPageChange}
					name="Vendor"
					onClick={openEditModal}
				/>
			</div>
		</div>
	);
};

export default Vendors;
