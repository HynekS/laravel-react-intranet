import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

import client from "@services/http/client"

import { updates as Update, users as User } from "@codegen"

type UpdateListItem = {
  akce: {
    id_akce: number
    cislo_per_year: number
    rok_per_year: number
    nazev_akce: string
  } | null
  akce_id: number
  id: number
  updates: Array<Update & { user: Pick<User, "id" | "full_name" | "avatar_path"> }>
}
interface InitialState {
  latestId: number | null
  latestUpdates: UpdateListItem[]
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
  UpdateListItem[],
  void,
  {
    rejectValue: string
  }
>("updates/fetchLastMonthUpdates", async () => {
  const response = await client("/updates/last_month")
  return response.data
})

export default updatesSlice.reducer
