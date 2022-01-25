import fileDownload from "js-file-download"
import { useSelector, useDispatch } from "react-redux"

import { deleteFile } from "../../../store/files"
import client from "../../../utils/axiosWithDefaults"
import getFileExtension from "../../../utils/getFileExtension"

import type { AppState } from "../../../store/rootReducer"
import type {
  analyzy,
  digitalizace_nalez,
  digitalizace_plany,
  geodet_body,
  geodet_plany,
  kresleni_foto,
  teren_foto,
  teren_negativni_foto,
  teren_scan,
} from "../../../types/model"
import type { TFile } from "../../../store/files"

type TFileTable =
  | analyzy
  | digitalizace_nalez
  | digitalizace_plany
  | geodet_body
  | geodet_plany
  | kresleni_foto
  | teren_foto
  | teren_negativni_foto
  | teren_scan

const onDownload = (path: string) => {
  client
    .get(`/download/${path}`, {
      responseType: "blob",
    })
    .then(response => {
      fileDownload(response.data, path)
    })
    .catch(error => console.log(error))
}

type TFileProps = TFile & {
  file: TFileTable
  // Maybe shoud be narrowed to a set of upload tables? But how?
}

const File = ({ file, model, projectId, fileId }: TFileProps) => {
  const { id: userId } = useSelector((store: AppState) => store.auth.user)
  const dispatch = useDispatch()

  const path = file?.file_path
  const icon = path ? String(getFileExtension(path)).toLowerCase() || "fallback" : null

  return path ? (
    <div tw="pb-4 pr-4" style={{ flex: "1 1 20rem", width: 0 }}>
      <button onClick={() => dispatch(deleteFile({ model, projectId, fileId, userId }))}>
        Delete
      </button>
      <button
        onClick={() => onDownload(path)}
        tw="flex w-full text-left bg-white bg-opacity-50 rounded"
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
        <span tw="px-2 py-1 pr-4 ">
          <span
            tw="block overflow-hidden text-sm font-medium text-gray-600 break-all"
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
          <span tw="block text-xs font-medium text-gray-500">
            {new Date(file.vlozeno).toLocaleDateString("cs-CZ")}
          </span>
        </span>
      </button>
    </div>
  ) : null
}

export default File
