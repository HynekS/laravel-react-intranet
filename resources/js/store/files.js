// @ts-check
import client from "../utils/axiosWithDefaults"

// Constants
const DELETE_FILE_INITIALIZED = "[files] File deletion was initialized"
const DELETE_FILE_SUCCESS = "[files] Deleting a file was successful"
const DELETE_FILE_FAILURE = "[files] Deleting a file has failed"

export { DELETE_FILE_INITIALIZED, DELETE_FILE_SUCCESS, DELETE_FILE_FAILURE }

// Reducer
export default function reducer(state = {}, action = {}) {
  switch (action.type) {
    default:
      return state
  }
}

export const deleteFileInitialized = () => ({
  type: DELETE_FILE_INITIALIZED,
})

export const deleteFileSuccess = ({ model, projectId, fileId }) => ({
  type: DELETE_FILE_SUCCESS,
  model,
  projectId,
  fileId,
})

export const deleteFileFailure = error => ({
  type: DELETE_FILE_FAILURE,
  error,
})

// Thunks
export const deleteFile = ({ model, projectId, fileId }) => async dispatch => {
  try {
    dispatch(deleteFileInitialized())
    const response = await client.delete(`file`, {
      data: {
        model,
        projectId,
        fileId,
      },
    })
    if (response) {
      dispatch(deleteFileSuccess({ model, projectId, fileId }))
      alert(response)
    }
  } catch (error) {
    console.log(error)
    dispatch(deleteFileFailure(error))
  }
}
