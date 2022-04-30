import client from "../utils/axiosWithDefaults"

import pointReducer, {
  CREATE_POINT_INITIALIZED,
  CREATE_POINT_SUCCESS,
  CREATE_POINT_FAILURE,
  UPDATE_POINT_INITIALIZED,
  UPDATE_POINT_SUCCESS,
  UPDATE_POINT_FAILURE,
  DELETE_POINT_INITIALIZED,
  DELETE_POINT_SUCCESS,
  DELETE_POINT_FAILURE,
} from "./points"

// Actions
export const CREATE_POINTGROUP_INITIALIZED = "[pointgroups] creating new pointgroup has started"
export const CREATE_POINTGROUP_SUCCESS = "[pointgroups] creating new pointgroup was succesful"
export const CREATE_POINTGROUP_FAILURE = "[pointgroups] creating new pointgroup has failed"

export const UPDATE_POINTGROUP_INITIALIZED = "[pointgroups] updating an pointgroup has started"
export const UPDATE_POINTGROUP_SUCCESS = "[pointgroups] updating an pointgroup was succesful"
export const UPDATE_POINTGROUP_FAILURE = "[pointgroups] updating an pointgroup has failed"

export const DELETE_POINTGROUP_INITIALIZED = "[pointgroups] deleting an pointgroup has started"
export const DELETE_POINTGROUP_SUCCESS = "[pointgroups] deleting an pointgroup was succesful"
export const DELETE_POINTGROUP_FAILURE = "[pointgroups] deleting an pointgroup has failed"

// Reducer
export default function reducer(state = [], action = {}) {
  switch (action.type) {
    case CREATE_POINTGROUP_SUCCESS: {
      return [...state, { ...action.response, points: [] }]
    }
    case UPDATE_POINTGROUP_SUCCESS: {
      let { id } = action.response
      return state.map(pointgroup => (pointgroup.id === id ? action.response : pointgroup))
    }
    case DELETE_POINTGROUP_SUCCESS: {
      let { id } = action.response
      return state.filter(pointgroup => pointgroup.id !== id)
    }
    // These are being handled in projects reducer
    case CREATE_POINTGROUP_INITIALIZED:
    case CREATE_POINTGROUP_FAILURE:
    case UPDATE_POINTGROUP_INITIALIZED:
    case UPDATE_POINTGROUP_FAILURE:
    case DELETE_POINTGROUP_INITIALIZED:
    case DELETE_POINTGROUP_FAILURE:
      return state
    case CREATE_POINT_SUCCESS:
    case UPDATE_POINT_SUCCESS:
    case DELETE_POINT_SUCCESS:
      return state.map(pointgroup =>
        pointgroup.id === action.response.pointgroup_id
          ? pointReducer(pointgroup, action)
          : pointgroup,
      )
    default:
      return state
  }
}

// Action creators
export const createPointgroupInit = () => ({ type: CREATE_POINTGROUP_INITIALIZED })

export const createPointgroupSuccess = ({ response, projectId }) => ({
  type: CREATE_POINTGROUP_SUCCESS,
  response,
  projectId,
})

export const createPointgroupFailure = error => ({ type: CREATE_POINTGROUP_FAILURE, error })

export const updatePointgroupInit = () => ({ type: UPDATE_POINTGROUP_INITIALIZED })

export const updatePointgroupSuccess = ({ response, projectId }) => ({
  type: UPDATE_POINTGROUP_SUCCESS,
  response,
  projectId,
})

export const updatePointgroupFailure = error => ({ type: UPDATE_POINTGROUP_FAILURE, error })

export const deletePointgroupInit = () => ({ type: DELETE_POINTGROUP_INITIALIZED })

export const deletePointgroupSuccess = ({ response, projectId }) => ({
  type: DELETE_POINTGROUP_SUCCESS,
  response,
  projectId,
})

export const deletePointgroupFailure = error => ({ type: DELETE_POINTGROUP_FAILURE, error })

// Thunks
export const createPointgroup = ({ projectId }) => async dispatch => {
  try {
    dispatch(createPointgroupInit())
    let response = await client.post("/pointgroup", { projectId })
    if (response) {
      dispatch(
        createPointgroupSuccess({
          response: response.data,
          projectId,
        }),
      )

      return response.data
    }
  } catch (error) {
    console.log(error)
    dispatch(createPointgroupFailure(error))
  }
}

export const updatePointgroup = ({ pointgroupId, type, projectId }) => async dispatch => {
  try {
    dispatch(updatePointgroupInit())
    let response = await client.put(`/pointgroup/${pointgroupId}`, { type })
    if (response) {
      dispatch(
        updatePointgroupSuccess({
          response: response.data,
          projectId,
        }),
      )
    }
  } catch (error) {
    console.log(error)
    dispatch(updatePointgroupFailure(error))
  }
}

export const deletePointgroup = ({ pointgroupId, projectId }) => async dispatch => {
  try {
    dispatch(deletePointgroupInit())
    let response = await client.delete(`/pointgroup/${pointgroupId}`)
    if (response) {
      dispatch(
        deletePointgroupSuccess({
          response: response.data,
          projectId,
        }),
      )
    }
  } catch (error) {
    console.log(error)
    dispatch(deletePointgroupFailure(error))
  }
}
