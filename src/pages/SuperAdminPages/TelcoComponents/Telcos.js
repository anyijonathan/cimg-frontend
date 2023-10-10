import React, { useState, useEffect } from "react";
import Searchbar from "../../../components/Searchbar";
import Status from "../../../components/Status";
import CreateModal from "../../../components/Modals/CreateModal";
import ActionModal from "../../../components/Modals/ActionModal";
import Notification from "../../../components/Notification";
import { Backdrop, Pagination } from "@windmill/react-ui";
import {
	getAllTelcos,
	approveCreatedTelco,
	declineCreatedTelco,
	getTelcoInfo,
	getAllPendingTelcos,
	getAllArchivedTelcos,
	getAllActiveTelcos,
	getTelco,
	setAllTelcosList,
	setPendingList,
	setApprovedList,
	setDeclinedList,
} from "../../../Redux/Slices/telcoSlice";
import ApprovedTelcos from "./ApprovedTelcos";
import PendingTelcos from "./PendingTelcos";
import DeclinedTelcos from "./DeclinedTelcos";
import { filterHelper } from "../../../utils/HelperFunction";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { userSelector } from "../../../Redux/Slices/authSlice";

const Telcos = () => {
	const [telcoList, setTelcoList] = useState([]);
	const [pendingTelcoList, setPendingTelcoList] = useState([]);
	const [activeTelcoList, setActiveTelcoList] = useState([]);
	const [declinedTelcoList, setDeclinedTelcoList] = useState([]);

	const [page, setPage] = useState(1);
	const resultsPerPage = 5;
	const totalResults = telcoList.length;

	const history = useHistory();
	const dispatch = useDispatch();
	const { emailAddress, userRole } = useSelector(userSelector);

	const allTelcos = useSelector((state) => state.telcoModule.allTelcoList);

	let paginatedTelcos = allTelcos.slice(
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



	async function openEditModal(id, telcoTag) {
		setUserId(id);

		try {
			let responseData = await getTelcoInfo(
				telcoTag,
				emailAddress,
				userRole
			);

			setTelcoInfo((prevState) => ({
				...prevState,
				telcoName: responseData.data.telco,
				description: responseData.data.description,
			}));
		} catch (error) {
			setGeneralStates((prevState) => ({
				...prevState,
				status: "failure",
				notificationText:
					"couldn't get Telco Info, kindly refresh page",
			}));
		}

		setGeneralStates((prevState) => ({
			...prevState,
			isCreateModalOpen: true,
			modalHeader: "Edit Telco",
			buttonText: "Edit Telco",
		}));
		// resetTelcoForm();
	}

	function closeActionModal() {
		setGeneralStates((prevState) => ({
			...prevState,
			isActionModalOpen: false,
		}));
	}


	const setTabOne = () => {
		setOpenTab(1);
	};

	const setTabTwo = () => {
		setOpenTab(2);
	};

	const setTabThree = () => {
		setOpenTab(3);
	};

	const setTabFour = () => {
		setOpenTab(4);
	};

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

	// GETTING PENDING TELCOS ON PAGE LOAD
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
		fetchTelcoList();
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
	const resetTelcoForm = () => {
		setTelcoInfo((prevState) => ({
			...prevState,
			telcoName: "",
			description: "",
		}));
	};




	// FUNCTION TO HANDLE APPROVE VENDOR
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

			fetchTelcoList();
			fetchActiveTelcos();
		} catch (error) {
			setGeneralStates((prevState) => ({
				...prevState,
				status: "failure",
				notificationText: error,
			}));
		}
	}

	// FUNCTION TO HANDLE DECLINE VENDOR
	async function declineTelco(id) {
		try {
			setGeneralStates((prevState) => ({
				...prevState,
				isActionModalOpen: false,
				status: "success",
				notificationText: `${generalStates.actionReceiver} ${generalStates.actionType}d successfully`,
			}));

			await declineCreatedTelco(id, emailAddress, userRole);

			setTimeout(() => {
				setGeneralStates((prevState) => ({
					...prevState,
					status: "",
				}));
			}, 2000);

			fetchTelcoList();
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
		let filteredResult = filterHelper(telcoList, searchFieldValue);

		if (searchFieldValue !== "") {
			dispatch(setAllTelcosList(filteredResult));
			setHidePagination(true);
		} else if (searchFieldValue === "") {
			setHidePagination(false);
			fetchTelcoList();
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
		<div className="font-circular-std">
			<Notification
				notificationText={generalStates.notificationText}
				status={generalStates.status}
			/>
			{/* ---------------------------------------------- Modals ------------------------------------------- */}


			<ActionModal
				onClose={closeActionModal}
				show={generalStates.isActionModalOpen}
				modalClose={closeActionModal}
				actionReceiver={generalStates.actionReceiver}
				actionType={generalStates.actionType}
				modalAction={() => actionModalFunction(userId)}
			/>

			{/*   ------------------------------------------- Modals ----------------------------------------------------  */}

			<h2 className="text-xl font-bold text-black-secondary pb-9">
				Manage Telcos
			</h2>
			{/* -------------------------------------------------  TAB HEADING--------------------------------------------------------------------- */}
			<div className="col-span-6 h-[27.1875rem] bg-white">
				<div className="w-full px-4 pb-4">
					<ul className="pt-4 pl-4 flex justify-between">
						<li>
							<button
								href=""
								onClick={setTabOne}
								className={`${
									openTab === 1
										? "text-purple-primary"
										: "text-black-secondary opacity-70"
								}  inline-flex items-center pl-6 w-full h-12 text-sm font-normal transition-colors duration-150`}
							>
								All Telcos
							</button>
							<hr
								className={`${
									openTab === 1
										? "border-purple-900 ml-6"
										: ""
								}`}
							/>
						</li>

						<li>
							<button
								href=""
								onClick={setTabTwo}
								className={`${
									openTab === 2
										? "text-purple-primary"
										: "text-black-secondary opacity-70"
								}  inline-flex items-center pl-6 w-full h-12 text-sm font-normal transition-colors duration-150`}
							>
								Pending Approvals
							</button>
							<hr
								className={`${
									openTab === 2
										? "border-purple-900 ml-6"
										: ""
								}`}
							/>
						</li>

						<li>
							<button
								href=""
								onClick={setTabThree}
								className={`${
									openTab === 3
										? "text-purple-primary"
										: "text-black-secondary opacity-70"
								}  inline-flex items-center pl-6 w-full h-12 text-sm font-normal transition-colors duration-150`}
							>
								Approved Changes
							</button>
							<hr
								className={`${
									openTab === 3
										? "border-purple-900 ml-6"
										: ""
								}`}
							/>
						</li>

						<li>
							<button
								href=""
								onClick={setTabFour}
								className={`${
									openTab === 4
										? "text-purple-primary"
										: "text-black-secondary opacity-70"
								}  inline-flex items-center pl-6 w-full h-12 text-sm font-normal transition-colors duration-150`}
							>
								Declined Changes
							</button>
							<hr
								className={`${
									openTab === 4
										? "border-purple-900 ml-6"
										: ""
								}`}
							/>
						</li>
					</ul>
					<hr className="px-6" />
				</div>

				{/* ---------------------------------------------------------ALL TELCO TAB START ------------------------------------------------------------- */}
				<div className={openTab === 1 ? "block" : "hidden"}>
					<div className="flex justify-between w-full h-[4.8125rem] items-center px-6">
						<div className="flex">
							<Searchbar
								onChange={(e) => {
									e.preventDefault();
									filterTelcoList(e.target.value);
								}}
								placeholder="search telco"
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
									<tr
										key={telco.id}
										className="bg-white border-b"
									>
										<td className="py-6 px-6 font-sm text-black-secondary whitespace-nowrap">
											<div className="flex items-center">
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
											<button
												onClick={() =>
													viewTelcoInfo(
														telco.telcoName
													)
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
				{/* 
        .................................................................................................................... */}
				<div className={openTab === 2 ? "block" : "hidden"}>
					<PendingTelcos />
				</div>
				{/* -------------------------------------------------------------------PENDING APPROVAL TAB END-------------------------------------- */}

				{/* -------------------------------------------------------------------APPROVED CHANGES TAB START-------------------------------------- */}

				<div className={openTab === 3 ? "block" : "hidden"}>
					<ApprovedTelcos />
				</div>

				{/* -------------------------------------------------------------------DECLINED CHANGES TAB START-------------------------------------- */}

				<div className={openTab === 4 ? "block" : "hidden"}>
					<DeclinedTelcos />
				</div>
				{/* -------------------------------------------------------------------DECLINED CHANGES TAB END-------------------------------------- */}
				{/*  */}
			</div>
		</div>
	);
};

export default Telcos;
