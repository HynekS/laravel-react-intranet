import React from "react"
import { jsx } from "@emotion/react"
import tw from "twin.macro"

import FilesList from "./FilesList"

const FilesListGroup = ({ group, label, detail, ...props }) => {
  return (
    <div tw="pb-8">
      <h3 tw="pb-2 text-xl font-medium">{label}</h3>
      {!!group.length &&
        group.map((item, i) => <FilesList subgroup={item} detail={detail} {...props} key={i} />)}
    </div>
  )
}

export default FilesListGroup
