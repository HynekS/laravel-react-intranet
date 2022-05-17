import type { AnyAction } from "redux"
import type { AppDispatch } from "../store/configuredStore"

import client from "../utils/axiosWithDefaults"
import getFileExtension from "../utils/getFileExtension"

// constants
const BATCH_READ_FILES_INITIALIZED = "[upload] Reading multiple files has started"
const BATCH_READ_FILES_DONE = "[upload] Reading multiple files has ended"
const BATCH_READ_FILES_FAILURE = "[upload] Reading multiple files has failed"

const UPLOAD_SINGLE_FILE_INITIALIZED = "[upload] Uploadind single file has started"
const UPLOAD_SINGLE_FILE_SUCCESS = "[upload] A file was successfully uploaded"
const UPLOAD_SINGLE_FILE_FAILURE = "[upload] An error occurred while trying to upload a file"

const BATCH_UPLOAD_FILES_INITIALIZED = "[upload] Uploading multiple files has started"
const BATCH_UPLOAD_FILES_DONE = "[upload] Uploading of multiple files has ended"
const BATCH_UPLOAD_FILES_FAILURE =
  "[upload] An error occurred while trying to upload multiple files"

const REMOVE_FILE_FROM_UPLOADS = "[upload] A file is being removed from the uploads list"
const SET_UPLOAD_PROGRESS = "[upload] uploadProgressUpdated"
const SET_INITIAL_STATE = "[upload] A state is being cleared"

export { BATCH_UPLOAD_FILES_DONE }

export type FileObject = {
  content: FileReader["result"]
  name: string
  size: number
  type: string
  extension: string
}

export const filesStatus = {
  IDLE: "idle",
  READING: "reading",
  READING_DONE: "reading_done",
  UPLOADING: "uploading",
  UPLOADING_DONE: "uploading_done",
} as const

type InitialState = {
  status: typeof filesStatus[keyof typeof filesStatus]
  response: unknown // TODO: Type!
  filesToUpload: FileObject[]
  uploadProgress: number[]
}

const initialState: InitialState = {
  status: filesStatus.IDLE,
  response: null,
  filesToUpload: [],
  uploadProgress: [],
}

// Reducer for files state
export default function reducer(state = initialState, action: AnyAction) {
  switch (action.type) {
    case BATCH_READ_FILES_INITIALIZED:
      return {
        ...state,
        status: filesStatus.READING,
      }
    case BATCH_READ_FILES_DONE:
      const currentFileNames = state.filesToUpload.map(file => file.name)
      return {
        ...state,
        filesToUpload: [
          ...action.filesToUpload.filter(
            (file: FileObject) => !currentFileNames.includes(file.name),
          ),
          ...state.filesToUpload,
        ],
        status: filesStatus.READING_DONE,
      }
    case BATCH_UPLOAD_FILES_INITIALIZED:
      return {
        ...state,
        status: filesStatus.UPLOADING,
        uploadProgress: new Array(action.count).fill(0),
      }
    case BATCH_UPLOAD_FILES_DONE:
      return {
        ...state,
        response: action.responses,
        status: filesStatus.UPLOADING_DONE,
        filesToUpload: [],
        uploadProgress: [],
      }
    case REMOVE_FILE_FROM_UPLOADS:
      return {
        ...state,
        filesToUpload: state.filesToUpload.slice(0).filter((_, i) => i !== action.index),
      }
    case SET_UPLOAD_PROGRESS:
      return {
        ...state,
        uploadProgress: state.uploadProgress.map((val, i) =>
          i === action.i ? action.updatedProgress : val,
        ),
      }
    case SET_INITIAL_STATE:
      return {
        ...initialState,
      }
    default:
      return state
  }
}

// Action creators
/*** READING ***/
export const batchReadFilesInit = () => ({
  type: BATCH_READ_FILES_INITIALIZED,
})

export const batchReadFilesDone = (filesToUpload: FileObject[]) => ({
  type: BATCH_READ_FILES_DONE,
  filesToUpload,
})

export const batchReadFilesFailure = (error: Error) => ({
  type: BATCH_READ_FILES_FAILURE,
  error,
})

/*** UPLOADING ***/
export const uploadSingleFileInit = () => ({
  type: UPLOAD_SINGLE_FILE_INITIALIZED,
})

export const uploadSingleFileSuccess = response => ({
  type: UPLOAD_SINGLE_FILE_SUCCESS,
  response,
})

export const uploadSingleFileFailure = (error: Error) => ({
  type: UPLOAD_SINGLE_FILE_FAILURE,
  error,
})

export const batchUploadFilesInit = (count: number) => ({
  type: BATCH_UPLOAD_FILES_INITIALIZED,
  count,
})

export const batchUploadFilesDone = ({ model, projectId, responses }) => ({
  type: BATCH_UPLOAD_FILES_DONE,
  model,
  projectId,
  responses,
})

export const batchUploadFilesFailure = (error: Error) => ({
  type: BATCH_UPLOAD_FILES_FAILURE,
  error,
})

/*** MISC ***/
export const removeFileFromUploads = (index: number) => ({
  type: REMOVE_FILE_FROM_UPLOADS,
  index,
})
export const setUploadProgress = ({ updatedProgress, i, length }) => ({
  type: SET_UPLOAD_PROGRESS,
  updatedProgress,
  i,
  length,
})
export const setInitialState = () => ({ type: SET_INITIAL_STATE })

// Thunks
export const batchReadFiles = (files: File[]) => async (dispatch: AppDispatch) => {
  try {
    dispatch(batchReadFilesInit())
    const filesToUpload = await Promise.all(files.map(async file => readSingleFile(file)))
    if (filesToUpload) {
      dispatch(batchReadFilesDone(filesToUpload))
    }
  } catch (error) {
    console.log(error)
    dispatch(batchReadFilesFailure(error as Error))
  }
}

export const readSingleFile = (file: File) => {
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
    return error
  }
}

export const uploadMultipleFiles = ({ filesToUpload, model, projectId, userId }) => async (
  dispatch: (...args: any) => void,
) => {
  try {
    dispatch(batchUploadFilesInit(filesToUpload.length))
    const responses = await Promise.all(
      filesToUpload.map(async (file: FileObject, i: number, self: FileObject[]) =>
        dispatch(uploadSingleFile({ file, model, projectId, userId, i, length: self.length })),
      ),
    )
    if (responses) {
      dispatch(batchUploadFilesDone({ model, projectId, responses }))
    }
  } catch (error) {
    console.log(error)
    dispatch(batchUploadFilesFailure(error as Error))
  }
}

export const uploadSingleFile = ({ file, model, projectId, userId, i, length }) => async (
  dispatch: AppDispatch,
) => {
  try {
    dispatch(uploadSingleFileInit())
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
    if (response) {
      dispatch(uploadSingleFileSuccess(response))
      return response
    }
  } catch (error) {
    console.log(error)
    dispatch(uploadSingleFileFailure(error as Error))
    return error
  }
}
