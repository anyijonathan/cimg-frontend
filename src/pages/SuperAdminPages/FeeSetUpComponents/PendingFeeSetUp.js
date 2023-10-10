import React, { useState, useEffect } from "react";
import Searchbar from "../../../components/Searchbar";
import Notification from "../../../components/Notification";
import { useHistory } from "react-router-dom";
import { userSelector } from "../../../Redux/Slices/authSlice";
import {
	approveFeeSetup,
	rejectFeeSetup,
	getAllPendingFeeSetups,
	getAllApprovedFeeSetups,
	setPendingSetups,
	setApprovedSetups,
	setRejectedSetups,
	getAllRejectedFeeSetups,
	feeSetUpSelector,
	getFeeSetupById,
	setFeeSetupId,
} from "../../../Redux/Slices/feeSetUpSlice";
import { useDispatch, useSelector } from "react-redux";
import ActionModal from "../../../components/Modals/ActionModal";

const PendingFeeSetUp = () => {
	const [userId, setUserId] = useState(null);
	const [telcoId, setTelcoId] = useState();
	const [vendorId, setVendorId] = useState();

	const history = useHistory();
	const dispatch = useDispatch();

	const [generalStates, setGeneralStates] = useState({
		isActionModalOpen: false,
		actionReceiver: "",
		actionType: "",
		notificationText: "",
		status: "",
		isLoading: false,
	});

	const { emailAddress, userRole } = useSelector(userSelector);
	const { pendingFeeSetups } = useSelector(feeSetUpSelector);

	const createFee = () => {
		history.push("/app/admin/fee-setup/new-fee-setup");
	};


	const editFee = async (Id) => {
		dispatch(setFeeSetupId(Id));
		history.push("/app/admin/fee-setup/edit-fee-setup");
	};

	function openApproveFeeSetupModal(id, telcoId, vendorId) {
		setUserId(id);
		setTelcoId(telcoId);
		setVendorId(vendorId);
		setGeneralStates((prevState) => ({
			...prevState,
			actionType: "approve",
			actionReceiver: "Fee Setup",
			isActionModalOpen: true,
		}));
	}

	function openDeclineFeeSetupModal(id, telcoId, vendorId) {
		setUserId(id);
		setTelcoId(telcoId);
		setVendorId(vendorId);
		setGeneralStates((prevState) => ({
			...prevState,
			actionType: "decline",
			actionReceiver: "Fee Setup",
			isActionModalOpen: true,
		}));
	}

	function closeActionModal() {
		setGeneralStates((prevState) => ({
			...prevState,
			isActionModalOpen: false,
		}));
	}

	const getPendingFeeSetups = async () => {
		try {
			const response = await getAllPendingFeeSetups(
				emailAddress,
				userRole
			);
			if (response.data.code === "00") {
				dispatch(setPendingSetups(response.data.dataList));
				
			} else {
				setGeneralStates((prevState) => ({
					...prevState,
					status: "failure",
					notificationText: "error fetching pending feeSetups",
				}));
			}
		} catch (error) {
			setGeneralStates((prevState) => ({
				...prevState,
				status: "failure",
				notificationText: "error fetching pending feeSetups",
			}));
		}
	};

	const getApprovedFeeSetups = async () => {
		try {
			const response = await getAllApprovedFeeSetups(
				emailAddress,
				userRole
			);
			if (response.data.code === "00") {
				dispatch(setApprovedSetups(response.data.dataList));
			} else {
				setGeneralStates((prevState) => ({
					...prevState,
					status: "failure",
					notificationText: "error fetching pending feeSetups",
				}));
			}
		} catch (error) {
			setGeneralStates((prevState) => ({
				...prevState,
				status: "failure",
				notificationText: "error fetching pending feeSetups",
			}));
		}
	};

	const getDeclinedFeeSetups = async () => {
		try {
			const response = await getAllRejectedFeeSetups(
				emailAddress,
				userRole
			);
			if (response.data.code === "00") {
				dispatch(setRejectedSetups(response.data.dataList));
			} else {
				setGeneralStates((prevState) => ({
					...prevState,
					status: "failure",
					notificationText: "error fetching pending feeSetups",
				}));
			}
		} catch (error) {
			
		}
	};

	useEffect(() => {
		getPendingFeeSetups();
	}, []);

	const approveCreatedFeeSetup = async () => {
		try {
		
			const responseData = await approveFeeSetup(
				userId,
				telcoId,
				vendorId,
				emailAddress,
				userRole
			);

			if (responseData.code === "00") {
			setGeneralStates((prevState) => ({
				...prevState,
				isActionModalOpen: false,
				status: "success",
				notificationText: `${generalStates.actionReceiver} ${generalStates.actionType}d successfully`,
			}));
			getApprovedFeeSetups();
			getPendingFeeSetups();

			setTimeout(() => {
				setGeneralStates((prevState) => ({
					...prevState,
					status: "",
				}));
			}, 2000);
		}
		else{
			setGeneralStates((prevState) => ({
				...prevState,
				isActionModalOpen: false,
				status: "failure",
				notificationText: "fee setup approval failed please contact support",
			}));
		}
		} catch (error) {
			setGeneralStates((prevState) => ({
				...prevState,
				isActionModalOpen: false,
				status: "failure",
				notificationText: error.description,
			}));
		}
	};

	const rejectCreatedFeeSetup = async () => {
		try {
		
			const responseData = await rejectFeeSetup(
				userId,
				telcoId,
				vendorId,
				emailAddress,
				userRole
			);

			if (responseData.code === "00"){

			setGeneralStates((prevState) => ({
				...prevState,
				isActionModalOpen: false,
				status: "success",
				notificationText: `${generalStates.actionReceiver} ${generalStates.actionType}d successfully`,
			}));


			getDeclinedFeeSetups();
			getPendingFeeSetups();

			setTimeout(() => {
				setGeneralStates((prevState) => ({
					...prevState,
					status: "",
				}));
			}, 2000);
		}
		else {
			setGeneralStates((prevState) => ({
				...prevState,
				isActionModalOpen: false,
				status: "failure",
				notificationText: "fee setup decline failed please contact support",
			}));
			
		}
		} catch (error) {
			setGeneralStates((prevState) => ({
				...prevState,
				isActionModalOpen: false,
				status: "failure",
				notificationText: error.description,
			}));

		}
	};

	const actionModalFunction = async () => {
		if (generalStates.actionType === "approve") {
			await approveCreatedFeeSetup();
		} else if (generalStates.actionType === "decline") {
			await rejectCreatedFeeSetup();
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
				modalAction={() => actionModalFunction()}
			/>

			<div className="overflow-x-auto relative bg-white pl-6 pr-14 pb-2 rounded-lg">
				<table className="w-full text-sm text-left text-gray-500">
					<thead className="text-sm text-black-primary bg-dashboard-background">
						<tr>
							<th scope="col" className="py-3 px-6">
								Telco name
							</th>
							<th scope="col" className="py-3 px-6">
								Vendor name
							</th>
							<th scope="col" className="py-3 px-6">
								Charge type
							</th>
							<th scope="col" className="py-3 px-6">
								Actions
							</th>
						</tr>
					</thead>
					<tbody>
						{pendingFeeSetups.map((feeSetup) => {
							return (
								<tr
									key={feeSetup.id}
									className="bg-white border-b"
								>
									<td className="py-6 px-6 font-sm text-black-secondary whitespace-nowrap">
										<div className="flex items-center">
											<p className="font-sm text-black-secondary pl-2">
												{feeSetup.telcoName}
											</p>
										</div>
									</td>

									<td className="py-6 px-6 text-black-secondary">
										{feeSetup.vendorName}
									</td>
									<td className="py-6 px-6 text-black-secondary">
										{feeSetup.chargeType}
									</td>
									<td className="py-6 px-6 text-red-primary">
										<div className="flex justify-between">
											<button
												onClick={()=> editFee(feeSetup.id)}
												className="text-base font-[450] text-purple-primary mr-5"
											>
												View
											</button>
											<button
												onClick={() =>
													openApproveFeeSetupModal(
														feeSetup.id,
														feeSetup.telcoId,
														feeSetup.vendorId
													)
												}
												className="text-base font-[450] text-green-500 mr-2"
											>
												Approve
											</button>
											<button
												onClick={() =>
													openDeclineFeeSetupModal(
														feeSetup.id,
														feeSetup.telcoId,
														feeSetup.vendorId
													)
												}
												className="text-base font-[450] text-error-primary"
											>
												Decline
											</button>
										</div>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default PendingFeeSetUp;
