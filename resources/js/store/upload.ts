import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"

import client from "@services/http/client"
import getFileExtension from "../utils/getFileExtension"
import type { Model } from "./files"

export interface FileObject {
  content: FileReader["result"]
  name: string
  size: number
  type: string
  extension: string
}

export interface FileRecord {
  id: number
  file_path: string
  id_akce: number
  vlozil: string
  vlozeno: Date // is it?
}

export interface UploadResponse {
  model: Model
  file: FileRecord
}

interface InitialState {
  status: "idle" | "reading" | "reading_done" | "uploading"
  response: UploadResponse[] | null
  filesToUpload: FileObject[]
  uploadProgress: number[]
}

const initialState: InitialState = {
  status: "idle",
  response: null,
  filesToUpload: [],
  uploadProgress: [],
}

export const uploadsSlice = createSlice({
  name: "uploads",
  initialState,
  reducers: {
    setUploadProgress: (
      state,
      { payload }: PayloadAction<{ updatedProgress: number; i: number; length: number }>,
    ) => {
      return {
        ...state,
        uploadProgress: state.uploadProgress.map((val, i) =>
          i === payload.i ? payload.updatedProgress : val,
        ),
      }
    },
    removeFileFromUploads: (state, action: PayloadAction<number>) => {
      return {
        ...state,
        filesToUpload: state.filesToUpload.filter((_, i) => i !== action.payload),
      }
    },
    setInitialState: () => {
      return initialState
    },
  },
  extraReducers: builder => {
    builder.addCase(batchReadFiles.pending, state => {
      return {
        ...state,
        status: "reading",
      }
    })
    builder.addCase(batchReadFiles.fulfilled, (state, { payload }) => {
      const currentFileNames = state.filesToUpload.map(file => file.name)
      return {
        ...state,
        filesToUpload: [
          ...payload.filter((file: FileObject) => !currentFileNames.includes(file.name)),
          ...state.filesToUpload,
        ],
        status: "reading_done",
      }
    }),
      builder.addCase(uploadMultipleFiles.pending, (state, { meta }) => {
        return {
          ...state,
          status: "uploading",
          uploadProgress: new Array(meta.arg.filesToUpload.length).fill(0),
        }
      })
    builder.addCase(uploadMultipleFiles.fulfilled, (state, { payload }) => {
      return {
        ...state,
        response: payload.responses,
        status: "idle",
        filesToUpload: [],
        uploadProgress: [],
      }
    })
  },
})

// Utility function
export const readFile = (file: File): Promise<FileObject> => {
  try {
    return new Promise(resolve => {
      let reader = new FileReader()
      reader.onload = () =>
        resolve({
          content: reader.result,
          name: file.name,
          size: file.size,
          type: file.type,
          extension: getFileExtension(file.name).toLowerCase(),
        })

      reader.readAsDataURL(file)
    })
  } catch (error) {
    console.log(error)
    return Promise.reject(error)
  }
}

export const batchReadFiles = createAsyncThunk<
  FileObject[],
  File[],
  {
    rejectValue: string
  }
>("upload/batchReadFiles", async (files: File[]) => {
  const filesToUpload = await Promise.all(files.map(async file => readFile(file)))
  return filesToUpload
})

export const uploadMultipleFiles = createAsyncThunk<
  { model: Model; projectId: number; responses: UploadResponse[] },
  { filesToUpload: FileObject[]; model: Model; projectId: number; userId: number },
  {
    rejectValue: string
  }
>(
  "upload/uploadMultipleFiles",
  async ({ filesToUpload, model, projectId, userId }, { dispatch }) => {
    const responses = await Promise.all(
      filesToUpload.map(async (file, i, self) =>
        dispatch(
          uploadSingleFile({ file, model, projectId, userId, i, length: self.length }),
        ).unwrap(),
      ),
    )
    return { model, projectId, responses }
  },
)

export const uploadSingleFile = createAsyncThunk<
  UploadResponse,
  { file: FileObject; model: Model; projectId: number; userId: number; i: number; length: number },
  {
    rejectValue: string
  }
>(
  "upload/uploadSingleFile",
  async ({ file, model, projectId, userId, i, length }, { dispatch }) => {
    const formData = new FormData()
    const data = {
      file,
      model,
      projectId,
      userId,
    }
    formData.append("data", JSON.stringify(data))

    const response = await client.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: e => {
        let progress = (e.loaded / e.total) * 100
        dispatch(setUploadProgress({ updatedProgress: Math.round(progress), i, length }))
      },
    })
    return response.data
  },
)

export const { setUploadProgress, removeFileFromUploads, setInitialState } = uploadsSlice.actions
export default uploadsSlice.reducer
