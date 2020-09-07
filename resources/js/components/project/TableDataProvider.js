import React, { useEffect } from "react"
import { useParams } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { createSelector } from "reselect"

import BaseTable from "./BaseTable"
import "axios-progress-bar/dist/nprogress.css"
import { fetchProjectsOfOneYear, fetchAllProjects } from "../../store/projects"

const getYear = (_, year) => year

const getProjectIdsByYear = (state, year) => state.projects.IdsByYear[year]
const getProjectsById = state => state.projects.byId

const getIsFetchingAll = state => state.projects.isFetchingAll
const getIsAllFetched = state => state.projects.isAllFetched

const singleYearSelector = createSelector(
  getProjectIdsByYear,
  getProjectsById,
  (projectIdsByYear, projectsById) => (projectIdsByYear || []).map(id => projectsById[id]),
)

// TODO clear up selector || render conditions, there are likely redundancies
const allProjectsSelector = createSelector(
  getIsFetchingAll,
  getIsAllFetched,
  getYear,
  (isFetchingAll, isAllFetched, year) => isFetchingAll || (isAllFetched && !year),
)

const TableDataProvider = props => {
  const dispatch = useDispatch()
  const { year } = useParams() || {}

  const projectsOfOneYear = useSelector(state => singleYearSelector(state, year))
  const allProjects = useSelector(state => allProjectsSelector(state, year))

  const isAllFetched = useSelector(state => state.projects.isAllFetched)
  const allById = useSelector(state => state.projects.byId)

  useEffect(() => {
    /* If the url is '/akce', then fetch all projects year after year.
    TODO: add check if there are't some already to save bandwidth.
    The 'else if' clause is not optimal, but it prevent the execution
    of both conditions. I want to avoid return statement, because
    it has special meaning inside useEffect function. */
    if (year === undefined) {
      if (!isAllFetched) dispatch(fetchAllProjects())
    } else if (!projectsOfOneYear.length) {
      dispatch(fetchProjectsOfOneYear(year))
    }
  }, [year])

  /*
  TODO Handle better case where year has no projects (it doesn't break anything – the error is caught
  and the result is blank table, which is not bad, but a message would be better.)
  */
  if (allProjects) {
    return isAllFetched ? <BaseTable rawData={Object.values(allById)} {...props} /> : "Loading…"
  }
  return projectsOfOneYear ? <BaseTable rawData={projectsOfOneYear} {...props} /> : "Loading…"
}

export default TableDataProvider
