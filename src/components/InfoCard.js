import React from "react";
import FormSelect from "./FormSelect";
import { Card, CardBody } from "@windmill/react-ui";

function InfoCard({
  title,
  cardValue,
  id,
  type,
  onChange,
  value,
  options,
  additionalStyle,
  spanText,
  cardLink,
  linkText,
  additionalSelectStyle,
  additionalCardStyle,
  additionalLinkStyle,
  symbol
}) {
  return (
    <Card
      className={`xl:w-96 ${additionalCardStyle} md:h-44 mb-6 pb-4 pl-4 ring-white bg-other-background  border border-black-secondary border-opacity-5`}
    >
      <CardBody className="flex">
        <div className=" xl:w-96 pt-[0.2rem]">
          <p className="text-sm xl:text-base font-bold text-black-secondary pb-6">
            {title}
          </p>
          <p className={`md:text-[18px] xl:text-3xl font-bold + ${additionalStyle}`}>
          {symbol} {cardValue}
            <span className="text-sm font-bold pl-3 text-black-70 opacity-70">
              {spanText}
            </span>
          </p>
          <a
            href={`${cardLink || ""} `}
            className={`font-bold ${additionalLinkStyle} text-sm text-purple-primary opacity-70`}
          >
            {linkText}
          </a>
        </div>

        <select
          id={id}
          className={`bg-gray-50 border border-none text-black-70 text-xs text-sm rounded-lg outline-none focus:border-white cursor-pointer focus:ring-white block  md:w-2/6 h-1/5 ${additionalSelectStyle}`}
          type={type}
          onChange={onChange}
          value={value}
        >
      
           {options &&
            options.map((options) => (
              <option key={options.id} value={options.value}>
                {options.name}
              </option>
            ))} 

        </select>
      </CardBody>
    </Card>
  );
}

export default InfoCard;
