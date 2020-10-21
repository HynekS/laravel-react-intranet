// @ts-check
import { loadProgressBar } from "axios-progress-bar"
import client from "../utils/axiosWithDefaults"

import invoiceReducer from "./invoices"

import { CREATE_INVOICE_SUCCESS, UPDATE_INVOICE_SUCCESS, DELETE_INVOICE_SUCCESS } from "./invoices"

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

const initialState = {
  status: projectStatus.IDLE,
  byYear: Object.assign({}, ...yearsSince2013.map(val => ({ [val]: {} }))),
  byId: {},
  allIds: [],
  idsByYear: Object.assign({}, ...yearsSince2013.map(val => ({ [val]: [] }))), // { 2013: [ids...], 2014: [ids..]}
}

// Actions
const FETCH_PROJECTS_OF_SINGLE_YEAR_INITIALIZED = year =>
  `[projects] Fetching projects of year ${year} has started`
const FETCH_PROJECTS_OF_SINGLE_YEAR_SUCCESS = year =>
  `[projects] Fetching projects of year ${year} was succesful`
const FETCH_PROJECTS_OF_SINGLE_YEAR_FAILURE = year =>
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
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case FETCH_PROJECTS_BY_YEARS_INITIALIZED:
    case FETCH_SINGLE_PROJECT_INITIALIZED:
      return {
        ...state,
        status: projectStatus.LOADING,
      }
    case FETCH_SINGLE_PROJECT_SUCCESS:
      return {
        ...state,
        status: projectStatus.SUCCESS,
        byId: {
          ...state.byId,
          [action.project.id_akce]: { ...action.project },
        },
      }
    case FETCH_SINGLE_PROJECT_FAILURE:
      return {
        ...state,
        status: projectStatus.ERROR,
      }
    case FETCH_PROJECTS_BY_YEARS_SUCCESS:
      return {
        ...state,
        status: projectStatus.SUCCESS,
      }
    case FETCH_PROJECTS_BY_YEARS_FAILURE:
      return {
        ...state,
        status: projectStatus.ERROR,
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
    case CREATE_INVOICE_SUCCESS:
    case UPDATE_INVOICE_SUCCESS:
    case DELETE_INVOICE_SUCCESS:
      let invoiceType = ["faktury_dohled", "faktury_vyzkum"][action.typ_castky]
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.id_akce]: {
            ...state.byId[action.id_akce],
            [invoiceType]: invoiceReducer(state.byId[action.id_akce][invoiceType], action),
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

export const fetchProjectByYearsFailure = error => ({
  type: FETCH_PROJECTS_BY_YEARS_FAILURE,
  error,
})

export const fetchProjectsOfOneYearInit = year => ({
  type: FETCH_PROJECTS_OF_SINGLE_YEAR_INITIALIZED(year),
  year,
})

export const fetchProjectsOfOneYearSuccess = (projectsOfOneYear, year) => ({
  type: FETCH_PROJECTS_OF_SINGLE_YEAR_SUCCESS(year),
  projectsOfOneYear,
  year,
})

export const fetchProjectsOfOneYearFailure = (year, error) => ({
  type: FETCH_PROJECTS_OF_SINGLE_YEAR_FAILURE(year, error),
  error,
  year,
})

export const updateProjectInit = () => ({ type: UPDATE_PROJECT_INITIALIZED })

export const updateProjectSuccess = (id, updatedProject) => ({
  type: UPDATE_PROJECT_SUCCESS,
  id,
  updatedProject,
})

export const updateProjectFailure = error => ({ type: UPDATE_PROJECT_FAILURE, error })

export const fetchSingleProjectInit = () => ({ type: FETCH_SINGLE_PROJECT_INITIALIZED })

export const fetchSingleProjectSuccess = project => ({
  type: FETCH_SINGLE_PROJECT_SUCCESS,
  project,
})

export const fetchSingleProjectFailure = error => ({ type: FETCH_SINGLE_PROJECT_FAILURE, error })

// export const manageInvoices = payload => ({ type: MANAGE_INVOICES, ...payload })
export const manageInvoices = ({ type, response, ...payload }) => ({
  type: type,
  response,
  ...payload,
})

// Thunks
export const fetchProjectsByYears = years => async dispatch => {
  try {
    dispatch(fetchProjectByYearsInit())
    Promise.all(years.map(async year => dispatch(fetchProjectsOfOneYear(year)))).then(() =>
      dispatch(fetchProjectByYearsSuccess()),
    )
  } catch (error) {
    dispatch(fetchProjectByYearsFailure(error))
  }
}

export const fetchProjectsOfOneYear = year => async dispatch => {
  try {
    dispatch(fetchProjectsOfOneYearInit(year))
    const response = await client.get(`akce/${year}`)
    if (response) {
      dispatch(fetchProjectsOfOneYearSuccess(response.data, year))
    }
  } catch (error) {
    console.log({ year })
    dispatch(fetchProjectsOfOneYearFailure(year, error))
  }
}

export const fetchProject = ({ year, id }) => async dispatch => {
  try {
    dispatch(fetchSingleProjectInit())
    loadProgressBar({}, client)
    const response = await client.get(`akce/${year}/${id}`)
    if (response) {
      dispatch(fetchSingleProjectSuccess(response.data))
    }
  } catch (error) {
    console.log(error)
    dispatch(fetchSingleProjectFailure(error))
  }
  loadProgressBar({ progress: false })
}

export const updateProject = ({ id, ...project }) => async dispatch => {
  try {
    dispatch(updateProjectInit())
    loadProgressBar({}, client)
    const response = await client.put(`akce/${id}`, { id_akce: id, ...project })
    if (response) {
      dispatch(updateProjectSuccess(id, response.data))
    }
  } catch (error) {
    console.log(error)
    dispatch(updateProjectFailure(error))
  }
  loadProgressBar({ progress: false })
}
