import { loadProgressBar } from "axios-progress-bar"
import client from "../utils/axiosWithDefaults"

const yearsSince2013 = Array.from(
  { length: new Date().getFullYear() - 2013 + 1 },
  (_, i) => i + 2013,
)

const initialState = {
  isFetching: false,
  error: null,
  byYear: Object.assign({}, ...yearsSince2013.map(val => ({ [val]: {} }))),
  ById: {},
  AllIds: [],
  IdsByYear: Object.assign({}, ...yearsSince2013.map(val => ({ [val]: [] }))), // { 2013: [ids...], 2014: [ids..]}
}

// Actions
const FETCH_PROJECTS_OF_ONE_YEAR_INITIALIZED = year =>
  `[projects] Fetching projects of year ${year} has started`
const FETCH_PROJECTS_OF_ONE_YEAR_SUCCESS = year =>
  `[projects] Fetching projects of year ${year} was succesful`
const FETCH_PROJECTS_OF_ONE_YEAR_FAILURE = "[projects] Fetching projects of one year has failed"

const FETCH_SINGLE_PROJECT_INITIALIZED = "[projects] Fetching single project has started"
const FETCH_SINGLE_PROJECT_SUCCESS = "[projects] Fetching single project was succesful"
const FETCH_SINGLE_PROJECT_FAILURE = "[projects] Fetching single project has failed"

// Reducer
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case FETCH_PROJECTS_OF_ONE_YEAR_INITIALIZED(action.year):
      return {
        ...state,
        isFetching: true,
      }
    case FETCH_PROJECTS_OF_ONE_YEAR_SUCCESS(action.year):
      return {
        ...state,
        isFetching: false,
        byId: Object.assign({}, state.byId, action.projectsOfOneYear),
        AllIds: state.AllIds.concat(Object.keys(action.projectsOfOneYear)),
        IdsByYear: {
          ...state.IdsByYear,
          [action.year]: [
            ...new Set([...state.IdsByYear[action.year], ...Object.keys(action.projectsOfOneYear)]),
          ],
        },

        //AllIds: state.AllIds.concat(action.projectsOfOneYear.map(akce => akce.id_akce)),
      }
    case FETCH_PROJECTS_OF_ONE_YEAR_FAILURE:
      console.log(action.error)
      return {
        ...state,
        isFetching: false,
        error: action.error,
      }
    default:
      return state
  }
}

// Action creators
const fetchProjectsOfOneYearInit = year => ({
  type: FETCH_PROJECTS_OF_ONE_YEAR_INITIALIZED(year),
  year,
})

const fetchProjectsOfOneYearSuccess = (projectsOfOneYear, year) => ({
  type: FETCH_PROJECTS_OF_ONE_YEAR_SUCCESS(year),
  projectsOfOneYear,
  year,
})

const fetchProjectsOfOneYearFailure = error => ({
  type: FETCH_PROJECTS_OF_ONE_YEAR_FAILURE,
  error,
})

// Thunks
export const fetchProjectsOfOneYear = year => async dispatch => {
  try {
    loadProgressBar({}, client)
    dispatch(fetchProjectsOfOneYearInit(year))
    const response = await client.get(`akce/${year}`)
    dispatch(fetchProjectsOfOneYearSuccess(response.data, year))
  } catch (error) {
    dispatch(fetchProjectsOfOneYearFailure(error))
  }
  loadProgressBar({ progress: false })
}
