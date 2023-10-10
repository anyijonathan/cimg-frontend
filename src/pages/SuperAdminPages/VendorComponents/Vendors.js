import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Searchbar from "../../../components/Searchbar";
import Status from "../../../components/Status";
import { Pagination } from "@windmill/react-ui";
import Notification from "../../../components/Notification";
import {
	getAllVendors,
	getVendorInfo,
	setAllVendorsList,
	setPendingVendorsList,
	setApprovedVendorsList,
	setDeclinedVendorsList,
	getAllPendingVendors,
	getAllActiveVendors,
	getAllArchivedVendors,
} from "../../../Redux/Slices/vendorSlice";
import { filterHelper } from "../../../utils/HelperFunction";
import { getVendor } from "../../../Redux/Slices/vendorSlice";
import { useDispatch, useSelector } from "react-redux";
import PendingVendors from "./PendingVendors";
import ApprovedVendors from "./ApprovedVendors";
import DeclinedVendors from "./DeclinedVendors";
import { userSelector } from "../../../Redux/Slices/authSlice";
import { setAllTelcosList } from "../../../Redux/Slices/telcoSlice";

const Vendors = () => {
	const history = useHistory();
	const dispatch = useDispatch();
	const { emailAddress, userRole } = useSelector(userSelector);

	const [vendorList, setVendorList] = useState([]);
	const [pendingVendorList, setPendingVendorList] = useState([]);
	const [activeVendorList, setActiveVendorList] = useState([]);
	const [declinedVendorList, setDeclinedVendorList] = useState([]);

	const [page, setPage] = useState(1);
	const resultsPerPage = 5;
	const totalResults = vendorList.length;

	const allVendors = useSelector(
		(state) => state.vendorModule.allVendorsList
	);

	let paginatedVendors = allVendors.slice(
		(page - 1) * resultsPerPage,
		page * resultsPerPage
	);

	const [generalStates, setGeneralStates] = useState({
		isActionModalOpen: false,
		actionReceiver: "",
		actionType: "",
		modalHeader: "Add Vendor",
		notificationText: "",
		status: "",
		isLoading: false,
		buttonText: "Add vendor",
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

	// GETTING DATA ON PAGE LOAD
	const fetchVendorList = async () => {
		try {
			let responseData = await getAllVendors(emailAddress, userRole);

			setVendorList(responseData.dataList);
			dispatch(setAllVendorsList(responseData.dataList));
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
		fetchVendorList();
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
		let filteredResult = filterHelper(vendorList, searchFieldValue);

		if (searchFieldValue !== "") {
			dispatch(setAllVendorsList(filteredResult));
			setHidePagination(true);
		} else if (searchFieldValue === "") {
			setHidePagination(false);
			fetchVendorList();
		}
	};

	return (
		<div className="font-circular-std">
			<Notification
				notificationText={generalStates.notificationText}
				status={generalStates.status}
			/>
			<h2 className="text-xl font-bold text-black-secondary pb-9">
				Manage Vendors
			</h2>
			{/* ---------------------------------------------- Modals ------------------------------------------- */}

			{/*   ------------------------------------------- Modals ----------------------------------------------------  */}

			<div className="col-span-6 h-[27.1875rem] bg-white">
				{/*   --------------------------------------------- TAB Header ------------------------------------------------------------- */}
				<div className="flex w-full justify-end p-4">
					<div className="flex"></div>
				</div>
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
								All Vendors
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
						<hr />
					</ul>
					<hr className="px-6" />
				</div>

				{/* ---------------------------------------------------------ALL VENDORS Tab START ------------------------------------------------------------- */}
				<div className={openTab === 1 ? "block" : "hidden"}>
					<div className="flex justify-between w-full h-[4.8125rem] items-center px-6">
						<div className="flex">
							<Searchbar
								onChange={(e) => {
									e.preventDefault();
									filterVendorList(e.target.value);
								}}
								placeholder="Search vendor"
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
									<tr
										key={vendor.id}
										className="bg-white border-b"
									>
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
													viewVendorInfo(
														vendor.vendorName
													)
												}
												className="text-base font-[450] underline linear-gradient-text"
											>
												View vendor info
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
				{/* --------------------------------------------------------------------ALL VENDORS TAB END------------------------------------------ */}

				{/* ---------------------------------------------------------PENDING APPROVAL START TAB ------------------------------------------------------------- */}
				<div className={openTab === 2 ? "block" : "hidden"}>
					<PendingVendors />
				</div>
				{/* -------------------------------------------------------------------PENDING APPROVAL TAB END-------------------------------------- */}

				{/* ---------------------------------------------------------APPROVED Tab START ------------------------------------------------------------- */}
				<div className={openTab === 3 ? "block" : "hidden"}>
					<ApprovedVendors />
				</div>
				{/*  ................................................................................................................................... */}
				<div className={openTab === 4 ? "block" : "hidden"}>
					<DeclinedVendors />
				</div>
				{/* ------------------------------------------------------------APPROVED TAB END-------------------------------------- */}
			</div>
		</div>
	);
};

export default Vendors;
