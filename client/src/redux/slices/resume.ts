import axios, { AxiosResponse } from "axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Resume, ResumeState } from "../../types";
axios.defaults.withCredentials = true;
// List all Resumes
export const getResumes = createAsyncThunk("getresumes", async () => {
	const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/resume/getposts`);
	return response.data.resumes;
});
// Delete Resume
export const deleteResume = createAsyncThunk("deleteresume", async ({ _id, userId }: Resume) => {
	const response = await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/resume/deletepost/${_id}/${userId}`, {
		headers: {
			"Content-Type": "application/json",
		},
	});
	return response.data;
});
// Add Resume
export const addResume = createAsyncThunk("addresume", async (newPost: Resume) => {
	const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/resume/create`, newPost, {
		headers: {
			"Content-Type": "application/json",
		},
	});

	return response;
});
const initialState: ResumeState = {
	isLoading: false,
	data: [],
	isError: false,
};
const resumeSlice = createSlice({
	name: "Resume",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		// Get Resume
		builder.addCase(getResumes.fulfilled, (state, action: PayloadAction<AxiosResponse<Resume[], any>>) => {
			state.isLoading = false;
			state.data = action.payload.data;
		});

		builder.addCase(getResumes.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(getResumes.rejected, (state) => {
			state.isError = true;
			console.log("some error occured ");
		});

		//Add Resume
		builder.addCase(addResume.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(addResume.fulfilled, (state, action: PayloadAction<AxiosResponse<Resume, any>>) => {
			state.isLoading = false;
			state.data.push(action.payload.data);
		});
		builder.addCase(addResume.rejected, (state) => {
			state.isError = true;
			console.log("some error occured while adding resume ");
		});

		// Delete Resume
		builder.addCase(deleteResume.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(deleteResume.fulfilled, (state, action: PayloadAction<AxiosResponse<Resume, any>>) => {
			state.isLoading = false;
			state.data = state.data.filter((post) => post._id !== action.payload.data._id);
		});
		builder.addCase(deleteResume.rejected, (state) => {
			state.isError = true;
			console.log("some error occured ");
		});
	},
});

export default resumeSlice.reducer;
