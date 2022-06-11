import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import client from "@services/http/client"

import type { akce as Akce } from "@codegen"

interface SearchState {
  results: Akce[] | null
  status: "idle" | "pending" | "fulfilled" | "rejected"
}

const initialState: SearchState = {
  status: "idle",
  results: null,
}

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    resetSearchResult: state => {
      state.status = "idle"
      state.results = null
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchSearchResults.pending, state => {
      state.status = "pending"
    })
    builder.addCase(fetchSearchResults.fulfilled, (state, action: PayloadAction<Akce[]>) => {
      state.status = "fulfilled"
      state.results = action.payload
    })
  },
})

export const fetchSearchResults = createAsyncThunk(
  "search/fetchSearchResults",
  async (searchTerm: string) => {
    const response = await client.post(`/akce/search`, {
      search_term: searchTerm,
    })
    return response.data
  },
)

export const { resetSearchResult } = searchSlice.actions
export default searchSlice.reducer
