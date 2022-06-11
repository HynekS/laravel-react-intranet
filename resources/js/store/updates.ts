import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

import client from "@services/http/client"

import { updates as Update } from "@codegen"

interface InitialState {
  latestId: number | null
  latestUpdates: Update[]
}

const initialState: InitialState = {
  latestId: null,
  latestUpdates: [],
}

export const updatesSlice = createSlice({
  name: "updatesSlice",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchLatestUpdateId.fulfilled, (state, { payload }) => {
      return {
        ...state,
        latestId: payload,
      }
    })
    builder.addCase(fetchLastMonthUpdates.fulfilled, (state, { payload }) => {
      return {
        ...state,
        latestUpdates: payload,
      }
    })
  },
})

export const fetchLatestUpdateId = createAsyncThunk<
  number,
  void,
  {
    rejectValue: string
  }
>("updates/fetchLatestUpdateId", async () => {
  const response = await client("/updates/latest_id")
  return response.data
})

export const fetchLastMonthUpdates = createAsyncThunk<
  Update[],
  void,
  {
    rejectValue: string
  }
>("updates/fetchLastMonthUpdates", async () => {
  const response = await client("/updates/get_last_month")
  return response.data
})

export default updatesSlice.reducer
