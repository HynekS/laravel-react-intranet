import React, { useState } from "react"
import DetailPage from "../project/DetailPage"

const Detail = React.lazy(() => import(/* webpackChunkName: 'Detail' */ "../project/Detail"))

const CreateProject = () => {
  const [projectTitle, setProjectTitle] = useState<string>("(Nová akce)")
  return (
    <DetailPage>
      <h1 tw="py-4 text-xl font-semibold text-gray-700 after:(content['\200B'] invisible)">
        {projectTitle}
      </h1>
      <Detail type="create" setProjectTitle={setProjectTitle} />
    </DetailPage>
  )
}

export default CreateProject
