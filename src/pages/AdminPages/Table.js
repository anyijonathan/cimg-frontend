import React from "react";
import Status from "../../components/Status";
import { Pagination } from "@windmill/react-ui";

const Table = ({
	data,
	openEditModal,
	openEnableModal,
	openDisableModal,
	openArchiveModal,
	openUnarchiveModal,
	viewInfo,
	hidePagination,
	totalResults,
	resultsPerPage,
	onPageChange,
	name,
}) => {
	return (
		<div className="overflow-x-auto relative bg-white pl-6 pr-14 pb-2 rounded-lg">
			<table className="w-full text-sm text-left text-gray-500">
				<thead className="text-sm text-black-primary opacity-70 bg-dashboard-background">
					<tr>
						<th
							scope="col"
							className="py-3 px-6 text-black-primary"
						>
							{name} name
						</th>
						<th
							scope="col"
							className="py-3 px-6 text-black-primary"
						>
							Status
						</th>
						<th
							scope="col"
							className="py-3 px-6 text-black-primary"
						>
							Actions
						</th>
					</tr>
				</thead>
				<tbody>
					{data.map((component) => (
						<tr key={component.id} className="bg-white border-b">
							<td className="py-6 px-6 font-sm text-black-secondary whitespace-nowrap">
								{name === "Vendor"
									? component.vendorName
									: component.telcoName}
							</td>

							<td className="py-6 px-6 text-green-primary">
								{component.approvedStatus === 0 && (
									<Status pending />
								)}
								{component.approvedStatus === 1 && (
									<Status active />
								)}
								{component.approvedStatus === 2 && (
									<Status inactive />
								)}
								{component.approvedStatus === 4 && (
									<Status archived />
								)}
							</td>
							<td className="py-6 px-6 text-red-primary">
								<div className="flex justify-between">
									{name === "Vendor" ? (
										<button
											onClick={() =>
												openEditModal(
													component.id,
													component.vendorName
												)
											}
											className="text-base font-[450] text-purple-primary"
										>
											Edit
										</button>
									) : (
										<button
											onClick={() =>
												openEditModal(
													component.id,
													component.telcoName
												)
											}
											className="text-base font-[450] text-purple-primary"
										>
											Edit
										</button>
									)}
									{/*  --------------------------------------------------------------------------------------------------------------------------------   */}
									{component.approvedStatus === 0 ||
									component.approvedStatus === 4 ? (
										<button
											disabled
											onClick={() =>
												component.approvedStatus === 2
													? openEnableModal(
															component.id
													  )
													: openDisableModal(
															component.id
													  )
											}
											className={`text-base font-[450] text-black-secondary opacity-30`}
										>
											{component.approvedStatus === 2
												? "Enable"
												: "Disable"}
										</button>
									) : (
										<button
											onClick={() =>
												component.approvedStatus === 2
													? openEnableModal(
															component.id
													  )
													: openDisableModal(
															component.id
													  )
											}
											className={`text-base font-[450] text-green-primary`}
										>
											{component.approvedStatus === 2
												? "Enable"
												: "Disable"}
										</button>
									)}

									{/* ------------------------------------------------------------------------------------------------------------------------------- */}
							{component.approvedStatus === 4 ?	<button
										onClick={() =>openUnarchiveModal(component.id)}
										className="text-base font-[450] text-purple-primary"
									>
									unarchive
									</button> 
									:
									 <button
									 disabled
										className="text-base font-[450] text-gray-400"
									>
									archive
									</button> }


								</div>
							</td>
							<td className="py-6 px-6 text-red-primary text-center">
								{name === "Vendor" ? (
									<button
										onClick={() =>
											viewInfo(component.vendorName)
										}
										className="text-base font-[450] underline linear-gradient-text"
									>
										View {name} info
									</button>
								) : (
									<button
										onClick={() =>
											viewInfo(component.telcoName)
										}
										className="text-base font-[450] underline linear-gradient-text"
									>
										View {name} info
									</button>
								)}
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
	);
};

export default Table;
