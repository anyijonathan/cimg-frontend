import React from "react";
import {
  ActiveStatusIcon,
  ArchivedStatusIcon,
  InactiveStatusIcon,
  PendingStatusIcon,
} from "../icons";

const Status = ({ active, inactive, pending, archived, declined }) => {
  return (
    <div>
      {inactive && (
        <div className="flex items-center">
          <InactiveStatusIcon />
          <p className="font-sm text-black-secondary pl-2">Inactive</p>
        </div>
      )}

      {active && (
        <div className="flex items-center">
          <ActiveStatusIcon />
          <p className="font-sm text-green-primary pl-2">Active</p>
        </div>
      )}

      {pending && (
        <div className="flex items-center">
          <PendingStatusIcon />
          <p className="font-sm text-yellow-primary pl-2">Pending</p>
        </div>
      )}

      {archived && (
        <div className="flex items-center">
          <ArchivedStatusIcon />
          <p className="font-sm text-black-secondary pl-2">Archived</p>
        </div>
      )}

      {declined && (
        <div className="flex items-center">
          <ArchivedStatusIcon />
          <p className="font-sm text-red-500 pl-2">Declined</p>
        </div>
      )}
    </div>
  );
};

export default Status;
