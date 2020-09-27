import { loadProgressBar } from "axios-progress-bar"
import client from "../utils/axiosWithDefaults"
import store from "./configuredStore"

const yearsSince2013 = Array.from(
  { length: new Date().getFullYear() - 2013 + 1 },
  (_, i) => i + 2013,
)

const initialState = {
  isFetchingOneYear: false,
  fetchingOneYearError: null,
  byYear: Object.assign({}, ...yearsSince2013.map(val => ({ [val]: {} }))),
  byId: {},
  allIds: [],
  idsByYear: Object.assign({}, ...yearsSince2013.map(val => ({ [val]: [] }))), // { 2013: [ids...], 2014: [ids..]}
  isFetchingAll: false,
  isAllFetched: false,
  fetchingAllError: null,
}

// Actions
const FETCH_PROJECTS_OF_SINGLE_YEAR_INITIALIZED = year =>
  `[projects] Fetching projects of year ${year} has started`
const FETCH_PROJECTS_OF_SINGLE_YEAR_SUCCESS = year =>
  `[projects] Fetching projects of year ${year} was succesful`
const FETCH_PROJECTS_OF_SINGLE_YEAR_FAILURE = year =>
  `[projects] Fetching projects of year ${year} has failed`

const FETCH_ALL_PROJECTS_INITIALIZED = "[projects] Fetching all projects has started"
const FETCH_ALL_PROJECTS_SUCCESS = "[projects] Fetching all projects was succesful"
const FETCH_ALL_PROJECTS_FAILURE = "[projects] Fetching all projects has failed"

const FETCH_SINGLE_PROJECT_INITIALIZED = "[projects] Fetching single project has started"
const FETCH_SINGLE_PROJECT_SUCCESS = "[projects] Fetching single project was succesful"
const FETCH_SINGLE_PROJECT_FAILURE = "[projects] Fetching single project has failed"

const UPDATE_PROJECT_INITIALIZED = "[projects] Updating project has started"
const UPDATE_PROJECT_SUCCESS = "[projects] Updating projects was succesful"
const UPDATE_PROJECT_FAILURE = "[projects] Updating project has failed"

// Reducer
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case FETCH_ALL_PROJECTS_INITIALIZED:
      return {
        ...state,
        isFetchingAll: true,
      }
    case FETCH_ALL_PROJECTS_SUCCESS:
      return {
        ...state,
        isAllFetched: true,
        isFetchingAll: false,
      }
    case FETCH_ALL_PROJECTS_FAILURE:
      return {
        ...state,
        isFetchingAll: false,
        fetchingAllError: action.error,
      }
    case FETCH_PROJECTS_OF_SINGLE_YEAR_INITIALIZED(action.year):
      return {
        ...state,
        isFetchingOneYear: true,
      }
    case FETCH_PROJECTS_OF_SINGLE_YEAR_SUCCESS(action.year):
      return {
        ...state,
        isFetchingOneYear: false,
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
    case FETCH_PROJECTS_OF_SINGLE_YEAR_FAILURE(action.year):
      return {
        ...state,
        isFetchingOneYear: false,
        fetchingOneYearError: action.error,
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
    default:
      return state
  }
}

// Action creators
const fetchProjectsOfOneYearInit = year => ({
  type: FETCH_PROJECTS_OF_SINGLE_YEAR_INITIALIZED(year),
  year,
})

const fetchProjectsOfOneYearSuccess = (projectsOfOneYear, year) => ({
  type: FETCH_PROJECTS_OF_SINGLE_YEAR_SUCCESS(year),
  projectsOfOneYear,
  year,
})

const fetchProjectsOfOneYearFailure = error => ({
  type: FETCH_PROJECTS_OF_SINGLE_YEAR_FAILURE(year, error),
  error,
  year,
})

const fetchAllProjectsInit = () => ({
  type: FETCH_ALL_PROJECTS_INITIALIZED,
})

const fetchAllProjectsSuccess = () => ({
  type: FETCH_ALL_PROJECTS_SUCCESS,
})

const fetchAllProjectsFailure = error => ({
  type: FETCH_ALL_PROJECTS_FAILURE,
  error,
})

const updateProjectInit = () => ({ type: UPDATE_PROJECT_INITIALIZED })

const updateProjectSuccess = (id, updatedProject) => ({
  type: UPDATE_PROJECT_SUCCESS,
  id,
  updatedProject,
})

const updateProjectFailure = error => ({ type: UPDATE_PROJECT_FAILURE, error })

// Thunks
export const fetchProjectsOfOneYear = year => async dispatch => {
  dispatch(fetchProjectsOfOneYearInit(year))
  try {
    if (!store.getState().projects.isFetchingAll) loadProgressBar({}, client)
    const response = await client.get(`akce/${year}`)
    dispatch(fetchProjectsOfOneYearSuccess(response.data, year))
  } catch (error) {
    dispatch(fetchProjectsOfOneYearFailure(year, error))
  }
  if (!store.getState().projects.isFetchingAll) loadProgressBar({ progress: false })
}

export const fetchAllProjects = () => async dispatch => {
  dispatch(fetchAllProjectsInit())
  try {
    loadProgressBar({}, client)
    Promise.all(yearsSince2013.map(async year => dispatch(fetchProjectsOfOneYear(year)))).then(_ =>
      dispatch(fetchAllProjectsSuccess()),
    )
  } catch (error) {
    dispatch(fetchAllProjectsFailure(error))
  }
  loadProgressBar({ progress: false })
}

export const updateProject = ({ id, ...project }) => async dispatch => {
  dispatch(updateProjectInit())
  try {
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
