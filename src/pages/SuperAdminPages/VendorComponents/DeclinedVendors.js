import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Searchbar from "../../../components/Searchbar";
import Status from "../../../components/Status";
import { Pagination } from "@windmill/react-ui";
import CreateModal from "../../../components/Modals/CreateModal";
import ActionModal from "../../../components/Modals/ActionModal";
import Notification from "../../../components/Notification";
import {
	getVendorInfo,
	getAllArchivedVendors,
	setDeclinedVendorsList,
	setPendingVendorsList,
	getAllPendingVendors,
} from "../../../Redux/Slices/vendorSlice";
import { filterHelper } from "../../../utils/HelperFunction";
import { getVendor } from "../../../Redux/Slices/vendorSlice";
import { useDispatch, useSelector } from "react-redux";
import { userSelector } from "../../../Redux/Slices/authSlice";

const DeclinedVendors = () => {
	const history = useHistory();
	const dispatch = useDispatch();
	const { emailAddress, userRole } = useSelector(userSelector);

	// const [vendorList, setVendorList] = useState([]);
	const [pendingVendorList, setPendingVendorList] = useState([]);
	const [activeVendorList, setActiveVendorList] = useState([]);
	const [declinedVendorList, setDeclinedVendorList] = useState([]);

	const [page, setPage] = useState(1);
	const resultsPerPage = 5;
	const totalResults = declinedVendorList.length;

	const declinedVendors = useSelector(
		(state) => state.vendorModule.declinedVendorsList
	);

	let paginatedVendors = declinedVendors.slice(
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
	const [vendorList, setVendorList] = useState([]);
	const [id, setId] = useState(null);
	const [openTab, setOpenTab] = useState(1);
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

	function openEditModal(id) {
		setGeneralStates((prevState) => ({
			...prevState,
			isCreateModalOpen: true,
			modalHeader: "Edit Vendor",
			buttonText: "Edit Vendor",
		}));
		resetVendorForm();
		setUserId(id);
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

	// GETTING PENDING VENDORS ON PAGE LOAD
	const fetchPendingVendorList = async () => {
		try {
			let responseData = await getAllPendingVendors(
				emailAddress,
				userRole
			);
			setPendingVendorList(responseData.dataList);

			dispatch(setPendingVendorsList(responseData.dataList));
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
		fetchDeclinedVendorList();
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

	// FUNCTION TO VIEW VENDOR INFO
	const viewVendorInfo = async (vendorTag) => {
		try {
			setGeneralStates((prevState) => ({
				...prevState,
				status: "success",
				notificationText: "getting vendor info, please wait...",
			}));

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

	// FUNCTION TO FILTER VENDOR LISt by SEARCH iNPUT

	const filterVendorList = (searchFieldValue) => {
		let filteredResult = filterHelper(declinedVendorList, searchFieldValue);

		if (searchFieldValue !== "") {
			dispatch(setDeclinedVendorsList(filteredResult));
			setHidePagination(true);
		} else if (searchFieldValue === "") {
			setHidePagination(false);
			fetchDeclinedVendorList();
		}
	};

	return (
		<div>
			<Notification
				notificationText={generalStates.notificationText}
				status={generalStates.status}
			/>

			<div className="flex justify-between w-full h-[4.8125rem] items-center px-6">
				<div className="flex">
					<Searchbar
						onChange={(e) => {
							e.preventDefault();
							filterVendorList(e.target.value);
						}}
						placeholder="search declined vendor"
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
							<th scope="col" className="py-3 px-6">
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

export default DeclinedVendors;
