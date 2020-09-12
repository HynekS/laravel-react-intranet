/** @jsx jsx */
import React from "react"
import { jsx } from "@emotion/core"
import tw from "twin.macro"

import FilesList from "./FilesList"

const ProjectFilesGroup = ({ group, label, detail, ...props }) => {
  return (
    <div>
      <h3 tw="font-bold">{label}</h3>
      {!!group.length &&
        group.map((item, i) => <FilesList subgroup={item} detail={detail} {...props} key={i} />)}
    </div>
  )
}

export default ProjectFilesGroup
