// @ts-check
import React, { useState, useEffect } from "react"
import { useParams, useLocation } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"

import { fetchProject } from "../../store/projects"
import DetailRoutes from "./DetailRoutes"
import DetailNav from "./DetailNav"
import DetailPage from "./DetailPage"

import type { AppState } from "../../store/rootReducer"

interface Params {
  year: string
  num: string
}

const DetailProvider = () => {
  const [data, setData] = useState()
  const dispatch = useDispatch()

  const { state } = useLocation()
  const params: Params = useParams()

  // Using state from spreadsheet view link – old way, probably redundant, but maybe faster?
  const projectFromLinkState = useSelector(
    (store: AppState) => state && store.projects.byId[state["id_akce"]],
  )
  // When accessing detail directly from url or after refreshing browser
  const projectFromUrl = useSelector((store: AppState) =>
    Object.values(store.projects.byId).find(
      needle => needle.c_akce === `${params.num}/${params.year.slice(2)}`,
    ),
  )

  useEffect(() => {
    if (projectFromLinkState || projectFromUrl) {
      setData(projectFromLinkState || projectFromUrl)
    } else {
      dispatch(fetchProject({ year: params.year, id: params.num }))
    }
  }, [params, projectFromLinkState, projectFromUrl])

  return data ? (
    <DetailPage>
      <DetailNav detail={data} />
      <DetailRoutes detail={data}></DetailRoutes>
    </DetailPage>
  ) : (
    <div>Loading data…</div>
  )
}

export default DetailProvider
