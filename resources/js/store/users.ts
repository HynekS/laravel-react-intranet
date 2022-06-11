import { createSlice, createAsyncThunk, SerializedError } from "@reduxjs/toolkit"
import client from "@services/http/client"

import type { users as User } from "@codegen"

interface UsersState {
  activeUsers: User[]
  error: SerializedError | null
}

const initialState: UsersState = {
  activeUsers: [],
  error: null,
}

const activeUsersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchActiveUsers.fulfilled, (state, action) => {
      state.activeUsers = action.payload
    })
  },
})

export const fetchActiveUsers = createAsyncThunk<
  User[],
  void,
  {
    rejectValue: string
  }
>("users/fetchActiveUsers", async () => {
  const response = await client.get("users/get_active")
  return response.data
})

export default activeUsersSlice.reducer
