import React from "react";

const FormInput = ({
  label,
  endingLabel,
  endingLabelLink,
  placeholder,
  className = "",
  value,
  id,
  onChange,
  onBlur,
  type,
  name,
  autoComplete,
  inputMode,
  maxLength,
  required,
  readOnly,
  children,
}) => {
  return (
    <div className={className}>
      <div className="flex justify-between">
        {label && (
          <label
            htmlFor={id}
            className={`mb-3 text-sm font-medium font-circular-std text-black-secondary`}
          >
            {" "}
            {label}
          </label>
        )}

        {endingLabel && (
          <a
            href={endingLabelLink}
            className={`mb-3 text-sm text-right font-medium font-circular-std text-purple-secondary opacity-70`}
          >
            {" "}
            {endingLabel}
          </a>
        )}
      </div>
      <input
        id={id}
        className={
          `w-full md:w-[27.25rem] h-12 border border-purple-secondary text-black-40 text-sm rounded outline-none focus:border-purple-secondary focus:ring-purple-200  block py-4 pl-4 pr-[0.625rem]` +
          className
        }
        placeholder={placeholder || ""}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        name={name}
        type={type}
        autoComplete={autoComplete || ""}
        inputMode={inputMode}
        maxLength={maxLength}
        required={required}
        readOnly={readOnly}
      />
    </div>
  );
};

export default FormInput;
