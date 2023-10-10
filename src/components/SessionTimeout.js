import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import IdleTimer from "react-idle-timer";
import { logout, userSelector } from "../Redux/Slices/authSlice";
import { openModal } from "../Redux/Slices/sessionTimeoutSlice";

function SessionTimeout() {
	const dispatch = useDispatch();
	const { isAuthenticated } = useSelector(userSelector);

	const sessionTimeoutRef = useRef(null);

	const logOut = () => {
		dispatch(logout());
	};

	const onIdle = () => {
		//logOut();
		if (isAuthenticated === true) {
			dispatch(openModal());
		}
	};

	return (
		<div>
			<IdleTimer
				ref={sessionTimeoutRef}
				timeout={1 * 60 * 1000}
				onIdle={onIdle}
			>
				{" "}
			</IdleTimer>
		</div>
	);
}

export default SessionTimeout;
