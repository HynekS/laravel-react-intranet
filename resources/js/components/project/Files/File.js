import React from "react"
import Http from "../../../utils/axiosWithDefaults"
import fileDownload from "js-file-download"
import getFileExtension from "../../../utils/getFileExtension"

const File = ({ file }) => {
  const icon = file?.file_path ? String(getFileExtension(file.file_path)).toLowerCase() : "fallback"
  return file ? (
    <div style={{ padding: "1rem", display: "inline-block" }}>
      <button
        style={{ width: 50 }}
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
          <small>{file.file_path}</small>
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
