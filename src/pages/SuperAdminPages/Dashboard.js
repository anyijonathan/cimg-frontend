import React, { useState, useEffect } from "react";
import InfoCard from "../../components/InfoCard";
import { LinkIcon } from "../../icons/index";
import FormSelect from "../../components/FormSelect";
import { useDispatch, useSelector } from "react-redux";
import {
	fetchDashboardData,
	fetchTranactionPercentage,
	fetchTransactionCompleted,
	fetchTransactions,
	fetchVendorTelcoMapping,
} from "../../Redux/Slices/dashboardSlice";
import { getAllActiveVendors } from "../../Redux/Slices/vendorSlice";
import { getAllActiveTelcos } from "../../Redux/Slices/telcoSlice";
import {
	PeriodFilterOption,
	PeriodOption,
	queryOptions,
} from "../../utils/constants";
import { Spinner } from "flowbite-react";
import { Pagination } from "@windmill/react-ui";
import { useHistory } from "react-router-dom";
import Notification from "../../components/Notification";
import { formatAmountWithCommas } from "../../utils/HelperFunction";
import { userSelector } from "../../Redux/Slices/authSlice";

const Dashboard = () => {
	const dispatch = useDispatch();
	const history = useHistory();

	const { emailAddress, userRole } = useSelector(userSelector);

	const [page, setPage] = useState(1);
	const [data, setData] = useState([]);
	const [notificationText, setNotificationText] = useState("");
	const [status, setStatus] = useState("");
	const [gettingDashboardData, setGettingDashboardData] = useState(false);
	const [dashboardStates, setDashboardStates] = useState({
		totalCompletedTransaction: 0,
		dailyCompletedTransaction: 0,
		weeklyCompletedTransaction: 0,
		monthlyCompletedTransaction: 0,
		totalSuccessPercentage: 0,
		totalDailySuccessPercentage: 0,
		totalWeeklySuccessPercentage: 0,
		totalMonthlySuccessPercentage: 0,
		totalFailurePercentage: 0,
		totalDailyFailurePercentage: 0,
		totalWeeklyFailurePercentage: 0,
		totalMonthlyFailurePercentage: 0,
		monthlyTransactions: [],
		weeklyTransactions: [],
		dailyTransactions: [],
		vendorTelcoMap: [],
		vendorList: [],
		telcoList: [],
		totalTransactionValue: 0,
		percentageSuccess: 0,
		percentageFailure: 0,
		transactionsList: [],
	});

	const handleTotalTransactionSelectChange = (e) => {
		const { value } = e.target;

		if (value === "Total") {
			setDashboardStates((prevStates) => ({
				...prevStates,
				totalTransactionValue:
					dashboardStates.totalCompletedTransaction,
			}));
		}
		if (value === "Today") {
			setDashboardStates((prevStates) => ({
				...prevStates,
				totalTransactionValue:
					dashboardStates.dailyCompletedTransaction,
			}));
		}
		if (value === "Weekly") {
			setDashboardStates((prevStates) => ({
				...prevStates,
				totalTransactionValue:
					dashboardStates.weeklyCompletedTransaction,
			}));
		}
		if (value === "Monthly") {
			setDashboardStates((prevStates) => ({
				...prevStates,
				totalTransactionValue:
					dashboardStates.monthlyCompletedTransaction,
			}));
		}
	};

	const handleTotalTransactionVolumeSelectChange = (e) => {
		const { value } = e.target;

		if (value === "Total" || value === "") {
			setDashboardStates((prevStates) => ({
				...prevStates,
				percentageSuccess: dashboardStates.totalFailurePercentage,
				percentageFailure: dashboardStates.totalSuccessPercentage,
			}));
		}
		if (value === "Today") {
			setDashboardStates((prevStates) => ({
				...prevStates,
				percentageSuccess: dashboardStates.totalDailySuccessPercentage,
				percentageFailure: dashboardStates.totalDailyFailurePercentage,
			}));
		}
		if (value === "Weekly") {
			setDashboardStates((prevStates) => ({
				...prevStates,
				percentageSuccess: dashboardStates.totalWeeklySuccessPercentage,
				percentageFailure: dashboardStates.totalWeeklyFailurePercentage,
			}));
		}
		if (value === "Monthly") {
			setDashboardStates((prevStates) => ({
				...prevStates,
				percentageSuccess:
					dashboardStates.totalMonthlySuccessPercentage,
				percentageFailure:
					dashboardStates.totalMonthlyFailurePercentage,
			}));
		}
	};

	const handleTransactionVolumeChange = (e) => {
		const { value } = e.target;

		if (value === "today") {
			setData(
				dashboardStates.dailyTransactions.slice(
					(page - 1) * resultsPerPage,
					page * resultsPerPage
				)
			);
		}
		if (value === "weekly") {
			setData(
				dashboardStates.weeklyTransactions.slice(
					(page - 1) * resultsPerPage,
					page * resultsPerPage
				)
			);
		}
		if (value === "monthly") {
			setData(
				dashboardStates.monthlyTransactions.slice(
					(page - 1) * resultsPerPage,
					page * resultsPerPage
				)
			);
		}
	};

	// pagination setup
	const resultsPerPage = 5;
	const totalResults = dashboardStates.transactionsList.length;

	// pagination change control

	function onPageChange(p) {
		setPage(p);
	}

	useEffect(() => {
		setData(
			dashboardStates.transactionsList.slice(
				(page - 1) * resultsPerPage,
				page * resultsPerPage
			)
		);
	}, [page]);

	// GETTING USER LIST ON PAGE LOAD
	const getDashboardData = () => {
		setGettingDashboardData(true);
		getTransactionStatistics();
		getTransactionPercentage();
		getTransactions();
		getVendorTelcoMap();
		getVendorList();
		getTelcoList();
	};

	const getTransactionStatistics = async () => {
		try {
			let transactionCompleted = await fetchTransactionCompleted();
			if (transactionCompleted.code === "00") {
				setDashboardStates((prevStates) => ({
					...prevStates,
					totalCompletedTransaction: formatAmountWithCommas(
						transactionCompleted.data.totalTrxnCompletedAll
					),
					dailyCompletedTransaction: formatAmountWithCommas(
						transactionCompleted.data.totalTrxnCompletedDaily
					),
					weeklyCompletedTransaction: formatAmountWithCommas(
						transactionCompleted.data.totalTrxnCompletedWeekly
					),
					monthlyCompletedTransaction: formatAmountWithCommas(
						transactionCompleted.data.totalTrxnCompletedmonthly
					),
					totalTransactionValue: formatAmountWithCommas(
						transactionCompleted.data.totalTrxnCompletedAll
					),
				}));
				setGettingDashboardData(false);
			}
		} catch (error) {
			setGettingDashboardData(false);
			setStatus("failure");
			setNotificationText(
				"error getting transaction value statistics, please contact support"
			);
		}
	};

	const getTransactionPercentage = async () => {
		try {
			let transactionPercentageToday = await fetchTranactionPercentage(
				emailAddress,
				userRole,
				queryOptions.today
			);
			let transactionPercentageThisWeek = await fetchTranactionPercentage(
				emailAddress,
				userRole,
				queryOptions.thisweek
			);
			let transactionPercentageThisMonth =
				await fetchTranactionPercentage(
					emailAddress,
					userRole,
					queryOptions.thismonth
				);
			let transactionPercentageAll = await fetchTranactionPercentage(
				emailAddress,
				userRole,
				queryOptions.all
			);
			if (
				transactionPercentageAll.code === "00" &&
				transactionPercentageThisMonth.code === "00" &&
				transactionPercentageThisWeek.code === "00" &&
				transactionPercentageToday.code === "00"
			) {
				setDashboardStates((prevStates) => ({
					...prevStates,
					// TOTAL
					totalSuccessPercentage:
						transactionPercentageAll.data.totalTrxnPercentageAllSuccessful.toFixed(
							1
						),

					totalFailurePercentage:
						transactionPercentageAll.data.totalTrxnPercentageAllFailed.toFixed(
							1
						),
					percentageSuccess:
						transactionPercentageAll.data.totalTrxnPercentageAllSuccessful.toFixed(
							1
						),
					percentageFailure:
						transactionPercentageAll.data.totalTrxnPercentageAllFailed.toFixed(
							1
						),
					// MONTHLY
					totalMonthlySuccessPercentage:
						transactionPercentageThisMonth.data.totalTrxnPercentagemonthlySuccess.toFixed(
							1
						),

					totalMonthlyFailurePercentage:
						transactionPercentageThisMonth.data.totalTrxnPercentagemonthlyFailed.toFixed(
							1
						),
					// WEEKLY
					totalWeeklySuccessPercentage:
						transactionPercentageThisWeek.data.totalTrxnPercentageWeeklySuccess.toFixed(
							1
						),
					totalWeeklyFailurePercentage:
						transactionPercentageThisWeek.data.totalTrxnPercentageWeeklyFailed.toFixed(
							1
						),
					// DAILY
					totalDailySuccessPercentage:
						transactionPercentageToday.data.totalTrxnPercentageDailySuccess.toFixed(
							1
						),
					totalDailyFailurePercentage:
						transactionPercentageToday.data.totalTrxnPercentageDailyFailed.toFixed(
							1
						),
				}));
				setGettingDashboardData(false);
			}
		} catch (error) {
			setGettingDashboardData(false);
			setStatus("failure");
			setNotificationText(
				"error getting transaction percentage, please contact support"
			);
		}
	};

	const getTransactions = async () => {
		try {
			let transactionsToday = await fetchTransactions(
				emailAddress,
				userRole,
				queryOptions.today
			);
			let transactionsThisWeek = await fetchTransactions(
				emailAddress,
				userRole,
				queryOptions.thisweek
			);
			let transactionsThisMonth = await fetchTransactions(
				emailAddress,
				userRole,
				queryOptions.thismonth
			);
			if (
				transactionsToday.code === "00" &&
				transactionsThisWeek.code === "00" &&
				transactionsThisMonth.code === "00"
			) {
				setDashboardStates((prevStates) => ({
					...prevStates,
					monthlyTransactions:
						transactionsThisMonth.data.telcoAndTrxThisMonth,
					weeklyTransactions:
						transactionsThisWeek.data.telcoAndTrxThisWeek,
					dailyTransactions: transactionsToday.data.telcoAndTrxToday,
					transactionsList: transactionsToday.data.telcoAndTrxToday,
				}));

				setData(
					transactionsToday.data.telcoAndTrxToday.slice(
						(page - 1) * resultsPerPage,
						page * resultsPerPage
					)
				);
				setGettingDashboardData(false);
			}
		} catch (error) {
			setGettingDashboardData(false);
			setStatus("failure");
			setNotificationText(
				"error getting recent transactions, please contact support"
			);
		}
	};

	const getVendorTelcoMap = async () => {
		try {
			let vendorTelcoMap = await fetchVendorTelcoMapping();
			if (vendorTelcoMap.code === "00") {
				setDashboardStates((prevStates) => ({
					...prevStates,
					vendorTelcoMap: vendorTelcoMap.data,
				}));
			}
			setGettingDashboardData(false);
		} catch (error) {
			setGettingDashboardData(false);
			setStatus("failure");
			setNotificationText(
				"error getting vendor-telco mappings, please contact support"
			);
		}
	};

	const getVendorList = async () => {
		try {
			let vendorData = await getAllActiveVendors();
			if (vendorData.code === "00") {
				setDashboardStates((prevStates) => ({
					...prevStates,
					vendorList: vendorData.dataList,
				}));
			}
			setGettingDashboardData(false);
		} catch (error) {
			setGettingDashboardData(false);
			setStatus("failure");
			setNotificationText(
				"error getting vendor list, please contact support"
			);
		}
	};

	const getTelcoList = async () => {
		try {
			let telcoData = await getAllActiveTelcos();
			if (telcoData.code === "00") {
				setDashboardStates((prevStates) => ({
					...prevStates,
					telcoList: telcoData.dataList,
				}));
				setGettingDashboardData(false);
			}
		} catch (error) {
			setGettingDashboardData(false);
			setStatus("failure");
			setNotificationText(
				"error getting telco list, please contact support"
			);
		}
	};

	useEffect(() => {
		getDashboardData();
	}, []);

	return (
		<div>
			{gettingDashboardData === true && (
				<div>
					<div className="text-center">
						<Spinner
							aria-label="Center-aligned spinner example"
							size="xl"
							color="purple"
						/>
						<p className="text-lg text-purple-primary">
							{" "}
							getting dashboard data
						</p>
					</div>
				</div>
			)}

			{gettingDashboardData === false && (
				<div className="md:grid gap-8 font-circular-std">
					<Notification
						notificationText={notificationText}
						status={status}
					/>
					<div className="col-span-2 mt-8 h-[22.9375rem]">
						<InfoCard
							title="Total transactions completed"
							cardValue={`${dashboardStates.totalTransactionValue}`}
							symbol="&#8358;"
							options={PeriodFilterOption}
							onChange={handleTotalTransactionSelectChange}
							cardLink="/app/admin/reports"
							additionalStyle="text-purple-primary pb-4"
							linkText="View more details"
						/>
						<InfoCard
							title="Total transactions completed"
							cardValue={`${dashboardStates.percentageSuccess}%`}
							spanText={`${dashboardStates.percentageFailure}%`}
							options={PeriodFilterOption}
							onChange={handleTotalTransactionVolumeSelectChange}
							cardLink="/app/admin/reports"
							additionalStyle="text-green-primary pb-4"
							linkText="View more details"
						/>
					</div>

					<div className="col-span-4 my-8 pb-8 border border-black-secondary border-opacity-5 rounded-lg">
						<div className="overflow-x-auto relative bg-white pl-6 pt-6 pr-14 pb-2 rounded-lg">
							<table className="w-full text-sm text-left text-gray-500">
								<thead className="text-base font-bold text-black-secondary">
									<tr>
										<td> Telco/Vendor Switch</td>
									</tr>
								</thead>
								<tbody>
									{dashboardStates.vendorTelcoMap.map(
										(user, i) => (
											<tr
												key={i}
												className="bg-white border-b"
											>
												<td className="py-6 px-6 font-sm text-black-secondary whitespace-nowrap">
													<div className="flex items-center">
														<p className="font-sm text-black-secondary pl-2">
															{user.telcoName}
														</p>
													</div>
												</td>
												<td className="py-6 px-6">
													<LinkIcon />
												</td>
												<td className="py-6 px-6">
													{user.vendorName}
												</td>
												<td className="py-6 px-6">
													<a
														href="/app/vendor-telco"
														className="text-purple-primary"
													>
														Switch{" "}
													</a>
												</td>
											</tr>
										)
									)}
								</tbody>
							</table>
						</div>
					</div>

					<div className="col-span-6 border border-black-secondary border-opacity-5 rounded-lg">
						<div className="flex justify-between w-full bg-white h-[4.8125rem] items-center px-6">
							<div className="flex">
								<h2 className="text-base font-bold text-black-secondary pr-7 pt-[0.2rem]">
									Transaction Volume
								</h2>
								<FormSelect
									className="border border-none text-black-70 text-xs rounded-lg outline-none focus:border-white focus:ring-white block w-4/5 h-11/12"
									options={PeriodOption}
									onChange={handleTransactionVolumeChange}
								/>
							</div>
							<div className="items-end">
								<a
									href="/app/admin/reports"
									className="text-sm text-purple-primary"
								>
									View All Transactions
								</a>
							</div>
						</div>
						<div className="overflow-x-auto relative bg-white pl-6 pr-14 pb-2 rounded-lg">
							<table className="w-full text-sm text-left text-gray-500">
								<thead className="text-sm text-black-primary opacity-70 bg-dashboard-background">
									<tr>
										<th
											scope="col"
											className="py-3 px-6 text-center"
										>
											Telco name
										</th>
										<th
											scope="col"
											className="py-3 px-6 text-center"
										>
											Successful Transactions
										</th>
										<th
											scope="col"
											className="py-3 px- text-center"
										>
											Failed Transactions
										</th>
									</tr>
								</thead>
								<tbody>
									{data.map((transaction, i) => (
										<tr
											key={i}
											className="bg-white border-b py-4 px-6 text-center"
										>
											<td className="font-medium text-gray-900 whitespace-nowrap">
												{transaction.telco}
											</td>
											<td className="py-6 px-6 text-green-primary text-center">
												&#8358;
												{formatAmountWithCommas(
													transaction.successTrxn
												)}
											</td>
											<td className="py-6 px-6 text-red-primary text-center">
												&#8358;{" "}
												{formatAmountWithCommas(
													transaction.failedTxn
												)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
							<Pagination
								totalResults={totalResults}
								resultsPerPage={resultsPerPage}
								label="Table navigation"
								onChange={onPageChange}
							/>
						</div>
					</div>

					<div className="col-span-3 border border-black-secondary border-opacity-5 rounded-lg">
						<div className="overflow-x-auto relative bg-white pl-6 pt-6 pr-14 pb-2 rounded-lg">
							<table className="w-full text-sm text-left text-gray-500">
								<thead className="text-base font-bold text-black-secondary pt-4 pb-6">
									<tr>
										<td>Vendors Available </td>
									</tr>
								</thead>
								<tbody>
									{dashboardStates.vendorList.map(
										(vendor, i) => (
											<tr
												key={i}
												className="bg-white border-b py-4 px-6"
											>
												<td className="font-sm text-black-secondary whitespace-nowrap py-4 px-6">
													{vendor.vendorName}
												</td>
											</tr>
										)
									)}
								</tbody>
							</table>
						</div>
					</div>

					<div className="col-span-3 border border-black-secondary border-opacity-5 rounded-lg">
						<div className="overflow-x-auto relative bg-white pl-6 pt-6 pr-14 pb-2 rounded-lg">
							<table className="w-full text-sm text-left text-gray-500">
								<thead className="text-base font-bold text-black-secondary pb-6 pt-4">
									<tr>
										<td> Telcos Available </td>
									</tr>
								</thead>
								<tbody>
									{dashboardStates.telcoList.map(
										(telco, i) => (
											<tr
												key={i}
												className="bg-white border-b py-4 px-6"
											>
												<td className="font-sm text-black-secondary whitespace-nowrap py-4 px-6">
													{telco.telcoName}
												</td>
											</tr>
										)
									)}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Dashboard;
