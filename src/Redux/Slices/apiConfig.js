import axios from "axios";
import CryptoJS from "crypto-js";

export const makeRequest = axios.create({
   baseURL: process.env.REACT_APP_BASE_URL,
});

/* export const makeAdRequest = axios.create({
  baseURL: process.env.REACT_APP_AD_BASE_URL,
}); */

export const makeSwaggerRequest = axios.create({
	baseURL: process.env.REACT_APP_SWAGGER_BASE_URL,
  });

export const generateHeader = () => {
	let dateToUse = new Date();
	let UTCTimestamp = dateToUse.toISOString().replace("Z", "");
	let dateInToken = UTCTimestamp.replace("T", "")
	  .replace(":", "")
	  .replace(":", "")
	  .substring(0, UTCTimestamp.length - 7);
	let shaOneEncrypt = CryptoJS.SHA512(dateInToken + process.env.REACT_APP_CLIENT_ID + process.env.REACT_APP_CLIENT_PASSWORD);
	const apiHeader = {
	  "x-token": shaOneEncrypt.toString(CryptoJS.enc.Hex),
	  "Ocp-Apim-Subscription-Key": process.env.REACT_APP_API_SUBSCRIPTION_KEY,
	  "Ocp-Apim-Trace": true,
	  UTCTimestamp: UTCTimestamp,
    client_id: process.env.REACT_APP_CLIENT_ID
	};
	return apiHeader;
  };
