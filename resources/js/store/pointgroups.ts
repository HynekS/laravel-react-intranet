import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit"

import client from "@services/http/client"

import store from "./configuredStore"
import { setActivePointgroupIndex } from "./projects"
import pointReducer, { createPoint, updatePoint, deletePoint } from "./points"

import type { pointgroups as Pointgroup } from "@codegen"
import type { PointgroupWithPoins } from "./points"

type FeatureType = "point" | "line" | "polygon"

export const pointgroupsSlice = createSlice({
  name: "pointgroups",
  initialState: [] as Pointgroup[],
  reducers: {},
  extraReducers: builder => {
    builder.addCase(createPointgroup.fulfilled, (state, { payload }) => {
      return [...state, { ...payload.data, points: [] }]
    })
    builder.addCase(updatePointgroup.fulfilled, (state, { payload }) => {
      let { id } = payload.data
      return state.map(pointgroup => (pointgroup.id === id ? payload.data : pointgroup))
    })
    builder.addCase(deletePointgroup.fulfilled, (state, { payload }) => {
      let { id } = payload.data
      return state.filter(pointgroup => pointgroup.id !== id)
    })
    builder.addMatcher(
      isAnyOf(createPoint.fulfilled, updatePoint.fulfilled, deletePoint.fulfilled),
      (state, { type, payload }) => {
        return state.map(pointgroup =>
          pointgroup.id === payload.data.pointgroup_id
            ? pointReducer(pointgroup as PointgroupWithPoins, { type, payload })
            : pointgroup,
        )
      },
    )
  },
})

export const createPointgroup = createAsyncThunk<
  { projectId: number; data: Pointgroup },
  { projectId: number },
  {
    rejectValue: string
  }
>("pointgroups/createPointgroup", async ({ projectId }, { dispatch }) => {
  const currentLength = store.getState().projects.byId[projectId].pointgroups.length
  console.log("pointgroups/createPointgroup", { currentLength })

  const response = await client.post("/pointgroup", { projectId })
  dispatch(setActivePointgroupIndex({ newIndex: currentLength, projectId }))
  return { projectId, data: response.data }
})

export const updatePointgroup = createAsyncThunk<
  { projectId: number; data: Pointgroup },
  { pointgroupId: number; feature_type: FeatureType; projectId: number },
  {
    rejectValue: string
  }
>("pointgroups/updatePointgroup", async ({ pointgroupId, feature_type, projectId }) => {
  const response = await client.put(`/pointgroup/${pointgroupId}`, { feature_type })
  return { projectId, data: response.data }
})

export const deletePointgroup = createAsyncThunk<
  { projectId: number; data: Pointgroup },
  { pointgroupId: number; projectId: number },
  {
    rejectValue: string
  }
>("pointgroups/deletePointgroup", async ({ pointgroupId, projectId }, { dispatch }) => {
  const currentLength = store.getState().projects.byId[projectId].pointgroups.length
  console.log({ currentLength })

  const response = await client.delete(`/pointgroup/${pointgroupId}`)
  dispatch(
    setActivePointgroupIndex({
      newIndex: currentLength - 2 >= 0 ? currentLength - 2 : undefined,
      projectId,
    }),
  )
  return {
    projectId,
    data: response.data,
  }
})

export default pointgroupsSlice.reducer
