import React from "react";
import Breadcrumb from "../../components/Breadcrumb";
import InfoCard from "../../components/InfoCard";
import Status from "../../components/Status";
import { useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment/moment";
import { formatAmountWithCommas } from "../../utils/HelperFunction";

const TelcoInfo = () => {
	const telcoInfo = useSelector((state) => state.telcoModule.telcoInfo);

	const [successValue, setSuccessValue] = useState("0");
	const [failedValue, setFailedValue] = useState("0");

	let date = moment(telcoInfo.data.dateAdded).format("DD/MM/YYYY");

	let totalAllSuccess =
		formatAmountWithCommas(telcoInfo.data.airtimeDataBillerVendorTransactionsAggregate
			.totalAllSuccess);
			console.log(totalAllSuccess)
	let totalAllFailed =
	formatAmountWithCommas(telcoInfo.data.airtimeDataBillerVendorTransactionsAggregate
		.totalAllFailed);

	let totalDailySuccess =
		formatAmountWithCommas(telcoInfo.data.airtimeDataBillerVendorTransactionsAggregate
			.totalDailySuccess);
	let totalDailyFailed =
		formatAmountWithCommas(telcoInfo.data.airtimeDataBillerVendorTransactionsAggregate
			.totalDailyFailed);
	let totalWeeklySuccess =
		formatAmountWithCommas(telcoInfo.data.airtimeDataBillerVendorTransactionsAggregate
			.totalWeeklySuccess);
	let totalWeeklyFailed =
		formatAmountWithCommas(telcoInfo.data.airtimeDataBillerVendorTransactionsAggregate
			.totalWeeklyFailed);
	let totalmonthlySuccess =
		formatAmountWithCommas(telcoInfo.data.airtimeDataBillerVendorTransactionsAggregate
			.totalmonthlySuccess);
	let totalmonthlyFailed =
		formatAmountWithCommas(telcoInfo.data.airtimeDataBillerVendorTransactionsAggregate
			.totalmonthlyFailed);

	const vendor = telcoInfo.data.vendor;

	const [cardSuccessValue, setCardSuccessValue] = useState(totalAllSuccess);
	const [cardFailedValue, setCardFailedValue] = useState(totalAllFailed);

	let PeriodOption = [
		{
			id: 1,
			value: "",
			name: "Today",
		},
		{
			id: 2,
			value: "",
			name: "This week",
		},
		{
			id: 3,
			value: "",
			name: "This month",
		},
	];

	const selectStatus = (status) => {
		if (status === "0") {
			return <Status pending />;
		} else if (status === "1") {
			return <Status active />;
		} else if (status === "2") {
			return <Status inactive />;
		} else if (status === "4") {
			return <Status archived />;
		}
	};

	const handleSuccessChange = (e) => {
		const { value } = e.target;
		setSuccessValue(value);

		if (value === "Total") {
			setCardSuccessValue(totalAllSuccess);
		} else if (value === "Today") {
			setCardSuccessValue(totalDailySuccess);
		} else if (value === "Weekly") {
			setCardSuccessValue(totalWeeklySuccess);
		} else if (value === "Monthly") {
			setCardSuccessValue(totalmonthlySuccess);
		}
	};

	const handleFailedChange = (e) => {
		const { value } = e.target;
		setFailedValue(value);

		if (value === "Total") {
			setCardFailedValue(totalAllFailed);
		} else if (value === "Today") {
			setCardFailedValue(totalDailyFailed);
		} else if (value === "Weekly") {
			setCardFailedValue(totalWeeklyFailed);
		} else if (value === "Monthly") {
			setCardFailedValue(totalmonthlyFailed);
		}
	};



	return (
		<div className="font-circular-std">
			<Breadcrumb
				firstLayer="Manage Telcos"
				secondLayer="Telco information"
				firstLayerLink="/app/admin/telcos"
			/>

			<h2 className="mt-11 mx-10 text-xl font-bold text-black-secondary pb-6">
				Telco information
			</h2>
			<hr className="mb-7 mx-10" />
			<div className="bg-white">
				<div className="px-10 pt-6 pb-[2.5rem] gap-3 block md:grid grid-cols-9">
					<div className="col-span-3">
						<InfoCard
							additionalStyle="mb-[-20px]"
							title="Current Status"
							cardValue={selectStatus(telcoInfo.data.status)}
							additionalSelectStyle="hidden"
							additionalLinkStyle="text-xs"
						/>
					</div>

					<div className="col-span-3">
						<InfoCard
							title="Successful Transactions"
							cardValue={cardSuccessValue}
							options={PeriodOption}
							cardLink="/app/reports"
							additionalStyle="text-green-primary pb-4"
							symbol = "&#8358;"
							onChange={handleSuccessChange}
							
						/>
					</div>

					<div className="col-span-3">
						<InfoCard
							title="Failed Transactions"
							cardValue={cardFailedValue}
							options={PeriodOption}
							cardLink="/app/reports"
							additionalStyle="text-red-primary pb-4"
							symbol = "&#8358;"
							onChange={handleFailedChange}
						
						/>
					</div>
				</div>
				<hr className="mx-10 mb-10" />

				<div className="px-10 pt-6 pb-[4.5rem] gap-8 block md:grid grid-cols-9">
					<div className="h-56 col-span-6 rounded-lg flex pl-6 pt-6 pr-8 pb-11 justify-between border border-black-secondary border-opacity-5">
						<div>
							<div className="mb-14">
								<p className="text-sm font-medium text-black-70 mb-3 opacity-30">
									Telco name
								</p>
								<span className="text-sm font-medium text-black-secondary">
									{telcoInfo.data.telco}
								</span>
							</div>
							<div>
								<p className="text-sm font-medium text-black-70 mb-3 opacity-30">
									Date added
								</p>
								<span className="text-sm font-medium text-black-secondary">
									{date}
								</span>
							</div>
						</div>

						<div>
							<div className="mb-14">
								<p className="text-sm font-medium text-black-70 mb-3 opacity-30">
									Platform
								</p>
								<span className="text-sm font-medium text-black-secondary">
									{telcoInfo.data.platform}
								</span>
							</div>
							<div>
								<p className="text-sm font-medium text-black-70 mb-3 opacity-30">
									Current Vendor mapping
								</p>
								<span className="text-sm font-medium text-black-secondary">
									{vendor}
								</span>
							</div>
						</div>
					</div>
					<div className="bg-vendorInfo rounded-lg h-56 col-span-3 pl-6 pt-6 border border-black-secondary border-opacity-5">
						<div>
							<div className="mb-14">
								<p className="text-sm font-medium text-black-70 mb-3 opacity-30">
									Added by
								</p>
								<span className="text-sm font-medium text-black-secondary">
									{telcoInfo.data.addedBy}
								</span>
							</div>
							<div>
								<p className="text-sm font-medium text-black-70 mb-3 opacity-30">
									Approved by
								</p>
								<span className="text-sm font-medium text-black-secondary">
									{telcoInfo.data.approvedBy}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TelcoInfo;
