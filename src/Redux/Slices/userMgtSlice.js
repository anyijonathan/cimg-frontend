import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { generateHeader, makeRequest } from "./apiConfig";

const initialState = {
  userId: 0,
};

export const getAllUsers = async (email,role) => {
  const apiHeader = generateHeader();
  const header = {
    ...apiHeader,
    "UserEmail": email,
    "Role": role
  };

  try {
    const response = await makeRequest.get(`/api/Account/GetAllUsers`, {
      headers: header,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const CreateUser = async (data,email,role) => {
  const apiHeader = generateHeader();
  const header = {
    ...apiHeader,
    "UserEmail": email,
    "Role": role
  };
  try {
    const response = await makeRequest.post(`/api/Account/CreateUser`, data, {
      headers: header,
    });

    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const RemoveUser = async (id,email,role) => {
  const apiHeader = generateHeader();
  const header = {
    ...apiHeader,
    "UserEmail": email,
    "Role": role
  };

  try {
    const response = await makeRequest.get(`/api/Account/RemoveUser?Id=${id}`, {
      headers: header,
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const enableVendor = async (id,email,role) => {
  const apiHeader = generateHeader();
  const header = {
    ...apiHeader,
    "UserEmail": email,
    "Role": role
  };

  try {
    const response = await makeRequest.post(
      `/api/AirtimeBiller/EnableVendor`,
      { id: id },
      {
        headers: header,
      }
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const disableVendor = async (id,email,role) => {
  const apiHeader = generateHeader();
  const header = {
    ...apiHeader,
    "UserEmail": email,
    "Role": role
  };
  try {
    const response = await makeRequest.post(
      `api/AirtimeBiller/DisableVendor`,
      { id: id },
      {
        headers: header,
      }
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

let userMgtSlice = createSlice({
  name: "userMgt",
  initialState: initialState,
  reducers: {
    setId: function (state, action) {
      state.userId = action.payload;
    },
  },
});

export const { setId } = userMgtSlice.actions;
export const userMgtSelector = (state) => state.userMgt;
export default userMgtSlice.reducer;
