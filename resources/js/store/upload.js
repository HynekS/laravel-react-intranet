// @ts-check
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

export const filesStatus = {
  IDLE: "idle",
  READING: "reading",
  READING_DONE: "reading_done",
  UPLOADING: "uploading",
  UPLOADING_DONE: "uploading_done",
}

const initialState = {
  status: filesStatus.IDLE,
  response: null,
  filesToUpload: [],
  uploadProgress: [],
}

// Reducer for files state
export default function reducer(state = initialState, action = {}) {
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
          ...action.filesToUpload.filter(file => !currentFileNames.includes(file.name)),
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

export const batchReadFilesDone = filesToUpload => ({
  type: BATCH_READ_FILES_DONE,
  filesToUpload,
})

export const batchReadFilesFailure = error => ({
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

export const uploadSingleFileFailure = error => ({
  type: UPLOAD_SINGLE_FILE_FAILURE,
  error,
})

export const batchUploadFilesInit = count => ({
  type: BATCH_UPLOAD_FILES_INITIALIZED,
  count,
})

export const batchUploadFilesDone = responses => ({
  type: BATCH_UPLOAD_FILES_DONE,
  filesToUpload: [],
  responses,
})

export const batchUploadFilesFailure = error => ({
  type: BATCH_UPLOAD_FILES_FAILURE,
  error,
})

/*** MISC ***/
export const removeFileFromUploads = index => ({
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
export const batchReadFiles = files => async dispatch => {
  try {
    dispatch(batchReadFilesInit())
    const filesToUpload = await Promise.all(files.map(async file => readSingleFile(file)))
    if (filesToUpload) {
      dispatch(batchReadFilesDone(filesToUpload))
    }
  } catch (error) {
    console.log(error)
    dispatch(batchReadFilesFailure(error))
  }
}

export const readSingleFile = file => {
  try {
    return new Promise(resolve => {
      let reader = new FileReader()
      reader.onload = e =>
        resolve({
          content: e.target.result,
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

export const uploadMultipleFiles = ({ filesToUpload, model, id, userId }) => async dispatch => {
  try {
    dispatch(batchUploadFilesInit(filesToUpload.length))
    const responses = await Promise.all(
      filesToUpload.map(async (file, i, { length }) =>
        dispatch(uploadSingleFile({ file, model, id, userId, i, length })),
      ),
    )
    if (responses) {
      dispatch(batchUploadFilesDone(responses))
    }
  } catch (error) {
    console.log(error)
    dispatch(batchUploadFilesFailure(error))
  }
}

export const uploadSingleFile = ({ file, model, id, userId, i, length }) => async dispatch => {
  try {
    dispatch(uploadSingleFileInit())
    const formData = new FormData()
    const data = {
      filesToUpload: [file],
      model,
      id,
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
    dispatch(uploadSingleFileFailure(error))
    return error
  }
}
