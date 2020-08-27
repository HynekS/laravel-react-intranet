import React from "react"
import Http from "../../../utils/axiosWithDefaults"
import fileDownload from "js-file-download"
import getFileExtension from "../../../utils/getFileExtension"

const ProjectFilesFile = ({ file }) => {
  const icon = file?.file_path ? getFileExtension(file.file_path) : "fallback"
  return file ? (
    <>
      <button
        style={{
          background: `url(/images/icons/${icon}.svg) top center no-repeat`,
          border: "none",
          cursor: "pointer",
          width: 124,
          MsWordBreak: "break-all",
          wordBreak: "break-word",
        }}
        onClick={() =>
          Http({
            url: `/download/${file.file_path}`,
            responseType: "blob",
          })
            .then(response => {
              fileDownload(response.data, file.file_path)
            })
            .catch(error => console.log(error))
        }
      >
        <span style={{ marginTop: 66 }}>
          {file.file_path}
        </span>
        <span>{new Date(file.vlozeno).toLocaleDateString("cs-CZ")}</span>
      </button>
    </>
  ) : <div>No file</div>
}

export default ProjectFilesFile
