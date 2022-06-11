import { createSlice, createAsyncThunk, SerializedError } from "@reduxjs/toolkit"

import client from "@services/http/client"

import type { users as User } from "@codegen"
import type { NavigateFunction } from "react-router"

interface AuthState {
  user: User | null
  status: "idle" | "pending" | "fulfilled" | "rejected" | "refreshing"
  error: SerializedError | null
}

const initialState: AuthState = {
  status: "idle",
  user: null,
  error: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    fetchUserFailure: (state, action) => {
      state.user = null
      state.status = "rejected"
      state.error = action.payload.error
    },
  },
  extraReducers: builder => {
    builder.addCase(submitLoginData.pending, state => {
      state.status = "pending"
    })
    builder.addCase(submitLoginData.fulfilled, (state, action) => {
      state.user = action.payload
      state.status = "fulfilled"
    })
    builder.addCase(submitLoginData.rejected, (state, action) => {
      state.user = null
      state.error = action.error
      state.status = "rejected"
    })
    builder.addCase(fetchUser.pending, state => {
      state.status = "refreshing"
    })
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.user = action.payload
      state.status = "fulfilled"
    })
    builder.addCase(logout.fulfilled, state => {
      state.user = null
      state.status = "rejected"
    })
  },
})

export const submitLoginData = createAsyncThunk<
  User,
  { user_name: string; password: string },
  {
    rejectValue: string
  }
>("auth/submitLoginData", async credentials => {
  const response = await client.post("auth/login", {
    ...credentials,
  })
  client.defaults.headers["Authorization"] = `Bearer ${response.data.access_token}`
  const { user } = response.data
  return user
})

export const fetchUser = createAsyncThunk<
  User,
  void,
  {
    rejectValue: Error
  }
>("auth/fetchUser", async (_, { dispatch, rejectWithValue }) => {
  try {
    const response = await client.get("auth/user")
    return response.data
  } catch (error) {
    dispatch(fetchUserFailure(error as Error))
    return rejectWithValue(error as Error)
  }
})

export const logout = createAsyncThunk("auth/logout", async (navigate: NavigateFunction) => {
  const response = await client.get("auth/logout")
  if (response) {
    navigate("/")
    return response
  }
})

export const { fetchUserFailure } = authSlice.actions
export default authSlice.reducer
