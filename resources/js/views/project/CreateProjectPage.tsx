import React from "react"
import ProjectPage from "./ProjectPage"
import { useForm, useWatch } from "react-hook-form"

import type { akce as Akce } from "@codegen"

import ResultBadge from "./ResultBadge"

const Detail = React.lazy(() => import(/* webpackChunkName: 'Detail' */ "./info/Info"))

const CreateProject = () => {
  const methods = useForm<Akce>({
    // If set to number it does not work ¯\_(ツ)_/¯
    defaultValues: { nalez: "2" },
    mode: "onTouched",
  })

  const { control } = methods

  const projectTitle = useWatch({ control, name: "nazev_akce" })
  const nalez = useWatch({ control, name: "nalez" })

  return (
    <ProjectPage>
      <div tw="inline-flex items-center justify-start py-4">
        <ResultBadge value={nalez} />
        <h1 tw="py-0 text-xl font-semibold text-gray-700 leading-none after:(content['\200B'] invisible)">
          {projectTitle ? projectTitle : <span tw="opacity-50">(Nová akce)</span>}
        </h1>
      </div>
      <Detail type="create" methods={methods} />
    </ProjectPage>
  )
}

export default CreateProject
