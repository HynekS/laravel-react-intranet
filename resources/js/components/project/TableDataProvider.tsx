import React, { useEffect, useMemo } from "react"
import { useParams } from "react-router-dom"
import { useSelector, useDispatch, shallowEqual } from "react-redux"

import BaseTable from "./BaseTable"
import "axios-progress-bar/dist/nprogress.css"
import { yearsSince2013, fetchProjectsByYears } from "../../store/projects"

import type { AppState } from "../../store/rootReducer"

const TableDataProvider = props => {
  const { year } = useParams<{ year: string }>()
  const dispatch = useDispatch()

  const idsByYear = useSelector((store: AppState) => store.projects.idsByYear, shallowEqual)
  const allById = useSelector((state: AppState) => state.projects.byId, shallowEqual)

  useEffect(() => {
    const requestYearsNotFetchedAllready = requestYears.filter(year => !idsByYear[year]?.length)
    if (requestYearsNotFetchedAllready.length) {
      dispatch(fetchProjectsByYears(requestYearsNotFetchedAllready))
    }
  }, [year])

  const requestYears: number[] = year === undefined ? [...yearsSince2013] : [Number(year)]

  const result = useMemo(
    () =>
      requestYears
        /* Replaced .flatMap(year => idsByYear[year]) for better compatibility */
        .reduce((acc, year) => acc.concat(idsByYear[year]), [])
        .map(id => allById[id])
        .filter(Boolean),
    [year, requestYears, allById],
  )

  return <BaseTable rawData={result} {...props} />
}

export default TableDataProvider
