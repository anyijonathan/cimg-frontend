import React from "react";
import { ActiveStatusIcon, FailedStatusIcon } from "../icons";

const TransactionStatus = ({ status }) => {
  return (
    <div>
      {status === "Y" && (
        <div className="flex items-center">
          <ActiveStatusIcon />
          <p className="font-sm text-green-primary pl-2">Successful</p>
        </div>
      )}

      {status !== "Y" && (
        <div className="flex items-center">
          <FailedStatusIcon />
          <p className="font-sm text-red-primary pl-2">Failed</p>
        </div>
      )}
    </div>
  );
};

export default TransactionStatus;
