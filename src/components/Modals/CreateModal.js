import { Modal } from "flowbite-react";
import React, { Children } from "react";
import Button from "../Button";
import FormInput from "../FormInput";
import FormSelect from "../FormSelect";
import Textarea from "../Textarea";

const CreateModal = ({
  onClose,
  show,
  modalHeader,
  modalAction,
  label,
  placeholderLabel,
  placeholderDescription,
  options,
  onFormChange,
  onTextAreaChange,
  isLoading,
  disabled,
  buttonText,
  placeholder,
  inputName,
  textareaName,
  inputValue,
  textAreaValue,
  Children,
  value,
  textValue,
  inputText
}) => {
  return (
    <div className="font-circular-std">
      <Modal
        show={show}
        onClose={onClose}
        popup={true}
        size="lg"
        position="center"
      >
        <Modal.Header>
          <div className="p-6">
            <h3 className="w-[90%] text-lg font-bold text-black-secondary">
              {modalHeader}
            </h3>
          </div>
          <div className="md:w-[27.75rem] pb-10">
            <hr />
          </div>
        </Modal.Header>

        <Modal.Body>
          <div className="space-y-6">
            <FormInput
              className="w-full md:w-[27.25rem] h-12 text-black-40"
              label={label}
              onChange={onFormChange}
              placeholder={placeholder}
              options={options}
              value={inputValue}
              name={inputName} />

            <Textarea
              classname="mt-4"
              label={placeholderLabel}
              placeholder={placeholderDescription}
              onChange={onTextAreaChange}
              name={textareaName}
              value={textAreaValue}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-between w-full">
            <Button
              onClick={() => modalAction()}
              isLoading={isLoading}
              disabled={disabled}
            >
              {buttonText}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CreateModal;
