// @ts-check
/** @jsx jsx */
import React from "react"
import fileDownload from "js-file-download"
import { jsx } from "@emotion/core"
import tw from "twin.macro"

import client from "../../../utils/axiosWithDefaults"
import getFileExtension from "../../../utils/getFileExtension"

const onDownload = path => {
  client.get(`/download/${path}`, {
    responseType: "blob",
  })
    .then(response => {
      fileDownload(response.data, path)
    })
    .catch(error => console.log(error))
}

const File = ({ file }) => {
  const path = file?.file_path
  const icon = path ? String(getFileExtension(path)).toLowerCase() || "fallback" : null
  
  return path ? (
    <div tw="pr-4 pb-4" style={{ flex: "1 1 20rem", width: 0 }}>
      <button
        onClick={() => onDownload(path)}
        tw="flex w-full text-left rounded bg-white bg-opacity-50"
        style={{
          boxShadow: "0 0 8px -2px rgba(5, 10, 29, 0.2)",
          padding: 2,
        }}
      >
        <span tw="p-3 bg-gray-400 rounded">
          <span
            style={{
              display: "block",
              backgroundImage: `url(/images/fileIcons/${icon}.svg)`,
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              cursor: "pointer",
              minWidth: "3rem",
              height: "3rem",
            }}
          ></span>
        </span>
        <span tw="py-1 px-2 pr-4 ">
          <span
            tw="block text-gray-600 text-sm font-medium overflow-hidden break-all"
            style={{
              msWordBreak: "break-all",
              wordBreak: "break-word",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {path.split("/").pop()}
          </span>
          <span tw="block text-gray-500 text-xs font-medium">
            {new Date(file.vlozeno).toLocaleDateString("cs-CZ")}
          </span>
        </span>
      </button>
    </div>
  ) : null
}

export default File
