import { useEffect, useMemo } from "react"
import { useParams } from "react-router-dom"
import { shallowEqual } from "react-redux"

import "axios-progress-bar/dist/nprogress.css"
import { useAppSelector, useAppDispatch } from "@hooks/useRedux"
import BaseTable from "./BaseTable"
import { fetchProjectsByYears } from "@store/projects"
import getYearsSince from "@utils/getYearsSince"

const TableDataProvider = (props: { [key: string]: any }) => {
  const { year } = useParams<{ year: string }>()
  const dispatch = useAppDispatch()

  const idsByYear = useAppSelector(store => store.projects.idsByYear, shallowEqual)
  const allById = useAppSelector(state => state.projects.byId, shallowEqual)

  const yearsSince2013 = getYearsSince(2013)

  // An array of projects is being requested (it would contain only one element with the exception when ALL are queried).
  // We can have some already in our store. Let's check it and request only those that are not already cached.
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
        .flatMap(year => idsByYear[year])
        .map(id => allById[id])
        .filter(Boolean),
    [year, requestYears, allById],
  )

  return <BaseTable rawData={result} {...props} />
}

export default TableDataProvider
