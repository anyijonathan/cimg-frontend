import React, { useState } from "react";
import Searchbar from "../../../components/Searchbar";
import Notification from "../../../components/Notification";
import { useHistory } from "react-router-dom";
import PendingFeeSetUp from "./PendingFeeSetUp";
import ApprovedFeeSetUp from "./ApprovedFeeSetUp";
import DeclinedFeeSetUp from "./DeclinedFeeSetUp";

const FeeSetup = () => {
	const history = useHistory();
	const [openTab, setOpenTab] = useState(1);

	const [notificationText, setNotificationText] = useState("");
	const [status, setStatus] = useState("");

	const createFee = () => {
		history.push("/app/admin/fee-setup/new-fee-setup");
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

	return (
		<div className="font-circular-std">
			<Notification notificationText={notificationText} status={status} />
			<h2 className="text-2xl font-bold text-black-secondary pb-9">
				Fee setup
			</h2>
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
								} inline-flex items-center pl-6 w-full h-12 text-sm font-normal transition-colors duration-150`}
							>
								Pending Approvals
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
								} inline-flex items-center pl-6 w-full h-12 text-sm font-normal transition-colors duration-150`}
							>
								Approved Changes
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
								} inline-flex items-center pl-6 w-full h-12 text-sm font-normal transition-colors duration-150`}
							>
								Declined Changes
							</button>
							<hr
								className={`${
									openTab === 3
										? "border-purple-900 ml-6"
										: ""
								}`}
							/>
						</li>
					</ul>
					<hr className="px-6" />
				</div>

				{/*-----------------PENDING APPROVALS TAB START--------------------- */}
				<div className={openTab === 1 ? "block" : "hidden"}>
					<PendingFeeSetUp />
				</div>
				{/*-----------------APPROVED CHANGES TAB START--------------------- */}
				<div className={openTab === 2 ? "block" : "hidden"}>
					<ApprovedFeeSetUp />
				</div>
				{/*-----------------DECLINED CHANGES TAB START--------------------- */}
				<div className={openTab === 3 ? "block" : "hidden"}>
					<DeclinedFeeSetUp />
				</div>
			</div>
		</div>
	);
};

export default FeeSetup;
