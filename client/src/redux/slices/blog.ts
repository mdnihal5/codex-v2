import axios from "axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { BlogState, Post } from "../../types";

axios.defaults.withCredentials = true;

export const getPosts = createAsyncThunk("getPosts", async () => {
	const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/blog/getposts`);
	return response.data.posts;
});

export const deletePost = createAsyncThunk("deletepost", async ({ _id, userId }: Post) => {
	const response = await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/blog/deletepost/${_id}/${userId}`, {
		withCredentials: true,
		headers: {
			"Content-Type": "application/json",
		},
	});
	return response.data;
});

export const addPost = createAsyncThunk("addpost", async (newPost) => {
	const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/blog/create`, newPost, {
		withCredentials: true,
		headers: {
			"Content-Type": "application/json",
		},
	});
	return response.data;
});

const initialState: BlogState = {
	isLoading: false,
	data: [],
	isError: false,
};

const blogSlice = createSlice({
	name: "Blog",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		// Get Post
		builder.addCase(getPosts.fulfilled, (state, action: PayloadAction<Post[]>) => {
			state.isLoading = false;
			state.data = action.payload;
		});
		builder.addCase(getPosts.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(getPosts.rejected, (state) => {
			state.isError = true;
			console.log("some error occured ");
		});

		//Add Post
		builder.addCase(addPost.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(addPost.fulfilled, (state, action: PayloadAction<Post>) => {
			state.isLoading = false;

			state.data.push(action.payload);
		});
		builder.addCase(addPost.rejected, (state) => {
			state.isError = true;
			console.log("some error occured ");
		});

		// Delete Post
		builder.addCase(deletePost.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(deletePost.fulfilled, (state, action: PayloadAction<Post>) => {
			state.isLoading = false;
			state.data = state.data.filter((post) => post._id !== action.payload._id);
		});
		builder.addCase(deletePost.rejected, (state) => {
			state.isError = true;
			console.log("some error occured ");
		});
	},
});

export default blogSlice.reducer;
