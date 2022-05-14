import type { AnyAction } from "redux"
import { loadProgressBar } from "axios-progress-bar"
import type { akce as Akce } from "../types/model"

import client from "../utils/axiosWithDefaults"

import type { AppDispatch } from "../store/configuredStore"

import invoiceReducer, {
  CREATE_INVOICE_INITIALIZED,
  UPDATE_INVOICE_INITIALIZED,
  DELETE_INVOICE_INITIALIZED,
  CREATE_INVOICE_SUCCESS,
  UPDATE_INVOICE_SUCCESS,
  DELETE_INVOICE_SUCCESS,
  CREATE_INVOICE_FAILURE,
  UPDATE_INVOICE_FAILURE,
  DELETE_INVOICE_FAILURE,
  SET_INVOICE_STATUS,
} from "./invoices"
import fileReducer, { DELETE_FILE_SUCCESS } from "./files"
import { BATCH_UPLOAD_FILES_DONE } from "./upload"
import pointgroupsReducer, {
  CREATE_POINTGROUP_INITIALIZED,
  CREATE_POINTGROUP_SUCCESS,
  CREATE_POINTGROUP_FAILURE,
  UPDATE_POINTGROUP_INITIALIZED,
  UPDATE_POINTGROUP_SUCCESS,
  UPDATE_POINTGROUP_FAILURE,
  DELETE_POINTGROUP_INITIALIZED,
  DELETE_POINTGROUP_FAILURE,
  DELETE_POINTGROUP_SUCCESS,
} from "./pointgroups"
import {
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

export const yearsSince2013 = Array.from(
  { length: new Date().getFullYear() - 2013 + 1 },
  (_, i) => i + 2013,
)

export const status = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
}

const initialState: InitialState = {
  projectStatus: status.IDLE,
  projectError: null,
  invoiceStatus: status.IDLE,
  invoiceError: null,
  pointgroupStatus: status.IDLE,
  pointgroupError: null,
  pointStatus: status.IDLE,
  pointError: null,
  byYear: Object.assign({}, ...yearsSince2013.map(val => ({ [val]: {} }))),
  byId: {},
  allIds: [],
  idsByYear: Object.assign({}, ...yearsSince2013.map(val => ({ [val]: [] }))), // { 2013: [ids...], 2014: [ids..]}
}

type InitialState = {
  projectStatus: typeof status.IDLE
  projectError: string | null
  invoiceStatus: typeof status.IDLE
  invoiceError: string | null
  pointgroupStatus: typeof status.IDLE
  pointgroupError: string | null
  pointStatus: typeof status.IDLE
  pointError: string | null
  byYear: {
    [key: string]: {}
  }
  byId: {
    [key: string]: Akce
  }
  allIds: string[]
  idsByYear: {
    [key: string]: number[]
  }
}

// Actions
const FETCH_PROJECTS_OF_SINGLE_YEAR_INITIALIZED = (year: number) =>
  `[projects] Fetching projects of year ${year} has started`
const FETCH_PROJECTS_OF_SINGLE_YEAR_SUCCESS = (year: number) =>
  `[projects] Fetching projects of year ${year} was succesful`
const FETCH_PROJECTS_OF_SINGLE_YEAR_FAILURE = (year: number) =>
  `[projects] Fetching projects of year ${year} has failed`

const FETCH_PROJECTS_BY_YEARS_INITIALIZED = "[projects] Fetching projects by years has started"
const FETCH_PROJECTS_BY_YEARS_SUCCESS = "[projects] Fetching projects by years was succesful"
const FETCH_PROJECTS_BY_YEARS_FAILURE = "[projects] Fetching projects by years has failed"

const FETCH_SINGLE_PROJECT_INITIALIZED = "[projects] Fetching single project has started"
const FETCH_SINGLE_PROJECT_SUCCESS = "[projects] Fetching single project was succesful"
const FETCH_SINGLE_PROJECT_FAILURE = "[projects] Fetching single project has failed"

const UPDATE_PROJECT_INITIALIZED = "[projects] Updating project has started"
const UPDATE_PROJECT_SUCCESS = "[projects] Updating projects was succesful"
const UPDATE_PROJECT_FAILURE = "[projects] Updating project has failed"

// Reducer
export default function reducer(state: InitialState = initialState, action: AnyAction) {
  switch (action.type) {
    case FETCH_PROJECTS_BY_YEARS_INITIALIZED:
    case FETCH_SINGLE_PROJECT_INITIALIZED:
      return {
        ...state,
        projectStatus: status.LOADING,
        projectError: null,
      }
    case FETCH_SINGLE_PROJECT_SUCCESS:
      return {
        ...state,
        projectStatus: status.SUCCESS,
        byId: {
          ...state.byId,
          [action.project.id_akce]: { ...action.project },
        },
      }
    case FETCH_SINGLE_PROJECT_FAILURE:
    case FETCH_PROJECTS_BY_YEARS_FAILURE:
      return {
        ...state,
        projectStatus: status.ERROR,
        projectError: action.error,
      }
    case FETCH_PROJECTS_BY_YEARS_SUCCESS:
      return {
        ...state,
        projectStatus: status.SUCCESS,
      }
    case FETCH_PROJECTS_OF_SINGLE_YEAR_SUCCESS(action.year):
      return {
        ...state,
        byId: Object.assign({}, state.byId, action.projectsOfOneYear),
        allIds: state.allIds.concat(Object.keys(action.projectsOfOneYear)),
        idsByYear: {
          ...state.idsByYear,
          [action.year]: [
            // BEWARE: this throws error (luckily catchable) if year has no projects
            ...new Set([...state.idsByYear[action.year], ...Object.keys(action.projectsOfOneYear)]),
          ],
        },
      }
    case UPDATE_PROJECT_SUCCESS:
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.id]: {
            ...state.byId[action.id],
            ...action.updatedProject,
          },
        },
      }
    case CREATE_INVOICE_INITIALIZED:
    case UPDATE_INVOICE_INITIALIZED:
    case DELETE_INVOICE_INITIALIZED:
      return {
        ...state,
        invoiceStatus: status.LOADING,
        invoiceError: null,
      }
    case CREATE_INVOICE_SUCCESS:
    case UPDATE_INVOICE_SUCCESS:
    case DELETE_INVOICE_SUCCESS:
      let invoiceType = ["faktury_dohled", "faktury_vyzkum"][action.typ_castky]
      return {
        ...state,
        invoiceStatus: status.SUCCESS,
        byId: {
          ...state.byId,
          [action.projectId]: {
            ...state.byId[action.projectId],
            [invoiceType]: invoiceReducer(state.byId[action.projectId][invoiceType], action),
          },
        },
      }
    case CREATE_INVOICE_FAILURE:
    case UPDATE_INVOICE_FAILURE:
    case DELETE_INVOICE_FAILURE:
      return {
        ...state,
        invoiceStatus: status.ERROR,
        invoiceError: action.error,
      }
    case SET_INVOICE_STATUS:
      return {
        ...state,
        invoiceStatus: action.status,
      }
    case DELETE_FILE_SUCCESS:
    case BATCH_UPLOAD_FILES_DONE:
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.projectId]: {
            ...state.byId[action.projectId],
            [action.model]: fileReducer(state.byId[action.projectId][action.model], action),
          },
        },
      }
    case CREATE_POINTGROUP_INITIALIZED:
    case UPDATE_POINTGROUP_INITIALIZED:
    case DELETE_POINTGROUP_INITIALIZED:
      return {
        ...state,
        pointgroupStatus: status.LOADING,
        pointgroupError: null,
      }
    case CREATE_POINTGROUP_SUCCESS:
    case UPDATE_POINTGROUP_SUCCESS:
    case DELETE_POINTGROUP_SUCCESS:
      return {
        ...state,
        pointgroupStatus: status.SUCCESS,
        byId: {
          ...state.byId,
          [action.projectId]: {
            ...state.byId[action.projectId],
            pointgroups: pointgroupsReducer(state.byId[action.projectId].pointgroups, action),
          },
        },
      }
    case CREATE_POINT_SUCCESS:
    case UPDATE_POINT_SUCCESS:
    case DELETE_POINT_SUCCESS:
      // Should points have statuses too?
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.projectId]: {
            ...state.byId[action.projectId],
            pointgroups: pointgroupsReducer(state.byId[action.projectId].pointgroups, action),
          },
        },
      }
    case CREATE_POINTGROUP_FAILURE:
    case UPDATE_POINTGROUP_FAILURE:
    case DELETE_POINTGROUP_FAILURE:
      return {
        ...state,
        pointgroupStatus: status.ERROR,
      }
    default:
      return state
  }
}

// Action creators
export const fetchProjectByYearsInit = () => ({
  type: FETCH_PROJECTS_BY_YEARS_INITIALIZED,
})

export const fetchProjectByYearsSuccess = () => ({
  type: FETCH_PROJECTS_BY_YEARS_SUCCESS,
})

export const fetchProjectByYearsFailure = (error: Error) => ({
  type: FETCH_PROJECTS_BY_YEARS_FAILURE,
  error,
})

export const fetchProjectsOfOneYearInit = (year: number) => ({
  type: FETCH_PROJECTS_OF_SINGLE_YEAR_INITIALIZED(year),
  year,
})

export const fetchProjectsOfOneYearSuccess = (projectsOfOneYear: Akce[], year: number) => ({
  type: FETCH_PROJECTS_OF_SINGLE_YEAR_SUCCESS(year),
  projectsOfOneYear,
  year,
})

export const fetchProjectsOfOneYearFailure = (year: number, error: Error) => ({
  type: FETCH_PROJECTS_OF_SINGLE_YEAR_FAILURE(year),
  error,
  year,
})

export const updateProjectInit = () => ({ type: UPDATE_PROJECT_INITIALIZED })

export const updateProjectSuccess = (id: number, updatedProject: Akce) => ({
  type: UPDATE_PROJECT_SUCCESS,
  id,
  updatedProject,
})

export const updateProjectFailure = (error: Error) => ({ type: UPDATE_PROJECT_FAILURE, error })

export const fetchSingleProjectInit = () => ({ type: FETCH_SINGLE_PROJECT_INITIALIZED })

export const fetchSingleProjectSuccess = (project: Akce) => ({
  type: FETCH_SINGLE_PROJECT_SUCCESS,
  project,
})

export const fetchSingleProjectFailure = (error: Error) => ({
  type: FETCH_SINGLE_PROJECT_FAILURE,
  error,
})

// Thunks
export const fetchProjectsByYears = (years: number[]) => async (
  dispatch: (args: unknown) => void,
) => {
  try {
    dispatch(fetchProjectByYearsInit())
    Promise.all(years.map(async year => dispatch(fetchProjectsOfOneYear(year)))).then(() =>
      dispatch(fetchProjectByYearsSuccess()),
    )
  } catch (error) {
    dispatch(fetchProjectByYearsFailure(error as Error))
  }
}

export const fetchProjectsOfOneYear = (year: number) => async (dispatch: AppDispatch) => {
  try {
    dispatch(fetchProjectsOfOneYearInit(year))
    const response = await client.get(`akce/${year}`)
    if (response) {
      dispatch(fetchProjectsOfOneYearSuccess(response.data, year))
    }
  } catch (error) {
    console.log(error)
    dispatch(fetchProjectsOfOneYearFailure(year, error as Error))
  }
}

export const fetchProject = ({ year, id }) => async (dispatch: AppDispatch) => {
  try {
    dispatch(fetchSingleProjectInit())
    loadProgressBar({}, client)
    const response = await client.get(`akce/${year}/${id}`)
    if (response) {
      dispatch(fetchSingleProjectSuccess(response.data))
    }
  } catch (error) {
    console.log(error)
    dispatch(fetchSingleProjectFailure(error as Error))
  }
  loadProgressBar({ progress: false })
}

export const updateProject = ({ id, userId, ...project }) => async (dispatch: AppDispatch) => {
  try {
    dispatch(updateProjectInit())
    loadProgressBar({}, client)
    const response = await client.put(`akce/${id}`, { id_akce: id, userId, ...project })
    if (response) {
      dispatch(updateProjectSuccess(id, response.data))
    }
  } catch (error) {
    console.log(error)
    dispatch(updateProjectFailure(error as Error))
  }
  loadProgressBar({ progress: false })
}
