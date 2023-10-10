import { Modal } from "flowbite-react";
import React, { Children } from "react";
import Button from "../Button";

const ActionModal = ({
  onClose,
  show,
  modalAction,
  modalHeader,
  modalClose,
  actionType,
  actionReceiver,
  isLoading,
  disabled,
  loadingText,
  Children,
}) => {
  return (
    <div className="font-circular-std">
      <Modal show={show} size="xl" popup={true} onClose={onClose}>
        <Modal.Header>
          <div className="p-6">
            <h3 className="w-[90%] text-lg font-bold text-black-secondary capitalize">{`${actionType}  ${actionReceiver}`}</h3>
          </div>
          <div className="md:w-[27.75rem]">
            <hr />
          </div>
        </Modal.Header>

        <Modal.Body>
          <div className="text-center w-full mt-11">
            <h3 className="mb-20 text-lg text-black-secondary font-medium">
              {`Are you sure you want to ${actionType} this ${actionReceiver}?`}
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                className="bg-transparent text-black-70 font-medium border-black-70 border-opacity-30"
                color="failure"
                onClick={modalClose}
              >
                Cancel
              </Button>
              <Button
                onClick={() => modalAction()}
                isLoading={isLoading}
                disabled={disabled}
              >
                {`Yes, ${actionType}`}
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ActionModal;
