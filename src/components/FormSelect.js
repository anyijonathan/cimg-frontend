import React from "react";

const FormSelect = ({
	onChange,
	id,
	label,
	type,
	options,
	value,
	defaultValue,
	className,
}) => {
	return (
		<div className="font-circular-std">
			{label && (
				<label className="block mb-4 text-sm font-medium text-black-secondary">
					{label}
				</label>
			)}

			<select
				id={id}
				className={
					`border border-opacity-50 border-black-40 text-black-40 text-sm rounded outline-none focus:border-black-40 focus:border-opacity-50 focus:ring-gray-200 block pl-4 pr-[0.625rem]` +
					className
				}
				type={type}
				onChange={onChange}
				value={value}
				defaultValue={defaultValue}
				
			>
				{options &&
					options.map((options) => (
						<option key={options.id} value={options.value}>
							{options.name}
						</option>
					))}
			</select>
		</div>
	);
};

export default FormSelect;
