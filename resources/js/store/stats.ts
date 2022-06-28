import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import client from "@services/http/client"

export interface StatsByYearsAndDistricts {
  [year: string]: {
    [district: string]: {
      1: number
      2: number
      3: number
      4: number
      all: number
      negative: number
      positive: number
    }
  }
}

export interface currentStateSummary {
  1: number
  2: number
  3: number
  4: number
}

export interface statsByYears {
  [year: string]: {
    1: number
    2: number
    3: number
    4: number
    all: number
    negative: number
    positive: number
  }
}

interface StatsState {
  currentStateSummary: currentStateSummary | null
  statsByYears: statsByYears | null
  statsByYearsAndDistricts: StatsByYearsAndDistricts | null
}

const initialState: StatsState = {
  currentStateSummary: null,
  statsByYears: null,
  statsByYearsAndDistricts: null,
}

const statsSlice = createSlice({
  name: "stats",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(
      fetchStatsByYearsAndDistricts.fulfilled,
      (state, action: PayloadAction<StatsByYearsAndDistricts>) => {
        state.statsByYearsAndDistricts = action.payload
      },
    ),
      builder.addCase(fetchStatsByYears.fulfilled, (state, action: PayloadAction<statsByYears>) => {
        state.statsByYears = action.payload
      }),
      builder.addCase(
        fetchCurrentStateSummary.fulfilled,
        (state, action: PayloadAction<currentStateSummary>) => {
          state.currentStateSummary = action.payload
        },
      )
  },
})

export const fetchStatsByYearsAndDistricts = createAsyncThunk(
  "stats/fetchStatsByYearsAnddistricts",
  async () => {
    const response = await client.get(`/stats/by_years_and_districts`)
    return response.data
  },
)

export const fetchStatsByYears = createAsyncThunk("stats/fetchStatsByYears", async () => {
  const response = await client.get(`/stats/by_years`)
  return response.data
})

export const fetchCurrentStateSummary = createAsyncThunk(
  "stats/fetchCurrentStateSummary",
  async () => {
    const response = await client.get(`/stats/current_state_summary`)
    return response.data
  },
)

export default statsSlice.reducer
