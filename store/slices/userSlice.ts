import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { UserData } from "@/models/user.model";
import { RootState } from "store/store";
import * as serverService from "@/services/serverService";
import Router from "next/router";
import httpClient from "@/utils/httpClient";
import { AxiosRequestConfig } from "axios";
import { KEY_ROUTE } from "@/constants/routes";
import { URL_PATH } from "@/constants/url";

interface UserState {
  username: string;
  accessToken: string;
  error?: string;
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  user?: UserData;
}

interface SingleProp {
  data: string;
}

const initialState: UserState = {
  username: "",
  accessToken: "",
  isAuthenticated: false,
  isAuthenticating: true,
  user: undefined,
};

interface SignAction {
  username: string;
  password: string;
}

export const signUp = createAsyncThunk(
  URL_PATH.USER.SIGNUP,
  async (credential: SignAction) => {
    const response = await serverService.signUp(credential);
    return response;
  }
);

export const signIn = createAsyncThunk(
  URL_PATH.USER.SIGNIN,
  async (credential: SignAction) => {
    const response = await serverService.signIn(credential);
    if (response.result !== "ok") {
      throw new Error("login failed");
    }

    // set access token
    httpClient.interceptors.request.use((config?: AxiosRequestConfig | any) => {
      if (config && config.headers) {
        config.headers["Authorization"] = `Bearer ${response.token}`;
      }

      return config;
    });
    return response;
  }
);

export const signOut = createAsyncThunk(URL_PATH.USER.SIGNOUT, async () => {
  await serverService.signOut();
  Router.push(KEY_ROUTE.LOGIN);
});

export const getSession = createAsyncThunk(
  URL_PATH.USER.FETCH_SESSION,
  async () => {
    const response = await serverService.getSession();

    // set access token
    if (response) {
      httpClient.interceptors.request.use(
        (config?: AxiosRequestConfig | any) => {
          if (config && config.headers && response.user) {
            config.headers["Authorization"] = `Bearer ${response.user?.token}`;
          }
          return config;
        }
      );
    }
    return response;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    resetUsername: (state, action: PayloadAction<SingleProp>) => {
      state.username = action.payload.data;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signUp.fulfilled, (state, action) => {
      state.accessToken = "";
      state.user = undefined;
      state.isAuthenticated = false;
    });
    builder.addCase(signIn.fulfilled, (state, action) => {
      state.accessToken = action.payload.token;
      state.isAuthenticated = true;
      state.isAuthenticating = false;
      state.user = action.payload.user;
    });
    builder.addCase(signIn.rejected, (state, action) => {
      state.accessToken = "";
      state.isAuthenticated = false;
      state.isAuthenticating = false;
      state.user = undefined;
    });
    builder.addCase(signOut.fulfilled, (state, action) => {
      state.accessToken = "";
      state.isAuthenticated = false;
      state.isAuthenticating = false;
      state.user = undefined;
    });
    builder.addCase(getSession.fulfilled, (state, action) => {
      state.isAuthenticating = false;
      if (action.payload && action.payload.user && action.payload.user.token) {
        state.accessToken = action.payload.user.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      }
    });
  },
});

export const { resetUsername } = userSlice.actions;

// export common user selector
export const userSelector = (store: RootState) => store.user;
export const isAuthenticatedSelector = (store: RootState): boolean =>
  store.user.isAuthenticated;
export const isAuthenticatingSelector = (store: RootState): boolean =>
  store.user.isAuthenticating;

// export reducer
export default userSlice.reducer;
