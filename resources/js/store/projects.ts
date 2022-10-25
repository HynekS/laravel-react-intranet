import {
  createSlice,
  createAsyncThunk,
  SerializedError,
  PayloadAction,
  isAnyOf,
} from "@reduxjs/toolkit"

import client from "@services/http/client"

import getYearsSince from "@utils/getYearsSince"
import invoiceReducer, { createInvoice, updateInvoice, deleteInvoice } from "./invoices"
import pointgroupsReducer, {
  createPointgroup,
  updatePointgroup,
  deletePointgroup,
} from "./pointgroups"
import { createPoint, updatePoint, deletePoint } from "./points"
import { uploadMultipleFiles } from "./upload"
import fileReducer, { deleteFile } from "./files"

import type { NavigateFunction } from "react-router"
import type { akce as Akce, faktury as Faktura, pointgroups as Pointgroup } from "@codegen"
import type { Model } from "./files"
import type { FileRecord } from "./upload"

const yearsSince2013 = getYearsSince(2013)

type ValidationError = { message: string; errors: { [key: string]: string[] } }

type RequestLifecycle = "idle" | "pending" | "fulfilled" | "rejected"

type AkceWithAll = Akce & { faktury_dohled: Faktura[]; faktury_vyzkum: Faktura[] } & {
  pointgroups: Pointgroup[]
} & { [key in Model]: FileRecord } & { activePointgroupIndex?: number }

interface ProjectsState {
  getSingle: {
    status: RequestLifecycle
    error: null | SerializedError
  }
  getMultiple: {
    status: RequestLifecycle
    error: null | SerializedError
  }
  deleteProject: {
    status: RequestLifecycle
    error: null | SerializedError
  }
  byYear: { [year: string]: { [id: string]: Akce } }
  byId: {
    [id: string]: AkceWithAll
  }
  idsByYear: {
    [key: string]: string[]
  }
}

// TODO remove all the statuses, handle directly using unwrap()
const initialState: ProjectsState = {
  getSingle: { status: "idle", error: null },
  getMultiple: { status: "idle", error: null },
  deleteProject: { status: "idle", error: null },
  byYear: Object.assign({}, ...yearsSince2013.map(val => ({ [val]: {} }))),
  byId: {},
  idsByYear: Object.assign({}, ...yearsSince2013.map(val => ({ [val]: [] }))), // { 2013: [ids...], 2014: [ids..]}
}

const setDefaulPointgroupIndex = (obj: AkceWithAll) => {
  return obj.pointgroups && obj.pointgroups.length ? 0 : undefined
}

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    fetchProjectByYearsInit: state => {
      state.getMultiple.status = "pending"
    },
    fetchProjectByYearsSuccess: state => {
      state.getMultiple.status = "fulfilled"
    },
    setActivePointgroupIndex: (
      state,
      { payload }: PayloadAction<{ projectId: number; newIndex: number | undefined }>,
    ) => {
      state.byId[payload.projectId].activePointgroupIndex = payload.newIndex
    },
  },

  extraReducers: builder => {
    builder.addCase(fetchProject.pending, state => {
      state.getSingle.status = "pending"
    }),
      builder.addCase(fetchProject.fulfilled, (state, { payload }) => {
        state.getSingle.status = "fulfilled"
        state.byId = {
          ...state.byId,
          [payload.id_akce]: {
            activePointgroupIndex: setDefaulPointgroupIndex(payload),
            ...payload,
          },
        }
      }),
      builder.addCase(fetchProject.rejected, (state, { error }) => {
        state.getSingle.status = "rejected"
        state.getSingle.error = error
      }),
      builder.addCase(fetchProjectsOfOneYear.fulfilled, (state, { payload }) => {
        state.byId = Object.assign({}, state.byId, payload.projectsOfOneYear)

        for (const project of Object.values(state.byId)) {
          project["activePointgroupIndex"] = setDefaulPointgroupIndex(project)
        }
        state.idsByYear = {
          ...state.idsByYear,
          [payload.year]: [
            ...new Set([
              ...(state.idsByYear[payload.year] || []),
              ...Object.keys(payload.projectsOfOneYear),
            ]),
          ],
        }
      }),
      builder.addCase(createProject.fulfilled, (state, { payload }) => {
        state.byId = {
          ...state.byId,
          [payload.id]: {
            ...state.byId[payload.id],
            ...payload.createdProject,
          },
        }
        if (payload.createdProject.rok_per_year)
          state.idsByYear[payload.createdProject.rok_per_year].push(String(payload.id))
      }),
      builder.addCase(updateProject.fulfilled, (state, { payload }) => {
        state.byId = {
          ...state.byId,
          [payload.id]: {
            ...state.byId[payload.id],
            ...payload.updatedProject,
          },
        }
      }),
      builder.addCase(deleteProject.fulfilled, (state, { payload }) => {
        const { [payload.id]: deleted, ...withoutDeletedProject } = state.byId
        /* To be honest I am not really sure why I don't have to remove from Id's by year, but it's working anyways */
        return {
          ...state,
          byId: withoutDeletedProject,
        }
      }),
      builder
        .addCase(deleteProject.rejected, (state, { error }) => {
          state.deleteProject.status = "rejected"
          state.deleteProject.error = error as SerializedError
        })

        .addMatcher(
          isAnyOf(createInvoice.fulfilled, updateInvoice.fulfilled, deleteInvoice.fulfilled),
          (state, { type, payload }) => {
            let invoiceType = (["faktury_dohled", "faktury_vyzkum"] as const)[
              payload.data.typ_castky as 0 | 1
            ]
            let stateSlice = state.byId[payload.projectId][invoiceType]
            state.byId[payload.projectId][invoiceType] = invoiceReducer(stateSlice, {
              type,
              payload,
            })
          },
        )
        .addMatcher(
          isAnyOf(
            createPointgroup.fulfilled,
            updatePointgroup.fulfilled,
            deletePointgroup.fulfilled,
          ),
          (state, { type, payload }) => {
            return {
              ...state,
              byId: {
                ...state.byId,
                [payload.projectId]: {
                  ...state.byId[payload.projectId],
                  pointgroups: pointgroupsReducer(state.byId[payload.projectId].pointgroups, {
                    type,
                    payload,
                  }),
                },
              },
            }
          },
        )
        .addMatcher(
          isAnyOf(createPoint.fulfilled, updatePoint.fulfilled, deletePoint.fulfilled),
          (state, { type, payload }) => {
            return {
              ...state,
              byId: {
                ...state.byId,
                [payload.projectId]: {
                  ...state.byId[payload.projectId],
                  pointgroups: pointgroupsReducer(state.byId[payload.projectId].pointgroups, {
                    type,
                    payload,
                  }),
                },
              },
            }
          },
        )
        .addMatcher(
          isAnyOf(deleteFile.fulfilled, uploadMultipleFiles.fulfilled),
          (state, { type, payload }) => {
            return {
              ...state,
              byId: {
                ...state.byId,
                [payload.projectId]: {
                  ...state.byId[payload.projectId],
                  [payload.model]: fileReducer(state.byId[payload.projectId][payload.model], {
                    type,
                    payload,
                  }),
                },
              },
            }
          },
        )
  },
})

export const { fetchProjectByYearsInit, fetchProjectByYearsSuccess, setActivePointgroupIndex } =
  projectsSlice.actions

export const fetchProjectsByYears = createAsyncThunk(
  "projects/fetchProjectByYears",
  async (years: number[], { dispatch }) => {
    dispatch(fetchProjectByYearsInit())
    Promise.all(years.map(async year => dispatch(fetchProjectsOfOneYear(year)))).then(() =>
      dispatch(fetchProjectByYearsSuccess()),
    )
  },
)

export const fetchProjectsOfOneYear = createAsyncThunk<
  { projectsOfOneYear: AkceWithAll[]; year: number },
  number,
  {
    rejectValue: string
  }
>("projects/fetchProjectsOfOneYear", async (year: number) => {
  const response = await client.get(`akce/${year}`)
  return { projectsOfOneYear: response.data, year }
})

export const fetchProject = createAsyncThunk<
  AkceWithAll,
  { year: number; id: number },
  {
    rejectValue: string
  }
>("projects/fetchProject", async ({ year, id }) => {
  const response = await client.get(`akce/${year}/${id}`)
  return response.data
})

export const createProject = createAsyncThunk<
  { id: number; createdProject: Akce },
  {
    navigate: NavigateFunction
    userId: number
    project: Akce
  },
  {
    rejectValue: ValidationError | unknown
  }
>("projects/createProject", async ({ navigate, userId, project }, { rejectWithValue }) => {
  try {
    const response = await client.post(`akce`, { userId, ...project })
    const data = response.data
    if (response.status < 400) {
      navigate(`/akce/${data.rok_per_year}/${data.cislo_per_year}`)
      return { id: data.id_akce, createdProject: data }
    } else {
      return rejectWithValue(response.response.data)
    }
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

export const updateProject = createAsyncThunk<
  { id: number; updatedProject: Akce },
  {
    id: number
    userId: number
    project: Akce
  },
  {
    rejectValue: string
  }
>("projects/updateProject", async ({ id, userId, project }) => {
  const response = await client.put(`akce/${id}`, { userId, ...project })
  return { id, updatedProject: response.data }
})

export const deleteProject = createAsyncThunk<
  { id: number },
  { id: number; userId: number; project: Akce },
  {
    rejectValue: string
  }
>("projects/deleteProject", async ({ id, userId }) => {
  await client.delete(`akce/${id}`, {
    data: { userId, id_akce: id },
  })
  return { id }
})

export default projectsSlice.reducer
