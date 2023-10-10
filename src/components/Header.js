import React, { useContext } from "react";
import moment from "moment/moment";
import { SidebarContext } from "../context/SidebarContext";
import { MenuIcon, SignoutIcon, UserIcon } from "../icons";
import { useDispatch, useSelector } from "react-redux";
import { logout, userSelector } from "../Redux/Slices/authSlice";
import { closeModal } from "../Redux/Slices/sessionTimeoutSlice";

const Header = () => {
	let dispatch = useDispatch();
	const { userName } = useSelector(userSelector);

	let date = moment().format("dddd, Do MMMM YYYY");

	const { toggleSidebar } = useContext(SidebarContext);

	const handleSignout = () => {
		dispatch(logout());
		dispatch(closeModal());
		localStorage.removeItem("cimg");
	};

	return (
		<header className="z-40 py-4 bg-other-background shadow-bottom font-circular-std">
			<div className="container flex items-center justify-between h-full px-6 mx-auto text-gray-600 ">
				{/* <!-- Mobile hamburger --> */}
				<button
					className="p-1 mr-5 -ml-1 rounded-md lg:hidden focus:outline-none"
					onClick={toggleSidebar}
					aria-label="Menu"
				>
					<MenuIcon
						className="fill-primary-color w-6 h-6"
						aria-hidden="true"
					/>
				</button>

				<div className="hidden md:flex justify-start flex-1 lg:mr-32 text-sm font-[450] text-black-primary">
					{date}
				</div>
				<ul className="flex items-center flex-shrink-0 space-x-6">
					<li className="flex">
						<div className="justify-center flex items-center">
							<UserIcon />
							<p className="font-medium text-sm text-black-primary pl-4">
								{userName}
							</p>
						</div>
					</li>

					<li className="relative md:pl-[4.5625rem]">
						<div className="justify-center flex items-center">
							<SignoutIcon />
							<button
								onClick={handleSignout}
								className="font-medium text-sm text-red-primary pl-4"
							>
								Sign Out
							</button>
						</div>
					</li>
				</ul>
			</div>
		</header>
	);
};

export default Header;
