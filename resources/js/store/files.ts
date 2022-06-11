import { createSlice, createAsyncThunk, PayloadAction, isAnyOf } from "@reduxjs/toolkit"

import client from "@services/http/client"
import { uploadMultipleFiles, UploadResponse } from "./upload"

import type { FileRecord } from "./upload"

// TODO extract to a separate file (can be used in uploads file)
export type Model =
  | "teren_databaze"
  | "LAB_databaze"
  | "teren_foto"
  | "teren_scan"
  | "digitalizace_nalez"
  | "digitalizace_plany"
  | "geodet_body"
  | "geodet_plany"

export type FileType = {
  model: Model
  projectId: number
  fileId: number
  userId?: number
}

export const filesSlice = createSlice({
  name: "files",
  initialState: [] as FileRecord[],
  reducers: {},
  extraReducers: builder => {
    builder.addCase(deleteFile.fulfilled, (state, { payload }) => {
      return state.filter(file => file.id && file.id !== payload.fileId)
    })
    builder.addMatcher(
      isAnyOf(uploadMultipleFiles.fulfilled),
      (
        state,
        {
          payload,
        }: PayloadAction<{ model: string; projectId: number; responses: UploadResponse[] }>,
      ) => {
        console.log({ state, payload })

        return ["teren_databaze", "LAB_databaze"].includes(payload.model)
          ? payload.responses.map(response => response.file)
          : [...state, ...payload.responses.map(response => response.file)]
      },
    )
  },
})

export const deleteFile = createAsyncThunk<
  { model: Model; projectId: number; fileId: number },
  { model: Model; projectId: number; fileId: number; userId: number },
  {
    rejectValue: string
  }
>("files/deleteFile", async ({ model, projectId, fileId, userId }) => {
  await client.delete(`file`, {
    data: {
      model,
      fileId,
      userId,
      projectId,
    },
  })
  return { model, projectId, fileId }
})

export default filesSlice.reducer
