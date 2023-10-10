import React, { lazy } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
} from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";

const Layout = lazy(() => import("./containers/Layout"));
const Login = lazy(() => import("./pages/authPages/Login"));
const Signup = lazy(() => import("./pages/authPages/Signup"));
const ResetPassword = lazy(() => import("./pages/authPages/ResetPassword"));
const PasswordReset = lazy(() => import("./pages/authPages/PasswordReset"));
const ErrorPage = lazy(() => import("./pages/ErrorPage"));

function ErrorFallback({ error }) {
	return <ErrorPage />;
}

function App() {
	return (
		<div>
			<ErrorBoundary ErrorFallback={ErrorFallback}>
				<Router>
					<Switch>
						<Route path="/login" component={Login} />
						<Route path="/signup" component={Signup} />
						<Route
							path="/reset-password"
							component={ResetPassword}
						/>
						<Route
							path="/password-reset"
							component={PasswordReset}
						/>
						<Route path="/error-page" component={ErrorPage} />
						<ProtectedRoute path="/app" component={Layout} />
						<Redirect exact from="*" to="/login" />
						<Redirect exact from="/" to="/login" />
					</Switch>
				</Router>
			</ErrorBoundary>
		</div>
	);
}

export default App;
