import React, { useState, useEffect } from "react";
import FormSelect from "../../components/FormSelect";
import Searchbar from "../../components/Searchbar";
import Status from "../../components/Status";
import CreateModal from "../../components/Modals/CreateModal";
import ActionModal from "../../components/Modals/ActionModal";
import Notification from "../../components/Notification";
import { Pagination } from "@windmill/react-ui";
import { StatusOption } from "../../utils/constants";
import {
	getAllTelcos,
	addTelco,
	editTelco,
	enableTelco,
	disableTelco,
	archiveTelco,
	unArchiveTelco,
	getAllActiveTelcos,
	getAllInactiveTelcos,
	getAllArchivedTelcos,
	getAllPendingTelcos,
	getTelcoInfo,
	getTelco,
} from "../../Redux/Slices/telcoSlice";
import { filterHelper } from "../../utils/HelperFunction";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Table from "./Table";
import { userSelector } from "../../Redux/Slices/authSlice";

const Telcos = () => {
	const history = useHistory();
	const dispatch = useDispatch();
	const { emailAddress, userRole } = useSelector(userSelector);

	const [generalStates, setGeneralStates] = useState({
		isCreateModalOpen: false,
		isActionModalOpen: false,
		actionReceiver: "",
		actionType: "",
		modalHeader: "",
		notificationText: "",
		status: "",
		isLoading: false,
		buttonText: "Create User",
		disabled: false,
	});

	const [page, setPage] = useState(1);
	const [data, setData] = useState([]);
	const [telcoList, setTelcoList] = useState([]);
	const [id, setId] = useState(null);

	const [telcoInfo, setTelcoInfo] = useState({
		telcoName: "",
		description: "",
	});

	const [userId, setUserId] = useState(null);
	const [hidePagination, setHidePagination] = useState(false);

	function openCreateModal() {
		setGeneralStates((prevState) => ({
			...prevState,
			isCreateModalOpen: true,
			modalHeader: "Add Telco",
			buttonText: "Add Telco",
		}));
		resetTelcoForm();
	}

	function closeCreateModal() {
		setGeneralStates((prevState) => ({
			...prevState,
			isCreateModalOpen: false,
		}));
	}

	async function openEditModal(id, telcoTag) {
		setUserId(id);

		setGeneralStates((prevState) => ({
			...prevState,
			isCreateModalOpen: true,
			modalHeader: "Edit Telco",
			buttonText: "Edit Telco",
			setStatus: "success",
			setNotificationText: "Fetching Telco info...",
		}));

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
			setGeneralStates((prevStates) => ({
				...prevStates,
				status: "failure",
				notificationText:
					"couldn't get Telco Info, kindly refresh page",
			}));
		}

		// resetTelcoForm();
	}

	function closeActionModal() {
		setGeneralStates((prevState) => ({
			...prevState,
			isActionModalOpen: false,
		}));
	}

	function openEnableTelcoModal(id) {
		setUserId(id);

		setGeneralStates((prevState) => ({
			...prevState,
			actionType: "enable",
			actionReceiver: "telco",
			isActionModalOpen: true,
		}));
	}

	function openDisableTelcoModal(id) {
		setUserId(id);
		setGeneralStates((prevState) => ({
			...prevState,
			actionType: "disable",
			actionReceiver: "telco",
			isActionModalOpen: true,
		}));
	}

	function openArchiveTelcoModal(id) {
		setUserId(id);
		setGeneralStates((prevState) => ({
			...prevState,
			actionType: "archive",
			actionReceiver: "telco",
			isActionModalOpen: true,
		}));
	}

	function openUnArchiveTelcoModal(id) {
		setUserId(id);
		setGeneralStates((prevState) => ({
			...prevState,
			actionType: "unarchive",
			actionReceiver: "telco",
			isActionModalOpen: true,
		}));
	}

	// GETTING USER LIST ON PAGE LOAD
	const fetchTelcoList = async (telcoList) => {
		try {
			let responseData = await telcoList;

			setTelcoList(responseData.dataList);
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
		fetchTelcoList(getAllTelcos(emailAddress, userRole));
	}, [page]);

	const resultsPerPage = 5;
	const totalResults = telcoList.length;

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

	// FUNCTION HANDLING CREATION OF NEW TELCO
	async function createTelco() {
		const data = {
			telcoName: telcoInfo.telcoName,
			description: telcoInfo.description,
			approvedStatus: 2, //default approvedStatus for new vendor is 2
		};

		try {
			setGeneralStates((prevState) => ({
				...prevState,
				disabled: true,
				isLoading: true,
				buttonText: "creating new telco...",
			}));

			const responseData = await addTelco(data, emailAddress, userRole);
			if (responseData.code === "00") {
				setGeneralStates((prevState) => ({
					...prevState,
					isCreateModalOpen: false,
					status: "success",
					notificationText: "Telco added successfully",
				}));
				resetTelcoForm();
				setTimeout(() => {
					setGeneralStates((prevState) => ({
						...prevState,
						status: "",
						notificationText: "",
						disabled: false,
						isLoading: false,
						buttonText: "Create User",
					}));
					fetchTelcoList(getAllTelcos(emailAddress, userRole));
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
					fetchTelcoList(getAllTelcos(emailAddress, userRole));
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

	// FUNCTION HANDLING EDIT TELCO
	async function editCreatedTelco(id) {
		const data = {
			id: id,
			telcoName: telcoInfo.telcoName,
			description: telcoInfo.description,
			approvedStatus: 2, //default approvedStatus for new telco is 2
		};

		try {
			setGeneralStates((prevState) => ({
				...prevState,
				disabled: true,
				isLoading: false,
				buttonText: "saving changes...",
			}));

			const responseData = await editTelco(data, emailAddress, userRole);
			if (responseData.code === "00") {
				setGeneralStates((prevState) => ({
					...prevState,
					isCreateModalOpen: false,
					status: "success",
					notificationText: "Telco edited successfully",
				}));
				resetTelcoForm();

				setTimeout(() => {
					setGeneralStates((prevState) => ({
						...prevState,
						status: "",
						notificationText: "",
						disabled: false,
						isLoading: false,
						buttonText: "Edit Telco",
					}));
					fetchTelcoList(getAllTelcos(emailAddress, userRole));
				}, 2000);
			} else {
				setGeneralStates((prevState) => ({
					...prevState,
					isCreateModalOpen: false,
					status: "failure",
					notificationText: responseData.description,
				}));
				resetTelcoForm();

				setTimeout(() => {
					setGeneralStates((prevState) => ({
						...prevState,
						status: "",
						notificationText: "",
						disabled: false,
						isLoading: false,
						buttonText: "Edit Vendor",
					}));
					fetchTelcoList(getAllTelcos(emailAddress, userRole));
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

	// FUNCTION HANDLING ENABLE TELCO
	async function enableCreatedTelco(id) {
		try {
			setGeneralStates((prevState) => ({
				...prevState,
				isActionModalOpen: false,
				status: "success",
				notificationText: `${generalStates.actionReceiver} ${generalStates.actionType}d successfully`,
			}));

			const responseData = await enableTelco(id, emailAddress, userRole);

			setTimeout(() => {
				setGeneralStates((prevState) => ({
					...prevState,
					status: "",
				}));
			}, 2000);

			fetchTelcoList(getAllTelcos());
		} catch (error) {
			setGeneralStates((prevState) => ({
				...prevState,
				status: "failure",
				notificationText: error,
			}));
		}
	}

	// FUNCTION HANDLING DISABLE TELCO
	async function disableCreatedTelco(id) {
		try {
			setGeneralStates((prevState) => ({
				...prevState,
				isActionModalOpen: false,
				status: "success",
				notificationText: `${generalStates.actionReceiver} ${generalStates.actionType}d successfully`,
			}));

			const responseData = await disableTelco(id, emailAddress, userRole);

			setTimeout(() => {
				setGeneralStates((prevState) => ({
					...prevState,
					status: "",
				}));
			}, 2000);

			fetchTelcoList(getAllTelcos());
		} catch (error) {
			setGeneralStates((prevState) => ({
				...prevState,
				status: "failure",
				notificationText: error,
			}));
		}
	}

	// FUNCTION HANDLING ARCHIVE TELCO
	async function archiveCreatedTelco(id) {
		try {
			setGeneralStates((prevState) => ({
				...prevState,
				isActionModalOpen: false,
				status: "success",
				notificationText: `${generalStates.actionReceiver} ${generalStates.actionType}d successfully`,
			}));

			const responseData = await archiveTelco(id, emailAddress, userRole);

			setTimeout(() => {
				setGeneralStates((prevState) => ({
					...prevState,
					status: "",
				}));
			}, 2000);

			fetchTelcoList(getAllTelcos());
		} catch (error) {
			setGeneralStates((prevState) => ({
				...prevState,
				status: "failure",
				notificationText: error,
			}));
		}
	}

	// FUNCTION HANDLING UNARCHIVE TELCO
	async function unArchiveCreatedTelco(id) {
		try {
			setGeneralStates((prevState) => ({
				...prevState,
				isActionModalOpen: false,
				status: "success",
				notificationText: `${generalStates.actionReceiver} ${generalStates.actionType}d successfully`,
			}));

			const responseData = await unArchiveTelco(
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

			fetchTelcoList(getAllTelcos());
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
		if (generalStates.modalHeader === "Edit Telco") {
			await editCreatedTelco(id);
		} else if (generalStates.modalHeader === "Add Telco") {
			await createTelco();
		}
	};

	//FUNCTION TO SELECT ACTION MODAL FUNCTION
	const actionModalFunction = async (id) => {
		if (generalStates.actionType === "enable") {
			await enableCreatedTelco(id);
		} else if (generalStates.actionType === "disable") {
			await disableCreatedTelco(id);
		} else if (generalStates.actionType === "archive") {
			await archiveCreatedTelco(id);
		} else if (generalStates.actionType === "unarchive") {
			await unArchiveCreatedTelco(id);
		}
	};

	// FUNCTION TO FILTER VENDOR LISt by SEARCH iNPUT

	const filterTelcoList = (searchFieldValue) => {
		let filteredResult = filterHelper(telcoList, searchFieldValue);

		if (searchFieldValue !== "") {
			setData(filteredResult);
			setHidePagination(true);
		} else if (searchFieldValue === "") {
			setHidePagination(false);
			fetchTelcoList(getAllTelcos());
		}
	};

	// HANDLING SELECT FILTER BY VENDOR STATUS (ACTIVE, INACTIVE ETC)
	const handleSelectFilter = (e) => {
		const { value } = e.target;

		if (value === "") {
			fetchTelcoList(getAllTelcos(emailAddress, userRole));
		} else if (value === "active") {
			fetchTelcoList(getAllActiveTelcos(emailAddress, userRole));
		} else if (value === "inactive") {
			fetchTelcoList(getAllInactiveTelcos(emailAddress, userRole));
		} else if (value === "pending") {
			fetchTelcoList(getAllPendingTelcos(emailAddress, userRole));
		} else if (value === "archived") {
			fetchTelcoList(getAllArchivedTelcos(emailAddress, userRole));
		}
	};

	const viewTelcoInfo = async (telcoTag) => {
		try {
			setGeneralStates((prevState) => ({
				...prevState,
				status: "success",
				notificationText: "getting telco info, please wait...",
			}));
			history.push("/app/telcos/telco-info");
			let responseData = await getTelcoInfo(
				telcoTag,
				emailAddress,
				userRole
			);
			dispatch(getTelco(responseData));
			setGeneralStates((prevState) => ({
				...prevState,
				status: "success",
				notificationText: "getting telco info, please wait...",
			}));
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

			<CreateModal
				label="Telco Name"
				onClose={closeCreateModal}
				show={generalStates.isCreateModalOpen}
				modalHeader={generalStates.modalHeader}
				placeholderLabel="Description"
				buttonText={generalStates.buttonText}
				placeholderDescription="Enter description"
				modalAction={() => createModalFunction(userId)}
				onFormChange={handleTelcoInfoChange}
				onTextAreaChange={handleTelcoInfoChange}
				isLoading={generalStates.isLoading}
				disabled={generalStates.disabled}
				inputName="telcoName"
				textareaName="description"
				inputValue={telcoInfo.telcoName}
				textAreaValue={telcoInfo.description}
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
				Manage Telcos
			</h2>
			<div className="col-span-6 h-[27.1875rem]">
				<div className="flex justify-between w-full bg-white h-[4.8125rem] items-center px-6">
					<div className="flex">
						<Searchbar
							onChange={(e) => {
								e.preventDefault();
								filterTelcoList(e.target.value);
							}}
							placeholder="search telco"
						/>
					</div>
					<div className="items-end">
						<div className="flex">
							<FormSelect
								className="bg-gray-50 border border-none text-black-70  text-sm rounded-lg outline-none focus:border-white focus:ring-white block mt-2  h-11/12"
								options={StatusOption}
								onChange={handleSelectFilter}
							/>
							<button
								onClick={openCreateModal}
								className="p-3 border border-purple-secondary rounded font-circular-std outline-none focus:border-purple-secondary focus:ring-purple-200 ease-in-out duration-150"
							>
								<p className="linear-gradient-text text-sm font-normal">
									Add new telco
								</p>
							</button>
						</div>
					</div>
				</div>
				<Table
					data={data}
					openEditModal={openEditModal}
					openEnableModal={openEnableTelcoModal}
					openDisableModal={openDisableTelcoModal}
					openArchiveModal={openArchiveTelcoModal}
					openUnarchiveModal={openUnArchiveTelcoModal}
					viewInfo={viewTelcoInfo}
					hidePagination={hidePagination}
					totalResults={totalResults}
					resultsPerPage={resultsPerPage}
					onPageChange={onPageChange}
					name="Telco"
				/>
			</div>
		</div>
	);
};

export default Telcos;
