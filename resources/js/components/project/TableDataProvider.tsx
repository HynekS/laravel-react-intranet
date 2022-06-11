import { useEffect, useMemo } from "react"
import { useParams } from "react-router-dom"
import { shallowEqual } from "react-redux"

import "axios-progress-bar/dist/nprogress.css"
import { useAppSelector, useAppDispatch } from "@hooks/useRedux"
import BaseTable from "./BaseTable"
import { yearsSince2013, fetchProjectsByYears } from "@store/projects"

const TableDataProvider = (props: unknown) => {
  const { year } = useParams<{ year: string }>()
  const dispatch = useAppDispatch()

  const idsByYear = useAppSelector(store => store.projects.idsByYear, shallowEqual)
  const allById = useAppSelector(state => state.projects.byId, shallowEqual)

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
