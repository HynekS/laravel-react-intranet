import React, { useEffect } from "react"
import { useParams } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"

import BaseTable from "./BaseTable"
import "axios-progress-bar/dist/nprogress.css"

import { yearsSince2013, fetchProjectsByYears } from "../../store/projects"

const TableDataProvider = props => {
  const { year } = useParams()
  const dispatch = useDispatch()

  const idsByYear = useSelector(store => store.projects.idsByYear)
  const allById = useSelector(state => state.projects.byId)

  useEffect(() => {
    const requestYearsNotFetchedAllready = requestYears.filter(year => !idsByYear[year]?.length)
    if (requestYearsNotFetchedAllready.length) {
      dispatch(fetchProjectsByYears(requestYearsNotFetchedAllready))
    }
  }, [year])

  const requestYears = year === undefined ? yearsSince2013 : [year]

  return (
    <BaseTable
      rawData={requestYears
        .flatMap(year => idsByYear[year])
        .map(id => allById[id])
        .filter(Boolean)}
      {...props}
    />
  )
}

export default TableDataProvider
