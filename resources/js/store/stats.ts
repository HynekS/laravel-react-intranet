import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import client from "@services/http/client"

interface Stats {
  [year: string]: {
    [district: string]: {
      1: number
      2: number
      3: number
      4: number
      all: number
    }
  }
}

interface StatsState {
  stats: Stats | null
  status: "idle" | "pending" | "fulfilled" | "rejected"
}

const initialState: StatsState = {
  status: "idle",
  stats: null,
}

const statsSlice = createSlice({
  name: "stats",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchStatsByYears.pending, state => {
      state.status = "pending"
    })
    builder.addCase(fetchStatsByYears.fulfilled, (state, action: PayloadAction<Stats>) => {
      state.stats = action.payload
    })
  },
})

export const fetchStatsByYears = createAsyncThunk("[stats] fetchStatsByYears", async () => {
  const response = await client.get(`/stats/by_year`)
  return response.data
})

export default statsSlice.reducer
