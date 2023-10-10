import React, { useEffect, useState } from "react";
import FormInput from "../../components/FormInput";
import { FcmbLogo } from "../../icons";
import Button from "../../components/Button";
import Notification from "../../components/Notification";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
	setEmail,
	setIsAuthenticated,
	setUsername,
	setUserRole,
	userLogin,
	userSelector,
} from "../../Redux/Slices/authSlice";
import {
	decryptEcb,
	encryptEcb,
	generateRequestId,
} from "../../utils/HelperFunction";
import { closeModal } from "../../Redux/Slices/sessionTimeoutSlice";

const Login = () => {
	const { emailAddress, userRole } = useSelector(userSelector);

	let dispatch = useDispatch();
	const history = useHistory();

	const [userInfo, setUserInfo] = useState({
		emailValue: "",
		passwordValue: "",
	});

	const [generalStates, setGeneralStates] = useState({
		isLoading: false,
		buttonText: "Continue",
		disabled: false,
		notificationText: "",
		status: "",
	});

	const handleUserInfoChange = (e) => {
		const { value } = e.target;
		setUserInfo({
			...userInfo,
			[e.target.name]: value,
		});
	};

	const handleLogin = async () => {
		let encryptedPassword = encryptEcb(
			userInfo.passwordValue,
			process.env.REACT_APP_AES_KEY
		);
		let token = generateRequestId();
		let payload = {
			username: userInfo.emailValue,
			password: encryptedPassword,
			token: token,
		};

		try {
			setGeneralStates((prevState) => ({
				...prevState,
				status: "",
				notificationText: "",
				isLoading: true,
				disabled: true,
				buttonText: "Signing in...",
			}));

			const tokenAuth = localStorage.getItem("cimg");

			if (tokenAuth) {
				setGeneralStates((prevState) => ({
					...prevState,
					status: "failure",
					notificationText:
						"There is an ongoing session in the browser",
					isLoading: true,
					disabled: true,
					buttonText: "Signing in...",
				}));

				setTimeout(() => {
					setGeneralStates((prevState) => ({
						...prevState,
						status: "",
						notificationText: "",
						isLoading: false,
						disabled: false,
						buttonText: "Continue",
					}));
				}, [3000]);
				return;
			}

			if (userInfo.emailValue && userInfo.passwordValue) {
				let responseData = await userLogin(payload);
				let decryptedData = JSON.parse(
					decryptEcb(responseData.data, process.env.REACT_APP_AES_KEY)
				);

				let role = decryptedData.Role;

				if (decryptedData.ResponseField === "00") {
					if (decryptedData.Token !== token) {
						setGeneralStates((prevState) => ({
							...prevState,
							status: "failure",
							notificationText: "unauthorized User",
							isLoading: false,
							disabled: false,
							buttonText: "Continue",
						}));
					} else if (role === "checker") {
						setGeneralStates((prevState) => ({
							...prevState,
							status: "success",
							notificationText: "Login Successful",
							isLoading: false,
							disabled: false,
							buttonText: "Continue",
						}));
						dispatch(setIsAuthenticated(true));
						dispatch(setUserRole(decryptedData.Role));
						localStorage.setItem("cimg", decryptedData.Token);
						console.log(decryptedData);

						history.push("/app/admin/dashboard");
						dispatch(setUsername(decryptedData.StaffNameField));
						dispatch(setEmail(decryptedData.AppEmail));
					} else if (role === "maker") {
						setGeneralStates((prevState) => ({
							...prevState,
							status: "success",
							notificationText: "Login Successful",
							isLoading: false,
							disabled: false,
							buttonText: "Continue",
						}));
						dispatch(setIsAuthenticated(true));
						dispatch(setUserRole(decryptedData.Role));
						localStorage.setItem("cimg", decryptedData.Token);
						console.log(decryptedData);

						history.push("/app/dashboard");
						dispatch(setUsername(decryptedData.StaffNameField));
						dispatch(setEmail(decryptedData.AppEmail));
					} else if (role === "superAdmin") {
						setGeneralStates((prevState) => ({
							...prevState,
							status: "success",
							notificationText: "Login Successful",
							isLoading: false,
							disabled: false,
							buttonText: "Continue",
						}));
						dispatch(setIsAuthenticated(true));
						dispatch(setUserRole(decryptedData.Role));
						localStorage.setItem("cimg", decryptedData.Token);
						console.log(decryptedData);
						history.push("/app/super-admin/user-management");
						dispatch(setUsername(decryptedData.StaffNameField));
						dispatch(setEmail(decryptedData.AppEmail));
					}

					setTimeout(() => {
						setGeneralStates((prevState) => ({
							...prevState,
							status: "",
							notificationText: "",
						}));
					}, 4000);
				} else {
					setGeneralStates((prevState) => ({
						...prevState,
						status: "failure",
						notificationText: decryptedData.ResponseMessageField,
						isLoading: false,
						disabled: false,
						buttonText: "Continue",
					}));
				}
			} else {
				setGeneralStates((prevState) => ({
					...prevState,
					status: "failure",
					notificationText: "fields cannot be empty",
					isLoading: false,
					disabled: false,
					buttonText: "Continue",
				}));
			}
		} catch {
			setGeneralStates((prevState) => ({
				...prevState,
				status: "failure",
				notificationText: "an error occured, please contact support",
				isLoading: false,
				disabled: false,
				buttonText: "Continue",
			}));
		}
	};

	return (
		<div className="grid h-screen place-items-center bg-main-background pb-14 font-circular-std">
			<Notification
				notificationText={generalStates.notificationText}
				status={generalStates.status}
			/>
			<div>
				<div className="mt-7 md:w-[36.5rem] md:mb-10 justify-center flex items-center">
					<FcmbLogo />
					<h3 className="font-medium text-black-primary pl-6">
						Vendor Switch
					</h3>
				</div>

				<div className="bg-other-background shadow-sm rounded-lg md:w-144 md:h-[33rem] mt-3">
					<div className="py-10 px-[4.375rem]">
						<h2 className="text-2xl font-medium leading-[1.875rem] text-black-primary pb-10">
							Sign in
						</h2>
						<FormInput
							autoComplete="off"
							className="mb-10"
							placeholder="Firstname.Lastname@Fcmb.com"
							type="text"
							label="Username"
							onChange={handleUserInfoChange}
							value={userInfo.emailValue}
							name="emailValue"
						/>
						<FormInput
							className="mb-6"
							placeholder="Enter password"
							type="password"
							autoComplete="off"
							label="Password"
							onChange={handleUserInfoChange}
							value={userInfo.passwordValue}
							name="passwordValue"
						/>

						<div className="flex items-center mb-20"></div>
						<Button
							onClick={handleLogin}
							isLoading={generalStates.isLoading}
							disabled={generalStates.disabled}
						>
							{generalStates.buttonText}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
