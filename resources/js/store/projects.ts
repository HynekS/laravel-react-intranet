import type { AnyAction } from "redux"
import { loadProgressBar } from "axios-progress-bar"
import type { akce as Akce } from "../types/model"

import client from "../utils/axiosWithDefaults"
import invoiceReducer from "./invoices"
import fileReducer from "./files"
import type { AppDispatch } from "../store/configuredStore"

import {
  CREATE_INVOICE_INITIALIZED,
  UPDATE_INVOICE_INITIALIZED,
  DELETE_INVOICE_INITIALIZED,
  CREATE_INVOICE_SUCCESS,
  UPDATE_INVOICE_SUCCESS,
  DELETE_INVOICE_SUCCESS,
  CREATE_INVOICE_FAILURE,
  UPDATE_INVOICE_FAILURE,
  DELETE_INVOICE_FAILURE,
} from "./invoices"
import { DELETE_FILE_SUCCESS } from "./files"
import { BATCH_UPLOAD_FILES_DONE } from "./upload"

export const yearsSince2013 = Array.from(
  { length: new Date().getFullYear() - 2013 + 1 },
  (_, i) => i + 2013,
)

export const projectStatus = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
}

export const invoiceStatus = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
}

const initialState = {
  projectStatus: projectStatus.IDLE,
  invoiceStatus: invoiceStatus.IDLE,
  byYear: Object.assign({}, ...yearsSince2013.map(val => ({ [val]: {} }))),
  byId: {},
  allIds: [],
  idsByYear: Object.assign({}, ...yearsSince2013.map(val => ({ [val]: [] }))), // { 2013: [ids...], 2014: [ids..]}
}

type TInitialState = {
  projectStatus: typeof projectStatus.IDLE
  invoiceStatus: typeof invoiceStatus.IDLE
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
export default function reducer(state: TInitialState = initialState, action: AnyAction) {
  switch (action.type) {
    case FETCH_PROJECTS_BY_YEARS_INITIALIZED:
    case FETCH_SINGLE_PROJECT_INITIALIZED:
      return {
        ...state,
        projectStatus: projectStatus.LOADING,
      }
    case FETCH_SINGLE_PROJECT_SUCCESS:
      return {
        ...state,
        projectStatus: projectStatus.SUCCESS,
        byId: {
          ...state.byId,
          [action.project.id_akce]: { ...action.project },
        },
      }
    case FETCH_SINGLE_PROJECT_FAILURE:
      return {
        ...state,
        projectStatus: projectStatus.ERROR,
      }
    case FETCH_PROJECTS_BY_YEARS_SUCCESS:
      return {
        ...state,
        projectStatus: projectStatus.SUCCESS,
      }
    case FETCH_PROJECTS_BY_YEARS_FAILURE:
      return {
        ...state,
        projectStatus: projectStatus.ERROR,
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
        invoiceStatus: invoiceStatus.LOADING,
      }
    case CREATE_INVOICE_SUCCESS:
    case UPDATE_INVOICE_SUCCESS:
    case DELETE_INVOICE_SUCCESS:
      // TODO normalize the shape (id_akce => projectId etc...)
      let invoiceType = ["faktury_dohled", "faktury_vyzkum"][action.typ_castky]
      return {
        ...state,
        invoiceStatus: invoiceStatus.SUCCESS,
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
        invoiceStatus: invoiceStatus.ERROR,
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
    console.log({ year })
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
