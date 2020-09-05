import React, { useEffect } from "react"
import { useParams } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { createSelector } from "reselect"

import BaseTable from "./BaseTable"
import "axios-progress-bar/dist/nprogress.css"
import { fetchProjectsOfOneYear } from "../../store/projects"

const getProjectIdsByYear = (state, year) => state.projects.IdsByYear[year]
const getProjectsById = state => state.projects.byId

const test = createSelector(
  getProjectIdsByYear,
  getProjectsById,
  (projectIdsByYear, projectsById) => (projectIdsByYear || []).map(id => projectsById[id]),
)

const TableDataProvider = props => {
  const dispatch = useDispatch()
  const { year } = useParams() || {}

  const projectsOfOneYear = useSelector(state => test(state, year))

  useEffect(() => {
    if (!projectsOfOneYear.length) {
      dispatch(fetchProjectsOfOneYear(year))
    }
  }, [year])

  /*
  const [data, setData] = useState(null)
  let { year } = useParams() || {}

  useEffect(() => {
    let source = client.CancelToken.source()
    async function fetchData() {
      try {
        loadProgressBar({}, client)
        const response = await client.get(`akce/${year == undefined ? `` : year}`, {
          cancelToken: source.token,
        })
        setData(response.data)
      } catch (err) {
        if (client.isCancel(err)) {
          console.log("api request cancelled")
        } else {
          console.log(err)
        }
      }
    }
    fetchData()
    return () => {
      source.cancel()
      loadProgressBar({ progress: false })
    }
  }, [year])
  
  return data ? <BaseTable rawData={data} {...props} /> : "Loading…"
  */
  return projectsOfOneYear ? <BaseTable rawData={projectsOfOneYear} {...props} /> : "Loading…"
}

export default TableDataProvider
