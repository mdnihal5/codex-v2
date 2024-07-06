import axios from "axios";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { User, AuthState } from "../../types";
axios.defaults.withCredentials = true;

export const signIn = createAsyncThunk("signIn", async (user: User) => {
	const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/auth/signin`, user);
	return response.data;
});

export const signUp = createAsyncThunk("signUp", async (user: User) => {
	const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/auth/signup`, user);
	return response.data;
});

export const signOut = createAsyncThunk("signOut", async () => {
	const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/auth/signout`);
	return response.data;
});

const initialState: AuthState = {
	isLoading: false,
	data: null,
	isError: false,
};

const authSlice = createSlice({
	name: "Auth",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		// SignIn
		builder.addCase(signIn.fulfilled, (state, action: PayloadAction<User>) => {
			state.isLoading = false;
			state.data = action.payload;
		});
		builder.addCase(signIn.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(signIn.rejected, (state) => {
			state.isError = true;
			console.log("some error occured ");
		});

		// SignUp
		builder.addCase(signUp.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(signUp.fulfilled, (state, action: PayloadAction<User>) => {
			state.isLoading = false;
			state.data = action.payload;
		});
		builder.addCase(signUp.rejected, (state) => {
			state.isError = true;
			console.log("some error occured ");
		});

		// SignOut
		builder.addCase(signOut.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(signOut.fulfilled, (state) => {
			state.isLoading = false;
			state.data = null;
		});
		builder.addCase(signOut.rejected, (state) => {
			state.isError = true;
			console.log("some error occured ");
		});
	},
});

export default authSlice.reducer;
