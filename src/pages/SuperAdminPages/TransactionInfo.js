import React from "react";
import Breadcrumb from "../../components/Breadcrumb";
import Status from "../../components/Status";
import TransactionStatus from "../../components/TransactionStatus";
import { useSelector } from "react-redux";

const TransactionInfo = () => {
  const transactionInfo = useSelector((state) => state.reports.data);

  const status = transactionInfo.flag;
  const customerName = transactionInfo.customerName;
  const platform = transactionInfo.platform;
  const transactionAmount = transactionInfo.amount;
  const reason = transactionInfo.responseDescr;
  const transactionDate = transactionInfo.tranDate;
  const type = transactionInfo.transType;
  const phoneNumber = transactionInfo.sourcePhone;
  const customerAccount = transactionInfo.sourceAccount;
  const requestId = transactionInfo.requestid

  return (
    <div className="font-circular-std">
      <Breadcrumb
        firstLayer="Reports"
        secondLayer="View transaction"
        firstLayerLink="/app/admin/reports"
      />
      <h2 className="mt-11 mx-10 text-xl font-bold text-black-secondary pb-6">
        Transaction details
      </h2>
      <hr className="mb-7 mx-10" />
      <div className="bg-white">
        <div className="px-10 pt-6 pb-[4.5rem] gap-8 block md:grid grid-cols-8 ">
          <div className="rounded-lg h-56 col-span-2 pl-6 pt-6 border border-black-secondary border-opacity-5">
            <div>
              <div className="mb-14">
                <p className="text-sm font-medium text-black-70 mb-3 opacity-30">
                  Status
                </p>
                <TransactionStatus status={status} />
              </div>
              <div>
                <p className="text-sm font-medium text-black-70 mb-3 opacity-30">
                  Reason
                </p>
                <span className="text-sm font-medium text-black-secondary">
                  {reason}
                </span>
              </div>
            </div>
          </div>

          <div className="h-56 col-span-6 rounded-lg flex pl-6 pt-6 pr-8 pb-11 justify-between border border-black-secondary border-opacity-5">
         <div>

          <div className="mb-14">
                <p className="text-sm font-medium text-black-70 mb-3 opacity-30">
                  Request Id
                </p>
                <span className="text-sm font-medium text-black-secondary">
                  {requestId}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-black-70 mb-3 opacity-30">
                  Transaction date
                </p>
                <span className="text-sm font-medium text-black-secondary">
                  {new Date(transactionDate).toLocaleDateString()}
                </span>
              </div>
              </div>
          
            <div>
              <div className="mb-14">
                <p className="text-sm font-medium text-black-70 mb-3 opacity-30">
                  Source Account
                </p>
                <span className="text-sm font-medium text-black-secondary">
                  {customerAccount}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-black-70 mb-3 opacity-30">
                  Type
                </p>
                <span className="text-sm font-medium text-black-secondary">
                  {type}
                </span>
              </div>
          
           
            </div>

            <div>
              <div className="mb-14">
                <p className="text-sm font-medium text-black-70 mb-3 opacity-30">
                  Platform
                </p>
                <span className="text-sm font-medium text-black-secondary">
                  {platform}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-black-70 mb-3 opacity-30">
                  Phone number
                </p>
                <span className="text-sm font-medium text-black-secondary">
                  {phoneNumber}
                </span>
              </div>
         
            </div>

            <div>
              <div className="mb-14">
                <p className="text-sm font-medium text-black-70 mb-3 opacity-30">
                  Transaction amount
                </p>
                <span className="text-sm font-medium text-black-secondary">
                  {transactionAmount}
                </span>
              </div>
     
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionInfo;
