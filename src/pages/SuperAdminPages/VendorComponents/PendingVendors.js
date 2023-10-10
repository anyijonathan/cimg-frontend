import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Searchbar from "../../../components/Searchbar";
import Status from "../../../components/Status";
import { Pagination } from "@windmill/react-ui";
import CreateModal from "../../../components/Modals/CreateModal";
import ActionModal from "../../../components/Modals/ActionModal";
import Notification from "../../../components/Notification";
import {
	addVendor,
	editVendor,
	enableVendor,
	disableVendor,
	getVendorInfo,
	getAllPendingVendors,
	approveCreatedVendor,
	declineCreatedVendor,
	setPendingVendorsList,
	setApprovedVendorsList,
	getAllActiveVendors,
	setDeclinedVendorsList,
	getAllArchivedVendors,
} from "../../../Redux/Slices/vendorSlice";
import { filterHelper } from "../../../utils/HelperFunction";
import { getVendor } from "../../../Redux/Slices/vendorSlice";
import { useDispatch, useSelector } from "react-redux";
import { userSelector } from "../../../Redux/Slices/authSlice";

const PendingVendors = () => {
	const history = useHistory();
	const dispatch = useDispatch();
	const { emailAddress, userRole } = useSelector(userSelector);

	const [vendorList, setVendorList] = useState([]);
	const [pendingVendorList, setPendingVendorList] = useState([]);
	const [activeVendorList, setActiveVendorList] = useState([]);
	const [declinedVendorList, setDeclinedVendorList] = useState([]);

	const [page, setPage] = useState(1);
	const resultsPerPage = 5;
	const totalResults = pendingVendorList.length;

	const pendingVendors = useSelector(
		(state) => state.vendorModule.pendingVendorsList
	);

	let paginatedVendors = pendingVendors.slice(
		(page - 1) * resultsPerPage,
		page * resultsPerPage
	);

	const [generalStates, setGeneralStates] = useState({
		isCreateModalOpen: false,
		isActionModalOpen: false,
		actionReceiver: "",
		actionType: "",
		modalHeader: "Add Vendor",
		notificationText: "",
		status: "",
		isLoading: false,
		buttonText: "Create User",
		disabled: false,
		totalResults: 0,
	});

	const [data, setData] = useState([]);
	const [id, setId] = useState(null);
	const [openTab, setOpenTab] = useState(1);
	const [vendorInfo, setVendorInfo] = useState({
		vendorName: "",
		description: "",
	});

	const [userId, setUserId] = useState(null);
	const [hidePagination, setHidePagination] = useState(false);






	function closeActionModal() {
		setGeneralStates((prevState) => ({
			...prevState,
			isActionModalOpen: false,
		}));
	}

	function openApproveViewModal(id) {
		setUserId(id);

		setGeneralStates((prevState) => ({
			...prevState,
			actionType: "approve",
			actionReceiver: "vendor",
			isActionModalOpen: true,
		}));
	}

	function openDeclineViewModal(id) {
		setUserId(id);
		setGeneralStates((prevState) => ({
			...prevState,
			actionType: "decline",
			actionReceiver: "vendor",
			isActionModalOpen: true,
		}));
	}

	// GETTING PENDING VENDORS ON PAGE LOAD
	const fetchPendingVendorList = async () => {
		try {
			let responseData = await getAllPendingVendors(
				emailAddress,
				userRole
			);
			setPendingVendorList(responseData.dataList);

			dispatch(setPendingVendorsList(responseData.dataList));
		} catch (error) {
			setGeneralStates((prevState) => ({
				...prevState,
				setStatus: "failure",
				setNotificationText:
					"couldn't fetch User list, kindly refresh page",
			}));
		}
	};

	// GETTING APPROVED VENDORS ON PAGE LOAD
	const fetchApprovedVendorList = async () => {
		try {
			let responseData = await getAllActiveVendors(
				emailAddress,
				userRole
			);
			setActiveVendorList(responseData.dataList);

			setGeneralStates((prevState) => ({
				...prevState,
				totalResults: responseData.dataList.length,
			}));

			dispatch(setApprovedVendorsList(responseData.dataList));
		} catch (error) {
			setGeneralStates((prevState) => ({
				...prevState,
				setStatus: "failure",
				setNotificationText:
					"couldn't fetch User list, kindly refresh page",
			}));
		}
	};

	// GETTING DECLINED DATA ON PAGE LOAD
	const fetchDeclinedVendorList = async () => {
		try {
			let responseData = await getAllArchivedVendors(
				emailAddress,
				userRole
			);
			setDeclinedVendorList(responseData.dataList);

			dispatch(setDeclinedVendorsList(responseData.dataList));
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
		fetchPendingVendorList();
	}, [page]);

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
	async function createVendor(id) {
		const data = {
			vendorName: vendorInfo.vendorName,
			description: vendorInfo.description,
			approvedStatus: 2, //default approvedStatus for new vendor is 2 i.e inactive
		};

		try {
			setGeneralStates((prevState) => ({
				...prevState,
				disabled: true,
				isLoading: true,
				buttonText: "creating new user...",
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
						buttonText: "Create User",
					}));
					fetchPendingVendorList();
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
						buttonText: "Create User",
					}));
					fetchPendingVendorList();
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
			// approvedStatus: 2, //default approvedStatus for new vendor is 2
		};

		try {
			resetVendorForm();
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
					fetchPendingVendorList();
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
					fetchPendingVendorList();
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



	// FUNCTION HANDLING APPROVE VENDOR
	async function approveVendor(id) {
		try {
			setGeneralStates((prevState) => ({
				...prevState,
				isActionModalOpen: false,
				status: "success",
				notificationText: `${generalStates.actionReceiver} ${generalStates.actionType}d successfully`,
			}));

			await approveCreatedVendor(id, emailAddress, userRole);

			setTimeout(() => {
				setGeneralStates((prevState) => ({
					...prevState,
					status: "",
				}));
			}, 2000);

			fetchPendingVendorList();
			fetchApprovedVendorList();
		} catch (error) {
			setGeneralStates((prevState) => ({
				...prevState,
				isActionModalOpen: false,
				status: "failure",
				notificationText: `${generalStates.actionReceiver} not ${generalStates.actionType}d successfully`,
			}));
		}
	}

	// FUNCTION HANDLING DECLINE VENDOR
	async function declineVendor(id) {
		try {
			setGeneralStates((prevState) => ({
				...prevState,
				isActionModalOpen: false,
				status: "success",
				notificationText: `${generalStates.actionReceiver} ${generalStates.actionType}d successfully`,
			}));

			await declineCreatedVendor(id, emailAddress, userRole);

			setTimeout(() => {
				setGeneralStates((prevState) => ({
					...prevState,
					status: "",
				}));
			}, 2000);

			fetchPendingVendorList();
			fetchDeclinedVendorList();
		} catch (error) {
			setGeneralStates((prevState) => ({
				...prevState,
				isActionModalOpen: false,
				status: "failure",
				notificationText: `${generalStates.actionReceiver} not ${generalStates.actionType}d successfully`,
			}));
		}
	}

	//FUNCTION TO SELECT CREATE MODAL FUNCTION
	const createModalFunction = async (id) => {
		if (generalStates.modalHeader === "Edit Vendor") {
			await editCreatedVendor(id);
		} else if (generalStates.modalHeader === "Add Vendor") {
			await createVendor(id);
		}
	};

	//FUNCTION TO SELECT ACTION MODAL FUNCTION
	const actionModalFunction = async (id) => {
		 if (generalStates.actionType === "approve") {
			await approveVendor(id);
		} else if (generalStates.actionType === "decline") {
			await declineVendor(id);
		}
	};

	// FUNCTION TO VIEW VENDOR INFO
	const viewVendorInfo = async (vendorTag) => {
		try {
			setGeneralStates((prevState) => ({
				...prevState,
				status: "success",
				notificationText: "getting vendor info, please wait..."
			})) 
		
			history.push("/app/admin/vendors/vendor-info");
			let responseData = await getVendorInfo(
				vendorTag,
				emailAddress,
				userRole
			);
			dispatch(getVendor(responseData));
			setGeneralStates((prevState) => ({
				...prevState,
				status: "",
				notificationText: ""
			})) 
		
		
		} catch (error) {
			setGeneralStates((prevState) => ({
				...prevState,
				status: "failure",
				notificationText:
					"couldn't get Vendor Info, kindly refresh page",
			}));
		}
	};

	// FUNCTION TO FILTER VENDOR LISt by SEARCH iNPUT

	const filterVendorList = (searchFieldValue) => {
		let filteredResult = filterHelper(pendingVendorList, searchFieldValue);

		if (searchFieldValue !== "") {
			dispatch(setPendingVendorsList(filteredResult));
			setHidePagination(true);
		} else if (searchFieldValue === "") {
			setHidePagination(false);
			fetchPendingVendorList();
		}
	};

	return (
		<div>
			<Notification
				notificationText={generalStates.notificationText}
				status={generalStates.status}
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

			<div className="flex justify-between w-full h-[4.8125rem] items-center px-6">
				<div className="flex">
					<Searchbar
						onChange={(e) => {
							e.preventDefault();
							filterVendorList(e.target.value);
						}}
						placeholder="search pending vendor"
					/>
				</div>
			</div>

			<div className="overflow-x-auto relative bg-white pl-6 pr-14 pb-2 rounded-lg">
				<table className="w-full text-sm text-left text-gray-500">
					<thead className="text-sm text-black-primary opacity-70 bg-dashboard-background">
						<tr>
							<th scope="col" className="py-3 px-6">
								Vendor name
							</th>
							<th scope="col" className="py-3 px-6">
								Status
							</th>
							<th scope="col" className="py-3 px-6 ">
								Actions
							</th>
						
						</tr>
					</thead>
					<tbody>
						{paginatedVendors.map((vendor) => (
							<tr key={vendor.id} className="bg-white border-b">
								<td className="py-6 px-6 font-sm text-black-secondary whitespace-nowrap">
									{vendor.vendorName}
								</td>

								<td className="py-6 px-6 text-green-primary">
									{vendor.approvedStatus === 0 && (
										<Status pending />
									)}
									{vendor.approvedStatus === 1 && (
										<Status active />
									)}
									{vendor.approvedStatus === 2 && (
										<Status inactive />
									)}
									{vendor.approvedStatus === 4 && (
										<Status archived />
									)}
								</td>
								<td className="py-6 px-6 text-red-primary">
									<section className="flex justify-start">
										<button
											onClick={() =>
												openApproveViewModal(vendor.id)
											}
											className="text-base font-[450] text-green-primary md:mr-6"
										>
											Approve
										</button>
										<button
											onClick={() =>
												openDeclineViewModal(vendor.id)
											}
											className="text-base font-[450] text-purple-primary"
										>
											Decline
										</button>
									</section>
								</td>
								<td className="py-6 px-6 text-red-primary text-center">
									<button
										onClick={() =>
											viewVendorInfo(vendor.vendorName)
										}
										className="text-base font-[450] underline linear-gradient-text"
									>
										View vendor info
									</button>
								</td>
							</tr>
						))}
					</tbody>

					{hidePagination === false && (
						<Pagination
							totalResults={totalResults}
							resultsPerPage={resultsPerPage}
							label="Table navigation"
							onChange={onPageChange}
						/>
					)}
				</table>
			</div>
		</div>
	);
};

export default PendingVendors;
