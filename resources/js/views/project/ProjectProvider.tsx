import { useState, useEffect } from "react"
import { useParams, useLocation } from "react-router-dom"
import { useAppSelector, useAppDispatch } from "@hooks/useRedux"
import { ExclamationCircleIcon } from "@heroicons/react/outline"

import { fetchProject } from "@store/projects"
import ProjectPage from "./ProjectPage"

import type { akce as Akce } from "@codegen"
import InfoFormProvider from "./InfoFormProvider"

type Params = {
  year: string | undefined
  num: string | undefined
}

const ProjectProvider = () => {
  const [data, setData] = useState<Akce>()
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
    const project = projectFromLinkState || projectFromUrl
    if (project) {
      setData(project as Akce)
    } else {
      dispatch(fetchProject({ year: Number(params.year), id: Number(params.num) }))
    }
  }, [params, projectFromLinkState, projectFromUrl])

  if (data) {
    return <InfoFormProvider detail={data} />
  }
  if (error) {
    return (
      <ProjectPage>
        <div tw="flex items-center justify-center h-full">
          <ExclamationCircleIcon tw="w-6 h-6 mr-3" />
          <span>{error.message}</span>
        </div>
      </ProjectPage>
    )
  }
  return (
    <ProjectPage>
      <div tw="flex items-center justify-center h-full">
        <span>Načítání…</span>
      </div>
    </ProjectPage>
  )
}

export default ProjectProvider
