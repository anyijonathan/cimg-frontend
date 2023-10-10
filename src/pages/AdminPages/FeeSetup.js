import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { userSelector } from "../../Redux/Slices/authSlice";
import {
	getAllApprovedFeeSetups,
	getFeeSetupById,
	setFeeSetupId,
} from "../../Redux/Slices/feeSetUpSlice";

const FeeSetup = () => {
	const history = useHistory();
	const dispatch = useDispatch();
	const { emailAddress, userRole } = useSelector(userSelector);

	const [data, setData] = useState([]);
	const [userId, setUserId] = useState(null);
	const [generalStates, setGeneralStates] = useState({
		isActionModalOpen: false,
		actionReceiver: "",
		actionType: "",
		notificationText: "",
		status: "",
		isLoading: false,
	});

	const createFee = () => {
		history.push("/app/fee-setup/new-fee-setup");
	};

	const editFee = async (Id) => {
		dispatch(setFeeSetupId(Id));
		history.push("/app/fee-setup/edit-fee-setup");
	};

	const getApprovedFeeSetups = async () => {
		try {
			const response = await getAllApprovedFeeSetups(
				emailAddress,
				userRole
			);
			if (response.data.code === "00") {
				setData(response.data.dataList);
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
	};
}

	useEffect(() => {
		getApprovedFeeSetups();
	}, []);

	return (
		<div>
			<div className="flex justify-between w-full h-[4.8125rem] items-center px-6">
				{/* 		<div className="flex">
					<Searchbar placeholder="search vendor" />
				</div> */}

				<div className="w-full flex justify-end md:mr-4">
					<button
						onClick={createFee}
						className="p-3 border border-purple-secondary rounded font-circular-std outline-none focus:border-purple-secondary focus:ring-purple-200 ease-in-out duration-150"
					>
						<p className="linear-gradient-text text-sm font-normal">
							New Fee Setup
						</p>
					</button>
				</div>
			</div>

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
						{data.map((feeSetup) => {
							return (
								<tr
									key={feeSetup.id}
									className="bg-white border-b"
								>
									<td className="py-6 px-6 font-sm text-black-secondary whitespace-nowrap">
										<div className="flex items-center">
											{/* <img src={MtnLogo}></img> */}
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
										<div className="flex">
											<button
												onClick={() =>
													editFee(feeSetup.id)
												}
												className="text- text-center font-[450] text-purple-primary mr-5"
											>
												View
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


export default FeeSetup;
