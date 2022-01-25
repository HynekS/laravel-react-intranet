import client from "../utils/axiosWithDefaults"
import { BATCH_UPLOAD_FILES_DONE } from "./upload"

import type { AnyAction } from "redux"
import type { AppDispatch } from "../store/configuredStore"

export type TFile = {
  type: typeof DELETE_FILE_INITIALIZED | typeof DELETE_FILE_SUCCESS | typeof DELETE_FILE_FAILURE
  model:
    | "teren_databaze"
    | "LAB_databaze"
    | "teren_foto"
    | "teren_scan"
    | "digitalizace_nalez"
    | "digitalizace_plany"
    | "geodet_body"
    | "geodet_plany"
  projectId: string
  fileId: number
  userId?: number
}

// Constants
const DELETE_FILE_INITIALIZED = "[files] File deletion was initialized"
const DELETE_FILE_SUCCESS = "[files] Deleting a file was successful"
const DELETE_FILE_FAILURE = "[files] Deleting a file has failed"

export { DELETE_FILE_INITIALIZED, DELETE_FILE_SUCCESS, DELETE_FILE_FAILURE }

type FileState = Array<{
  id: number
}>

// Reducer
export default function reducer(state: FileState = [], action: AnyAction) {
  switch (action.type) {
    case DELETE_FILE_SUCCESS:
      return state.filter(file => file.id && file.id !== action.fileId)
    case BATCH_UPLOAD_FILES_DONE:
      return ["teren_databaze", "LAB_databaze"].includes(action.model)
        ? [...action.responses.map(response => response.data.file)]
        : [...state, ...action.responses.map(response => response.data.file)]
    default:
      return state
  }
}

export const deleteFileInitialized = () => ({
  type: DELETE_FILE_INITIALIZED,
})

export const deleteFileSuccess = ({ model, projectId, fileId }: Omit<TFile, "type">) => ({
  type: DELETE_FILE_SUCCESS,
  model,
  projectId,
  fileId,
})

export const deleteFileFailure = (error: Error) => ({
  type: DELETE_FILE_FAILURE,
  error,
})

// Thunks
// ! Important: Must have user field!
export const deleteFile = ({ model, projectId, fileId, userId }: Omit<TFile, "type">) => async (
  dispatch: AppDispatch,
) => {
  try {
    dispatch(deleteFileInitialized())
    const response = await client.delete(`file`, {
      data: {
        model,
        projectId,
        fileId,
        userId,
      },
    })
    if (response) {
      dispatch(deleteFileSuccess({ model, projectId, fileId }))
    }
  } catch (error) {
    console.log(error)
    dispatch(deleteFileFailure(error as Error))
  }
}
