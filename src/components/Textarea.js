import React from "react";

const Textarea = ({
  id,
  label,
  classname,
  placeholder,
  name,
  onChange,
  value,
}) => {
  return (
    <div className="font-circular-std pt-4">
      {label && (
        <label
          htmlFor={id}
          className="block mb-4 text-sm font-medium text-black-secondary"
        >
          {label}
        </label>
      )}
      <textarea
        onChange={onChange}
        id={id}
        rows="4"
        name={name}
        className={
          `block p-2.5 w-full md:w-[27.25rem] border border-opacity-50 border-black-40 text-black-40 text-sm rounded outline-none focus:border-black-40 resize-none focus:border-opacity-50 focus:ring-gray-200 ring-transparent" placeholder= ${placeholder}` +
          classname
        }
        value={value}
      ></textarea>
    </div>
  );
};

export default Textarea;
