import { useSelector, useDispatch } from "react-redux"
import fileDownload from "js-file-download"

import { deleteFile } from "../../../store/files"
import client from "../../../utils/axiosWithDefaults"
import getFileExtension from "../../../utils/getFileExtension"

import { DownloadIcon } from "@heroicons/react/outline"
import { TrashIcon } from "@heroicons/react/solid"

import { Dropdown, DropdownItem } from "../../common/Dropdown"

import type { AppState } from "../../../store/rootReducer"
import type {
  teren_foto as TerenFoto,
  teren_scan as TerenScan,
  digitalizace_nalez as DigitalizaceNalez,
  digitalizace_plany as DigitalizacePlan,
  geodet_plany as GeodetPlan,
  geodet_body as GeodetBod,
  analyzy as Analyza,
} from "@/types/model"
import type { FileType } from "../../../store/files"

type FileTable =
  | TerenFoto
  | DigitalizaceNalez
  | DigitalizacePlan
  | GeodetBod
  | GeodetPlan
  | TerenScan
  | Analyza

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

type FileProps = FileType & {
  file: FileTable
}

const File = ({ file, model, projectId, fileId }: FileProps) => {
  const { id: userId } = useSelector((store: AppState) => store.auth.user)
  const dispatch = useDispatch()

  const path = file?.file_path
  const icon = path ? String(getFileExtension(path)).toLowerCase() || "fallback" : null

  return path ? (
    <div tw="pb-4 pr-4 w-1/2 md:(w-1/3) lg:(w-1/4)">
      <div
        tw="flex justify-between w-full p-1.5 bg-white bg-opacity-50 rounded"
        style={{
          boxShadow: "0 0 8px -2px rgba(5, 10, 29, 0.2)",
        }}
      >
        <button onClick={() => onDownload(path)} title="uložit" tw="flex flex-1">
          <span
            tw="block w-[4em] h-[4em] bg-gray-300 rounded bg-no-repeat background-size[2.5em 2.5em] bg-center self-start flex-shrink-0	"
            style={{
              backgroundImage: `url(/images/fileIcons/${icon}.svg), url(/images/fileIcons/fallback.svg)`,
            }}
          />
          <span tw="px-3 pt-1 pb-2 pr-4 text-left">
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
            <span tw="block text-xs font-medium text-gray-400">
              {new Date(file.vlozeno).toLocaleDateString("cs-CZ")}
            </span>
          </span>
        </button>
        <Dropdown>
          <DropdownItem
            onClick={() => dispatch(deleteFile({ model, projectId, fileId, userId }))}
            Icon={TrashIcon}
            label="Odstranit"
          />
          <DropdownItem onClick={() => onDownload(path)} Icon={DownloadIcon} label="uložit" />
        </Dropdown>
      </div>
    </div>
  ) : null
}

export default File
