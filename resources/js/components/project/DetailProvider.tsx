import { useState, useEffect } from "react"
import { useParams, useLocation } from "react-router-dom"
import { useAppSelector, useAppDispatch } from "@hooks/useRedux"
import { ExclamationCircleIcon } from "@heroicons/react/outline"

import { fetchProject } from "@store/projects"
import DetailRoutes from "./DetailRoutes"
import DetailNav from "./DetailNav"
import DetailPage from "./DetailPage"

import type { akce as Akce } from "@codegen"

type Params = {
  year: string | undefined
  num: string | undefined
}

const DetailProvider = () => {
  const [data, setData] = useState()
  const dispatch = useAppDispatch()

  const { state } = useLocation()
  const params = useParams<Params>()

  // Using state from spreadsheet view link – old way, probably redundant, but maybe faster?
  const projectFromLinkState = useAppSelector(
    store => state && store.projects.byId[(state as Akce)["id_akce"]],
  )
  // When accessing detail directly from url or after refreshing browser
  const projectFromUrl = useAppSelector(store =>
    Object.values<Akce>(store.projects.byId).find(
      needle => needle.c_akce === `${params.num}/${params?.year?.slice(2)}`,
    ),
  )

  const error = useAppSelector(store => store.projects.getSingle.error)

  useEffect(() => {
    if (projectFromLinkState || projectFromUrl) {
      setData(projectFromLinkState || projectFromUrl)
    } else {
      dispatch(fetchProject({ year: params.year, id: params.num }))
    }
  }, [params, projectFromLinkState, projectFromUrl])

  if (data) {
    return (
      <DetailPage>
        <DetailNav detail={data} />
        <DetailRoutes detail={data}></DetailRoutes>
      </DetailPage>
    )
  }
  if (error) {
    return (
      <DetailPage>
        <div tw="flex items-center justify-center h-full">
          <ExclamationCircleIcon tw="w-6 h-6 mr-3" />
          <span>{error.message}</span>
        </div>
      </DetailPage>
    )
  }
  return (
    <DetailPage>
      <div tw="flex items-center justify-center h-full">
        <span>Načítání…</span>
      </div>
    </DetailPage>
  )
}

export default DetailProvider
