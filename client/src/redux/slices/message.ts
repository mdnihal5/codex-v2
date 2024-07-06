import axios from "axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { MessageState, Message } from "../../types";

axios.defaults.withCredentials = true;

export const getMessages = createAsyncThunk("getMessages", async () => {
  const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/chats/messages`);
  return response.data.messages;
});

export const addMessage = createAsyncThunk("addMessage", async (newMessage) => {
  const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/chats/create`, newMessage, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
});

const initialState: MessageState = {
  isLoading: false,
  data: [],
  isError: false,
};

const messageSlice = createSlice({
  name: "Message",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getMessages.fulfilled, (state, action: PayloadAction<Message[]>) => {
      state.isLoading = false;
      state.data = action.payload;
    });
    builder.addCase(getMessages.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getMessages.rejected, (state) => {
      state.isError = true;
      console.log("some error occured ");
    });

    // Add Message
    builder.addCase(addMessage.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(addMessage.fulfilled, (state, action: PayloadAction<Message>) => {
      state.isLoading = false;
      state.data.push(action.payload);
    });
    builder.addCase(addMessage.rejected, (state) => {
      state.isError = true;
      console.log("some error occured ");
    });
  },
});

export default messageSlice.reducer;
