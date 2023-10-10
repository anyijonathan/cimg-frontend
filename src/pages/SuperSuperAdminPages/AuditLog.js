import React, { useState, useEffect } from "react";
import Notification from "../../components/Notification";
import Button from "../../components/Button";
import FormSelect from "../../components/FormSelect";
import DatePicker from "react-datepicker";
import TransactionStatus from "../../components/TransactionStatus";
import { Pagination } from "@windmill/react-ui";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
	getTransactionInfo,
	getAuditLogs,
	getAirtimeDataTransactionInfo,
} from "../../Redux/Slices/reportSlice";
import moment from "moment/moment";
import { userSelector } from "../../Redux/Slices/authSlice";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

const AuditLog = () => {
	const history = useHistory();
	const dispatch = useDispatch();
	const { emailAddress, userRole } = useSelector(userSelector);

  let date = moment().format("dddd, Do MMMM YYYY");

	let telcoType = [
		{
			id: 0,
			value: "",
			name: "Select Telco",
		},
	];

	let vendorType = [
		{
			id: 0,
			value: "",
			name: "Select Vendor",
		},
	];

	const [openTab, setOpenTab] = useState(1);
	const [page, setPage] = useState(1);
	const [data, setData] = useState([]);
	const [auditData, setAuditData] = useState([]);

	const [notificationText, setNotificationText] = useState("");
	const [status, setStatus] = useState("");

	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");

	const [auditStartDate, setAuditStartDate] = useState("");
	const [auditEndDate, setAuditEndDate] = useState("");

	const [vendorTag, setVendorTag] = useState("");
	const [telco, setTelco] = useState("");
	const [reportListLength, setReportListLength] = useState(0);
	const [auditLogLength, setAuditLogLength] = useState(0);

	const [vendorOptions, setVendorOptions] = useState(vendorType);
	const [telcoOptions, setTelcoOptions] = useState(telcoType);
	const [statusOption, setStatusOption] = useState("");

	const [excelData, setExcelData] = useState([]);

	// EXPORT TO EXCEL
	const fileType = "xlsx";
	const fileExtension = ".xlsx";

	const exportToExcel = (list) => {
		const ws = XLSX.utils.json_to_sheet(list);
		const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
		const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
		const data = new Blob([excelBuffer], { type: fileType });
		FileSaver.saveAs(data, "auditLog" + "-" + date + fileExtension);
	};


	const handleStartDateChange = (date) => { 
		setAuditStartDate(date)
	}

	const handleEndDateChange = (date) => {
		setAuditEndDate(date)
	}

	//  GET AUDITLOGS
	const fetchAuditLogs = async () => {
		const covAuditStartDate = auditStartDate ? moment(auditStartDate).format("YYYY-MM-DDTHH:mm:ss.SSS") : ""
		const covAuditEndDate = auditEndDate ? moment(auditEndDate).format("YYYY-MM-DDTHH:mm:ss.SSS") : ""


		try {
      setNotificationText("")
      setStatus("")
      
			let responseData = await getAuditLogs(
				auditStartDate ? covAuditStartDate: "",
				covAuditEndDate,
				emailAddress,
				userRole
			);
      setExcelData(responseData.dataList)
			setAuditLogLength(responseData.dataList.length);
			setAuditData(
				responseData.dataList.slice(
					(page - 1) * resultsPerPage,
					page * resultsPerPage
				)
			);
		} catch (error) {
			setStatus("failure");
			setNotificationText("an error occured");
		}
	};



	// pagination setup
	const resultsPerPage = 10;

	// pagination change control
	function onPageChange(p) {
		setPage(p);	
	}

	useEffect(() => {
		fetchAuditLogs();
	  }, [page, auditStartDate, auditEndDate]);


	const handleAuditFilter = () => {
		fetchAuditLogs();
	};


	return (
		<div className="font-circular-std">
			<Notification notificationText={notificationText} status={status} />
			<div className="flex justify-between w-full mb-7">
				<div className="flex">
	      <h2 className="text-xl font-bold text-black-secondary pb-9">Audit Log</h2>
				</div>
				<div>
					<Button
						className="newfee-button"
						onClick={() => exportToExcel(excelData)}
					>
						Export
					</Button>
				</div>
			</div>

			{/*----------------AUDIT TAB START------------------ */}
			<div>
				<div className="rounded-lg px-10 py-6 bg-other-background">
					<div className="flex p-2 justify-between">
						<div className="flex justify-between">
							<DatePicker
								selected={auditStartDate}
								onChange={handleStartDateChange}
								className="mr-4 border border-opacity-50 border-purple-primary text-black-40 text-sm rounded outline-none focus:border-purple-primary focus:border-opacity-50 focus:ring-purple-200 block pl-4 pr-[0.625rem] md:w-[11.375rem] md:h-11"
								placeholderText="Select Start Date"
							/>
							<DatePicker
								selected={auditEndDate}
								onChange={handleEndDateChange}
								className="mr-4 border border-opacity-50 border-purple-primary text-black-40 text-sm rounded outline-none focus:border-purple-primary focus:border-opacity-50 focus:ring-purple-200 block pl-4 pr-[0.625rem] md:w-[11.375rem] md:h-11"
								placeholderText="Select End Date"
							/>
						</div>
						<div className="">
							<button
								onClick={() => handleAuditFilter()}
								className=" p-3 w-50 border border-purple-secondary rounded font-circular-std outline-none focus:border-purple-secondary focus:ring-purple-200 ease-in-out duration-150"
							>
								<p className="linear-gradient-text text-sm font-normal">
									Apply Filters
								</p>
							</button>
						</div>
					</div>
					<hr className="mt-4 mb-8 w-full" />
				</div>
				<div className="w-full overflow-x-auto relative">
					<table className="w-full text-left">
						<thead className=" w-full text-sm text-black-primary opacity-70 bg-gray-100">
							<tr>
								<th scope="col" className="py-3 px-6">
									ID
								</th>
								<th scope="col" className="py-3 px-6">
									Action
								</th>
								<th scope="col" className="py-3 px-6">
									Type
								</th>
								<th scope="col" className="py-3 px-6">
									Environment
								</th>
								<th scope="col" className="py-3 px-6">
									Timestamp
								</th>
                <th scope="col" className="py-3 px-6">
									IP address
								</th>
                <th scope="col" className="py-3 px-6">
									Host name
								</th>
							</tr>
						</thead>

						<tbody className="text-sm bg-other-background">
							{auditData.map((audit, i) => (
								<tr
									key={i}
									className="bg-white text-black-secondary border-b py-4 px-6"
								>
									<td className="py-6 px-6">
										{audit.userEmail}
									</td>
									<td className="py-6 px-6">
										{audit.auditAction}
									</td>
									<td className="py-6 px-6">
										{audit.module}
									</td>
									<td className="py-6 px-6">
										{audit.userRole}
									</td>
									<td className=" flex py-6 px-6">
										<button className="text-base font-[450] text-black-primary opacity-70 mr-6">
											{moment(audit.dateCreated).format(
												"MM/DD/YYYY"
											)}
										</button>
										<button className="text-base font-[450] text-purple-primary opacity-70">
											{moment(audit.dateCreated).format(
												"HH:MM a"
											)}
										</button>
									</td>
                  <td className="py-6 px-6">
										{audit.ipAddress}
									</td>
                  <td className="py-6 px-6">
										{audit.hostName}
									</td>
								</tr>
							))}
						</tbody>
					</table>
					<div className="mt-8 mb-10">
						<Pagination
							totalResults={auditLogLength}
							resultsPerPage={resultsPerPage}
							label="Table navigation"
							onChange={onPageChange}
						/>
					</div>
				</div>
				{/*----------------AUDIT TAB END------------------ */}
			</div>
		</div>
	);
};

export default AuditLog;
