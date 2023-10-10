import React, { useState, useEffect } from "react";
import Searchbar from "../../../components/Searchbar";
import MtnLogo from "../../../asset/images/mtnLogo.jpg";
import { useHistory } from "react-router-dom";
import { userSelector } from "../../../Redux/Slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import {
	feeSetUpSelector,
	getAllRejectedFeeSetups,
	setFeeSetupId,
	setRejectedSetups,
} from "../../../Redux/Slices/feeSetUpSlice";

const DeclinedFeeSetUp = () => {
	const [userId, setUserId] = useState(null);
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
	const { rejectedFeeSetups } = useSelector(feeSetUpSelector);

	const createFee = () => {
		history.push("/app/admin/fee-setup/new-fee-setup");
	};


	const editFee = async (Id) => {
		dispatch(setFeeSetupId(Id));
		history.push("/app/admin/fee-setup/edit-fee-setup");
	};

	const getDeclinedFeeSetups = async () => {
		try {
			const response = await getAllRejectedFeeSetups(
				emailAddress,
				userRole
			);
			if (response.data.code === "00") {
				// dispatch(setRejectedSetups(response.data.dataList));
				
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

	useEffect(() => {
		getDeclinedFeeSetups();
	}, []);

	return (
		<div>
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
						{rejectedFeeSetups.map((feeSetup) => {
							return (
								<tr className="bg-white border-b">
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

											<button className="text-base font-[450] text-green-500 text-opacity-40 mr-2">
												Approve
											</button>
											<button className="text-base font-[450]  text-red-500 text-opacity-40 ">
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

export default DeclinedFeeSetUp;
