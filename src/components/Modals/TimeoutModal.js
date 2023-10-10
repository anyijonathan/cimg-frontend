import React, { useState } from "react";
import { Modal } from "flowbite-react";
import { NoticeIcon } from "../../icons";
import { useSelector, useDispatch } from "react-redux";
import { closeModal, openModal } from "../../Redux/Slices/sessionTimeoutSlice";
import { logout } from "../../Redux/Slices/authSlice";

const TimeoutModal = () => {
	const dispatch = useDispatch();

	let openModalState = useSelector((state) => {
		return state["timeoutModal"];
	});

	let { openTimeoutModal } = openModalState;

	//const [isModalOpen, setIsModalOpen] = useState(openTimeoutModal)

	function modalClose() {
		dispatch(closeModal());
		dispatch(logout());
		localStorage.removeItem("cimg");
	}

	return (
		<div>
			<Modal
				show={openTimeoutModal}
				size="lg"
				popup={true}
				onClose={modalClose}
			>
				<Modal.Header />
				<Modal.Body>
					<div className="text-center">
						<div className="w-full flex justify-center mb-2">
							<NoticeIcon />
						</div>
						<h3 className="mb-8 text-lg font-semibold text-secondary-black">
							Your session timed out.
						</h3>
					</div>
				</Modal.Body>
			</Modal>
		</div>
	);
};

export default TimeoutModal;
