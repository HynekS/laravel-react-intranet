import React from "react"
import fileDownload from "js-file-download"

import Http from "../../../utils/axiosWithDefaults"
import getFileExtension from "../../../utils/getFileExtension"

/* This is a quick bugfix, but there is still missing the date and owner of the file – need to fix it way above */
/* UPDATE: should remove, dead code now. All inputs should be objects. */
const getFilePath = input => {
  if (input instanceof Object && input.file_path) {
    return input.file_path
  }
  if (typeof input === "string") {
    return input
  }
  return null
}

const File = ({ file }) => {
  const path = getFilePath(file)
  console.log(path)
  // const icon = file?.file_path ? String(getFileExtension(file.file_path)).toLowerCase() : "fallback"
  const icon = path ? String(getFileExtension(path)).toLowerCase() || "fallback" : null
  return path ? (
    <div style={{ padding: "1rem", display: "inline-block" }}>
      <button
        style={{ width: 50 }}
        onClick={() =>
          Http.get(`/download/${path}`, {
            responseType: "blob",
          })
            .then(response => {
              console.log(response)
              fileDownload(response.data, path)
            })
            .catch(error => console.log(error))
        }
      >
        <span
          style={{
            display: "block",
            background: `url(/images/fileIcons/${icon}.svg) top center no-repeat`,
            border: "none",
            cursor: "pointer",
            padding: "1rem",
            width: 50,
            height: 40,
            backgroundSize: "contain",
            backgroundPosition: "50% 0",
          }}
        ></span>

        <span
          style={{
            display: "block",
            height: "3rem",
            lineHeight: 1,
            MsWordBreak: "break-all",
            wordBreak: "break-word",
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
        >
          <small>{path}</small>
        </span>
        <span>
          <small>{new Date(file.vlozeno).toLocaleDateString("cs-CZ")}</small>
        </span>
      </button>
    </div>
  ) : (
    <div>No file</div>
  )
}

export default File
