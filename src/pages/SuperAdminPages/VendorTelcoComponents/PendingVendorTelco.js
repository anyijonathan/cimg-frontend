import React, { useEffect, useState } from "react";
import Status from "../../../components/Status";
import Notification from "../../../components/Notification";
import {
	ApproveTelcoToVendorMap,
	DeclineTelcoToVendorMap,
	getAllApprovedMapping,
	getAllPendingMapping,
	getAllRejectedMapping,
	setApprovedList,
	setPendingList,
	setRejectedList,
	VendorTelcoSelector,
} from "../../../Redux/Slices/mappingSlice";
import { userSelector } from "../../../Redux/Slices/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { Pagination } from "@windmill/react-ui";

const PendingVendorTelco = () => {
	const dispatch = useDispatch();
	const { emailAddress, userRole } = useSelector(userSelector);
	const { pendingList } = useSelector(VendorTelcoSelector);

	const [notificationText, setNotificationText] = useState("");
	const [status, setStatus] = useState("");
	const [openTab, setOpenTab] = useState(1);
	const [mappingList, setMappingList] = useState([]);

	const [hidePagination, setHidePagination] = useState(false);

	const [page, setPage] = useState(1);

	const resultsPerPage = 5;
	const totalResults = mappingList.length;

	// pagination change control
	function onPageChange(p) {
		setPage(p);
	}

	async function approveVendor(telcoId, vendorId) {
		const data = {
			telcoId: telcoId,
			vendorId: vendorId,
		};

		try {
			let response = await ApproveTelcoToVendorMap(
				data,
				emailAddress,
				userRole
			);

			console.log(response);
			if (response.code === "00") {
				setStatus("success");
				setNotificationText(response.description);

				setTimeout(() => {
					setStatus("");
					setNotificationText("");
					getCurrentMappings();
					getApprovedMappings();
				}, 3000);
			} else {
				setStatus("failure");
				setNotificationText("an error occured, please try again");
			}
		} catch (error) {
			setStatus("failure");
			setNotificationText(error.response.data.description);
		}
	}

	async function declineVendor(telcoId, vendorId) {
		const data = {
			telcoId: telcoId,
			vendorId: vendorId,
		};

		try {
			let response = await DeclineTelcoToVendorMap(
				data,
				emailAddress,
				userRole
			);
			console.log(response);

			if (response.code === "00") {
				setStatus("success");
				setNotificationText(response.description);

				setTimeout(() => {
					setStatus("");
					setNotificationText("");
					getCurrentMappings();
					getRejectedMappings();
				}, 4000);
			} else {
				setStatus("failure");
				setNotificationText("an error occured, please try again");
			}
		} catch (error) {
			setStatus("failure");
			setNotificationText(error.response.data.description);
		}
	}

	const getCurrentMappings = async () => {
		try {
			const response = await getAllPendingMapping(emailAddress, userRole);
			if (response.code === "00") {
				setMappingList(
					response.dataList.slice(
						(page - 1) * resultsPerPage,
						page * resultsPerPage
					)
				);
				dispatch(setPendingList(response.dataList));
			} else {
				setStatus("failure");
				setNotificationText("error fetching current mappings");
			}
		} catch (error) {
			setStatus("failure");
			setNotificationText("error fetching current mappings");
		}
	};

	const getApprovedMappings = async () => {
		try {
			const response = await getAllApprovedMapping(
				emailAddress,
				userRole
			);
			if (response.code === "00") {
				dispatch(setApprovedList(response.dataList));
			} else {
				setStatus("failure");
				setNotificationText("error fetching pending mappings");
			}
		} catch (error) {
			setStatus("failure");
			setNotificationText("error fetching current mappings");
		}
	};

	const getRejectedMappings = async () => {
		try {
			const response = await getAllRejectedMapping(
				emailAddress,
				userRole
			);

			if (response.code === "00") {
				dispatch(setRejectedList(response.dataList));
			} else {
				setStatus("failure");
				setNotificationText("error fetching pending mappings");
			}
		} catch (error) {
			setStatus("failure");
			setNotificationText("error fetching current mappings");
		}
	};

	useEffect(() => {
		getCurrentMappings();
	}, []);

	return (
		<div className="col-span-6 h-[27.1875rem]">
			<Notification notificationText={notificationText} status={status} />

			{/* ---------------------------------------------- Modals ------------------------------------------- */}

			{/*   ------------------------------------------- Modals ----------------------------------------------------  */}

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
							<th scope="col" className="py-3 px-6">
								Actions
							</th>
							<th scope="col" className="py-3 px-6"></th>
						</tr>
					</thead>
					<tbody>
						{pendingList.map((mapping, i) => (
							<tr key={i} className="bg-white border-b py-4 px-6">
								<td className="py-6 px-6 font-sm text-black-secondary whitespace-nowrap">
									{mapping.telcoName}
								</td>
								<td className="py-6 px-6 text-black-secondary">
									{mapping.vendorName}
								</td>
								<td className="py-6 px-6">
									<div className="flex justify-around">
										<button
											onClick={() =>
												approveVendor(
													mapping.telcoId,
													mapping.vendorId
												)
											}
											className="text-base font-[450] text-green-primary"
										>
											Approve
										</button>
										<button
											onClick={() =>
												declineVendor(
													mapping.telcoId,
													mapping.vendorId
												)
											}
											className="text-base font-[450] text-red-primary"
										>
											Decline
										</button>
									</div>
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

export default PendingVendorTelco;
