import axios from "axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { BlogState, Post } from "../../types";
import { toast } from "react-hot-toast";

axios.defaults.withCredentials = true;

// Fetch posts
export const getPosts = createAsyncThunk("getPosts", async () => {
	const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/blog/getposts`);
	return response.data.posts;
});

// Delete post
export const deletePost = createAsyncThunk("deletepost", async ({ _id, userId }: Post) => {
	const response = await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/blog/deletepost/${_id}/${userId}`, {
		headers: {
			"Content-Type": "application/json",
		},
	});
	return { _id };
});

// Add post
export const addPost = createAsyncThunk("addpost", async (newPost) => {
	const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/blog/create`, newPost, {
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
		// Get posts
		builder.addCase(getPosts.fulfilled, (state, action: PayloadAction<Post[]>) => {
			state.isLoading = false;
			state.data = action.payload;
		});
		builder.addCase(getPosts.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(getPosts.rejected, (state) => {
			state.isError = true;
			console.log("some error occurred");
		});

		// Add post
		builder.addCase(addPost.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(addPost.fulfilled, (state, action: PayloadAction<Post>) => {
			state.isLoading = false;
			toast.success("Post added successfully");
			state.data.push(action.payload);
		});
		builder.addCase(addPost.rejected, (state) => {
			state.isError = true;
			toast.error("Could not add post");
			console.log("some error occurred");
		});

		// Delete post
		builder.addCase(deletePost.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(deletePost.fulfilled, (state, action: PayloadAction<{ _id: string }>) => {
			toast.success("Post deleted successfully");
			state.isLoading = false;
			state.data = state.data.filter((post) => post._id !== action.payload._id);
		});
		builder.addCase(deletePost.rejected, (state) => {
			toast.error("Couldn't delete post");
			state.isError = true;
			console.log("some error occurred");
		});
	},
});

export default blogSlice.reducer;
