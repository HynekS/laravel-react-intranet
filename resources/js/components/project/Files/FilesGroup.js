import React from "react"
import FilesList from "./FilesList"

const ProjectFilesGroup = ({ group, label, detail, ...props }) => {
  return (
    <div>
      <h3>{label}</h3>
      {!!group.length &&
        group.map((item, i) => <FilesList subgroup={item} detail={detail} {...props} key={i} />)}
    </div>
  )
}

export default ProjectFilesGroup
