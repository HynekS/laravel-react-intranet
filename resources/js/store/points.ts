import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

import client from "@services/http/client"

import type { pointgroups as Pointgroup, points as Point } from "@codegen"

import { createPointgroup } from "./pointgroups"
import { setUpdateId } from "./updates"

export type PointgroupWithPoins = Pointgroup & { points: Point[] }

export const pointsSlice = createSlice({
  name: "points",
  initialState: {} as PointgroupWithPoins,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(createPoint.fulfilled, (state, { payload }) => {
      return { ...state, points: [...state.points, payload.data] }
    })
    builder.addCase(updatePoint.fulfilled, (state, { payload }) => {
      let { id } = payload.data
      return {
        ...state,
        points: state.points.map(point => (point.id === id ? payload.data : point)),
      }
    })
    builder.addCase(deletePoint.fulfilled, (state, { payload }) => {
      let { id } = payload.data
      return { ...state, points: state.points.filter(point => point.id !== id) }
    })
  },
})

export const createPoint = createAsyncThunk<
  { projectId: number; data: Point },
  {
    pointgroupId: number | undefined
    latitude: number
    longitude: number
    projectId: number
    userId: number
  },
  {
    rejectValue: string
  }
>(
  "points/createPoint",
  async ({ pointgroupId, latitude, longitude, projectId, userId }, { dispatch }) => {
    const maybeId = pointgroupId
      ? pointgroupId
      : await dispatch(createPointgroup({ projectId }))
          .unwrap()
          .then(res => res.data.id)

    const response = await client.post("/point", {
      pointgroup_id: maybeId,
      latitude,
      longitude,
      akce_id: projectId,
      userId,
    })
    dispatch(setUpdateId(response.data.update_id))
    return {
      projectId,
      data: response.data,
    }
  },
)

export const updatePoint = createAsyncThunk<
  { projectId: number; data: Point },
  {
    pointId: number
    longitude: number
    latitude: number
    projectId: number
    userId: number
  },
  {
    rejectValue: string
  }
>(
  "points/updatePoint",
  async ({ pointId, longitude, latitude, projectId, userId }, { dispatch }) => {
    const response = await client.put(`/point/${pointId}`, {
      longitude,
      latitude,
      akce_id: projectId,
      userId,
    })
    dispatch(setUpdateId(response.data.update_id))
    return {
      projectId,
      data: response.data,
    }
  },
)

export const deletePoint = createAsyncThunk<
  { projectId: number; data: Point },
  { pointId: number; projectId: number; userId: number },
  {
    rejectValue: string
  }
>("points/deletePoint", async ({ pointId, projectId, userId }, { dispatch }) => {
  const response = await client.delete(`/point/${pointId}`, {
    data: { akce_id: projectId, userId },
  })
  dispatch(setUpdateId(response.data.update_id))
  return {
    projectId,
    data: response.data,
  }
})

export default pointsSlice.reducer
