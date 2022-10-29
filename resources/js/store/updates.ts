import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"

import client from "@services/http/client"

import { updates as Update, users as User } from "@codegen"
import { RootState } from "./configuredStore"

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
  latestUpdateId: number | null
  latestUpdates: UpdateListItem[]
}

const initialState: InitialState = {
  latestUpdateId: null, // <--- TODO should fetch this right after user authenticate!
  latestUpdates: [],
}

export const updatesSlice = createSlice({
  name: "updatesSlice",
  initialState,
  reducers: {
    setUpdateId(state, { payload }: PayloadAction<number>) {
      state.latestUpdateId = payload
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchLatestUpdateId.fulfilled, (state, { payload }) => {
      return {
        ...state,
        latestUpdateId: payload,
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
>("updates/fetchLatestUpdateId", async (_, { getState }) => {
  const { updates } = getState() as RootState
  const clientUpdateId = updates.latestUpdateId

  const response = await client("/updates/latest_id")

  if (clientUpdateId === null) {
    return response.data
  }
  if (clientUpdateId === response.data) {
    return response.data
  }

  if (
    window.confirm(
      `V databázi byly provedeny změny. Chcete tyto změny načíst?\nCurrent id: ${clientUpdateId} incoming: ${response.data}`,
    )
  ) {
    location.reload()
  } else {
    return response.data
  }
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

export const { setUpdateId } = updatesSlice.actions
export default updatesSlice.reducer
