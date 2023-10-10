import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "./Slices/authSlice";
import dashboardSlice from "./Slices/dashboardSlice";
import feeSetUpSlice from "./Slices/feeSetUpSlice";
import mappingSlice from "./Slices/mappingSlice";
import reportSlice from "./Slices/reportSlice";
import sessionTimeoutSlice from "./Slices/sessionTimeoutSlice";
import telcoSlice from "./Slices/telcoSlice";
import userMgtSlice from "./Slices/userMgtSlice";
import vendorSlice from "./Slices/vendorSlice";
import loaderSlice from "./Slices/loaderSlice";

/* const rootReducer = {
    auth: authSlice,
    timeoutModal: sessionTimeoutSlice
} */

export const rootReducer = combineReducers({
	auth: authSlice,
	timeoutModal: sessionTimeoutSlice,
	userMgt: userMgtSlice,
	dashboard: dashboardSlice,
	vendorModule: vendorSlice,
	telcoModule: telcoSlice,
	reports: reportSlice,
	mapping: mappingSlice,
	feeSetup: feeSetUpSlice,
	loader: loaderSlice
});

/*   const store = configureStore({
    reducer: rootReducer
  }) */

//export default rootReducer;
