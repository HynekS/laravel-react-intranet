import client from "../utils/axiosWithDefaults"

import { createPointgroup } from "./pointgroups"

// Actions
export const CREATE_POINT_INITIALIZED = "[points] creating new point has started"
export const CREATE_POINT_SUCCESS = "[points] creating new point was succesful"
export const CREATE_POINT_FAILURE = "[points] creating new point has failed"

export const UPDATE_POINT_INITIALIZED = "[points] updating an point has started"
export const UPDATE_POINT_SUCCESS = "[points] updating an point was succesful"
export const UPDATE_POINT_FAILURE = "[points] updating an point has failed"

export const DELETE_POINT_INITIALIZED = "[points] deleting an point has started"
export const DELETE_POINT_SUCCESS = "[points] deleting an point was succesful"
export const DELETE_POINT_FAILURE = "[points] deleting an point has failed"

// Reducer
export default function reducer(state = [], action = {}) {
  switch (action.type) {
    case CREATE_POINT_SUCCESS: {
      return { ...state, points: [...state.points, action.response] }
    }
    case UPDATE_POINT_SUCCESS: {
      let { id } = action.response
      return {
        ...state,
        points: state.points.map(point => (point.id === id ? action.response : point)),
      }
    }
    case DELETE_POINT_SUCCESS: {
      let { id } = action.response
      return { ...state, points: state.points.filter(point => point.id !== id) }
    }
    // These are being handled in projects reducer
    case CREATE_POINT_INITIALIZED:
    case CREATE_POINT_FAILURE:
    case UPDATE_POINT_INITIALIZED:
    case UPDATE_POINT_FAILURE:
    case DELETE_POINT_INITIALIZED:
    case DELETE_POINT_FAILURE:
      return state
    default:
      return state
  }
}

// Action creators
export const createPointInit = () => ({ type: CREATE_POINT_INITIALIZED })

export const createPointSuccess = ({ response, projectId }) => ({
  type: CREATE_POINT_SUCCESS,
  response,
  projectId,
})

export const createPointFailure = error => ({ type: CREATE_POINT_FAILURE, error })

export const updatePointInit = () => ({ type: UPDATE_POINT_INITIALIZED })

export const updatePointSuccess = ({ response, projectId }) => ({
  type: UPDATE_POINT_SUCCESS,
  response,
  projectId,
})

export const updatePointFailure = error => ({ type: UPDATE_POINT_FAILURE, error })

export const deletePointInit = () => ({ type: DELETE_POINT_INITIALIZED })

export const deletePointSuccess = ({ response, projectId }) => ({
  type: DELETE_POINT_SUCCESS,
  response,
  projectId,
})

export const deletePointFailure = error => ({ type: DELETE_POINT_FAILURE, error })

// Thunks
export const createPoint = ({
  pointgroupId,
  latitude,
  longitude,
  projectId,
  userId,
}) => async dispatch => {
  if (pointgroupId == undefined) {
    dispatch(createPointgroup({ projectId })).then(response =>
      dispatch(createPoint({ pointgroupId: response.id, latitude, longitude, projectId, userId })),
    )
  } else {
    try {
      dispatch(createPointInit())
      let response = await client.post("/point", {
        pointgroup_id: pointgroupId,
        latitude,
        longitude,
        akce_id: projectId,
        userId,
      })
      if (response) {
        dispatch(
          createPointSuccess({
            response: response.data,
            projectId,
          }),
        )
      }
    } catch (error) {
      console.log(error)
      dispatch(createPointFailure(error))
    }
  }
}

export const updatePoint = ({
  pointId,
  longitude,
  latitude,
  projectId,
  userId,
}) => async dispatch => {
  try {
    dispatch(updatePointInit())
    let response = await client.put(`/point/${pointId}`, {
      longitude,
      latitude,
      akce_id: projectId,
      userId,
    })
    if (response) {
      dispatch(
        updatePointSuccess({
          response: response.data,
          projectId,
        }),
      )
    }
  } catch (error) {
    console.log(error)
    dispatch(updatePointFailure(error))
  }
}

export const deletePoint = ({ pointId, projectId, userId }) => async dispatch => {
  try {
    dispatch(deletePointInit())
    let response = await client.delete(`/point/${pointId}`, {
      data: { akce_id: projectId, userId },
    })
    if (response) {
      dispatch(
        deletePointSuccess({
          response: response.data,
          projectId,
        }),
      )
    }
  } catch (error) {
    console.log(error)
    dispatch(deletePointFailure(error))
  }
}
