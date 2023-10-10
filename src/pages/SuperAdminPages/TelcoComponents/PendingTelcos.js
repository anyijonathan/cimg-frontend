import React, { useState, useEffect } from "react";
import Searchbar from "../../../components/Searchbar";
import Status from "../../../components/Status";
import CreateModal from "../../../components/Modals/CreateModal";
import ActionModal from "../../../components/Modals/ActionModal";
import Notification from "../../../components/Notification";
import { Pagination } from "@windmill/react-ui";
import {
	getAllTelcos,
	addTelco,
	editTelco,
	enableTelco,
	disableTelco,
	archiveTelco,
	unArchiveTelco,
	approveCreatedTelco,
	declineCreatedTelco,
	getTelcoInfo,
	getTelco,
	getAllPendingTelcos,
	setPendingList,
	setDeclinedList,
	getAllArchivedTelcos,
	setApprovedList,
	getAllActiveTelcos,
	setAllTelcosList,
} from "../../../Redux/Slices/telcoSlice";
import { filterHelper } from "../../../utils/HelperFunction";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { userSelector } from "../../../Redux/Slices/authSlice";

const Telcos = () => {
	const history = useHistory();
	const dispatch = useDispatch();

	const [telcoList, setTelcoList] = useState([]);
	const [pendingTelcoList, setPendingTelcoList] = useState([]);
	const [activeTelcoList, setActiveTelcoList] = useState([]);
	const [declinedTelcoList, setDeclinedTelcoList] = useState([]);

	const [page, setPage] = useState(1);
	const resultsPerPage = 5;
	const totalResults = pendingTelcoList.length;

	const { emailAddress, userRole } = useSelector(userSelector);

	const pendingTelcos = useSelector((state) => state.telcoModule.pendingList);

	let paginatedTelcos = pendingTelcos.slice(
		(page - 1) * resultsPerPage,
		page * resultsPerPage
	);

	const [generalStates, setGeneralStates] = useState({
		isCreateModalOpen: false,
		isActionModalOpen: false,
		actionReceiver: "",
		actionType: "",
		modalHeader: "Add Telco",
		notificationText: "",
		status: "",
		isLoading: false,
		buttonText: "Create User",
		disabled: false,
	});

	const [id, setId] = useState(null);
	const [telcoInfo, setTelcoInfo] = useState({
		telcoName: "",
		description: "",
	});

	const [userId, setUserId] = useState(null);
	const [hidePagination, setHidePagination] = useState(false);
	const [isViewModalOpen, setIsViewModalOpen] = useState(false);
	const [isActiveViewModalOpen, setIsActiveViewModalOpen] = useState(false);
	const [openTab, setOpenTab] = useState(1);



	function closeActionModal() {
		setGeneralStates((prevState) => ({
			...prevState,
			isActionModalOpen: false,
		}));
	}

	function openActiveViewModal() {
		setIsActiveViewModalOpen(true);
	}

	function closeActiveViewModal() {
		setIsActiveViewModalOpen(false);
	}




	function openApproveViewModal(id) {
		setUserId(id);
		setGeneralStates((prevState) => ({
			...prevState,
			actionType: "approve",
			actionReceiver: "telco",
			isActionModalOpen: true,
		}));
	}

	function openDeclineViewModal(id) {
		setUserId(id);
		setGeneralStates((prevState) => ({
			...prevState,
			actionType: "decline",
			actionReceiver: "telco",
			isActionModalOpen: true,
		}));
	}


	// GETTING ACTIVE TELCOS ON PAGE LOAD
	const fetchTelcoList = async () => {
		try {
			let responseData = await getAllTelcos(emailAddress, userRole);

			setTelcoList(responseData.dataList);
			dispatch(setAllTelcosList(responseData.dataList));
		} catch (error) {
			setGeneralStates((prevState) => ({
				...prevState,
				setStatus: "failure",
				setNotificationText:
					"couldn't fetch User list, kindly refresh page",
			}));
		}
	};

	// GETTING USER LIST ON PAGE LOAD
	const fetchPendingTelcoList = async () => {
		try {
			let responseData = await getAllPendingTelcos(
				emailAddress,
				userRole
			);
			setPendingTelcoList(responseData.dataList);
			dispatch(setPendingList(responseData.dataList));
		} catch (error) {
			setGeneralStates((prevState) => ({
				...prevState,
				setStatus: "failure",
				setNotificationText:
					"couldn't fetch User list, kindly refresh page",
			}));
		}
	};

	// GETTING ALL APPROVED TELCOS ON PAGE LOAD
	const fetchActiveTelcos = async () => {
		try {
			let responseData = await getAllActiveTelcos(emailAddress, userRole);

		
			setActiveTelcoList(responseData.dataList);
			dispatch(setApprovedList(responseData.dataList));
		} catch (error) {
			setGeneralStates((prevState) => ({
				...prevState,
				setStatus: "failure",
				setNotificationText:
					"couldn't fetch User list, kindly refresh page",
			}));
		}
	};

	// GETTING USER LIST ON PAGE LOAD
	const fetchDeclinedTelcoList = async (telcoList) => {
		try {
			let responseData = await getAllArchivedTelcos(
				emailAddress,
				userRole
			);

			setDeclinedTelcoList(responseData.dataList);
			dispatch(setDeclinedList(responseData.dataList));
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
		fetchPendingTelcoList();
	}, [page]);

	// pagination change control
	function onPageChange(p) {
		setPage(p);
	}

	const handleTelcoInfoChange = (e) => {
		const { value } = e.target;
		setTelcoInfo({
			...telcoInfo,
			[e.target.name]: value,
		});
	};

	// FUNCTION TO RESET VENDOR FORM FIELDS TO EMPTY STRING
	const resetVendorForm = () => {
		setTelcoInfo((prevState) => ({
			...prevState,
			telcoName: "",
			description: "",
		}));
	};



	// FUNCTION TO HANDLE APPROVE TELCO
	async function approveTelco(id) {
		try {
			setGeneralStates((prevState) => ({
				...prevState,
				isActionModalOpen: false,
				status: "success",
				notificationText: `${generalStates.actionReceiver} ${generalStates.actionType}d successfully`,
			}));

			await approveCreatedTelco(id, emailAddress, userRole);

			setTimeout(() => {
				setGeneralStates((prevState) => ({
					...prevState,
					status: "",
				}));
			}, 2000);

			fetchPendingTelcoList();
			fetchActiveTelcos();
		} catch (error) {
			setGeneralStates((prevState) => ({
				...prevState,
				status: "failure",
				notificationText: error,
			}));
		}
	}

	// FUNCTION TO HANDLE DECLINE TELCO
	async function declineTelco(id) {
		try {
			setGeneralStates((prevState) => ({
				...prevState,
				isActionModalOpen: false,
				status: "success",
				notificationText: `${generalStates.actionReceiver} ${generalStates.actionType}d successfully`,
			}));

			const responseData = await declineCreatedTelco(
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

			fetchPendingTelcoList();
			fetchDeclinedTelcoList();
		} catch (error) {
			setGeneralStates((prevState) => ({
				...prevState,
				status: "failure",
				notificationText: error,
			}));
		}
	}


	//FUNCTION TO SELECT ACTION MODAL FUNCTION
	const actionModalFunction = async (id) => {
	  if (generalStates.actionType === "approve") {
			await approveTelco(id);
		} else if (generalStates.actionType === "decline") {
			await declineTelco(id);
		}
	};

	// FUNCTION TO FILTER VENDOR LISt by SEARCH iNPUT

	const filterTelcoList = (searchFieldValue) => {
		let filteredResult = filterHelper(pendingTelcoList, searchFieldValue);

		if (searchFieldValue !== "") {
			dispatch(setPendingList(filteredResult));
			setHidePagination(true);
		} else if (searchFieldValue === "") {
			setHidePagination(false);
			fetchPendingTelcoList();
		}
	};

	const viewTelcoInfo = async (telcoTag) => {
		try {
			setGeneralStates((prevState) => ({
				...prevState,
				status: "success",
				notificationText: "getting telco info, please wait..."
			})) 
			history.push("/app/admin/telcos/telco-info");
			let responseData = await getTelcoInfo(
				telcoTag,
				emailAddress,
				userRole
			);
			dispatch(getTelco(responseData));
		 	setGeneralStates((prevState) => ({
				...prevState,
				status: "success",
				notificationText: "getting telco info, please wait..."
			})) 
		
		} catch (error) {
			setGeneralStates((prevState) => ({
				...prevState,
				status: "failure",
				notificationText:
					"couldn't get Telco Info, kindly refresh page",
			}));
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
							filterTelcoList(e.target.value);
						}}
						placeholder="search pending telco"
					/>
				</div>
			</div>

			<div className="overflow-x-auto relative bg-white pl-6 pr-14 pb-2 rounded-lg">
				<table className="w-full text-sm text-left text-gray-500">
					<thead className="text-sm text-black-primary opacity-70 bg-dashboard-background">
						<tr>
							<th scope="col" className="py-3 px-6">
								Telco name
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
						{paginatedTelcos.map((telco) => (
							<tr key={telco.id} className="bg-white border-b">
								<td className="py-6 px-6 font-sm text-black-secondary whitespace-nowrap">
									<div className="flex items-center">
										{/* <img src={MtnLogo}></img> */}
										<p className="font-sm text-black-secondary pl-2">
											{telco.telcoName}
										</p>
									</div>
								</td>

								<td className="py-6 px-6 text-green-primary">
									{telco.approvedStatus === 0 && (
										<Status pending />
									)}
									{telco.approvedStatus === 1 && (
										<Status active />
									)}
									{telco.approvedStatus === 2 && (
										<Status inactive />
									)}
									{telco.approvedStatus === 4 && (
										<Status archived />
									)}
								</td>
								<td className="py-6 px-6 text-red-primary">
									<div className="flex">
										<button
											onClick={() =>
												openApproveViewModal(telco.id)
											}
											className="text-base font-[450] text-green-primary md:mr-6"
										>
											Approve
										</button>
										<button
											onClick={() =>
												openDeclineViewModal(telco.id)
											}
											className="text-base font-[450] text-purple-primary"
										>
											Decline
										</button>
									</div>
								</td>
								<td className="py-6 px-6 text-red-primary">
									<button
										onClick={() =>
											viewTelcoInfo(telco.telcoName)
										}
										className="text-base font-[450] underline linear-gradient-text"
									>
										View telco info
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
	);
};

export default Telcos;
