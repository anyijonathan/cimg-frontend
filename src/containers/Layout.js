import React, { useContext, Suspense, useEffect, lazy } from "react";
import { Switch, Route, Redirect, useLocation } from "react-router-dom";
import { routes, adminRoutes, superAdminRoutes } from "../routes";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Main from "../containers/Main";
import ThemedSuspense from "../components/ThemedSuspense";
import { SidebarContext } from "../context/SidebarContext";
import { useIdleTimer } from "react-idle-timer";
import { userSelector } from "../Redux/Slices/authSlice";
import { openModal } from "../Redux/Slices/sessionTimeoutSlice";
import TimeoutModal from "../components/Modals/TimeoutModal";

const Page404 = lazy(() => import("../pages/404"));

function Layout() {
	// Get data from redux store
	let userRoleState = useSelector((state) => {
		return state["auth"];
	});

	let { userRole } = userRoleState;

	let role = userRole;

	const { isSidebarOpen, closeSidebar } = useContext(SidebarContext);
	let location = useLocation();

	useEffect(() => {
		closeSidebar();
	}, [location]);

	const { isAuthenticated } = useSelector(userSelector);
	const dispatch = useDispatch();

	const onIdle = () => {
		dispatch(openModal());
	};

	useIdleTimer({
		timeout: 60_000 * 5,
		onIdle,
		debounce: 500,
	});

	const clearLocalStorage = () => {
		localStorage.removeItem("cimg");
	};

	useEffect(() => {
		window.addEventListener("beforeunload", clearLocalStorage);

		return () => {
			window.removeEventListener("beforeunload", clearLocalStorage);
		};
	}, []);

	return (
		<div
			className={`flex h-screen bg-gray-50  ${
				isSidebarOpen && "overflow-hidden"
			}`}
		>
			<TimeoutModal />
			<Sidebar />
			<div className="flex flex-col flex-1 w-full">
				<Header />
				<Main>
					<Suspense fallback={<ThemedSuspense />}>
						{role === "maker" && (
							<Switch>
								{routes.map((route, i) => {
									return route.component ? (
										<Route
											key={i}
											exact={true}
											path={`/app${route.path}`}
											render={(props) => (
												<route.component {...props} />
											)}
										/>
									) : null;
								})}
								<Redirect
									exact
									from="/app"
									to="/app/dashboard"
								/>
								<Route component={Page404} />
							</Switch>
						)}

						{role === "checker" && (
							<Switch>
								{adminRoutes.map((route, i) => {
									return route.component ? (
										<Route
											key={i}
											exact={true}
											path={`/app${route.path}`}
											render={(props) => (
												<route.component {...props} />
											)}
										/>
									) : null;
								})}
								<Redirect
									exact
									from="/app/admin"
									to="/app/admin/dashboard"
								/>
								<Route component={Page404} />
							</Switch>
						)}

						{role === "superAdmin" && (
							<Switch>
								{superAdminRoutes.map((route, i) => {
									return route.component ? (
										<Route
											key={i}
											exact={true}
											path={`/app${route.path}`}
											render={(props) => (
												<route.component {...props} />
											)}
										/>
									) : null;
								})}
								<Redirect
									exact
									from="/app/super-admin"
									to="/app/super-admin/user-management"
								/>
								<Route component={Page404} />
							</Switch>
						)}
					</Suspense>
				</Main>
			</div>
		</div>
	);
}

export default Layout;
