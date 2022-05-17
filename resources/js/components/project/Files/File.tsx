import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import fileDownload from "js-file-download"
import tw from "twin.macro"

import useOuterClick from "../../../hooks/useOuterClick"

import { deleteFile } from "../../../store/files"
import client from "../../../utils/axiosWithDefaults"
import getFileExtension from "../../../utils/getFileExtension"

import { DotsHorizontalIcon, DownloadIcon } from "@heroicons/react/outline"
import { TrashIcon } from "@heroicons/react/solid"

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

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const innerRef = useOuterClick<HTMLDivElement>(() => {
    setIsMenuOpen(false)
  })

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
        <div ref={innerRef} tw="relative px-2 height[max-content]  self-start">
          <button tw="flex items-center pl-2" onClick={() => setIsMenuOpen(true)}>
            <DotsHorizontalIcon tw="flex w-5 h-6 opacity-50" />
          </button>
          <div
            css={[
              tw`text-gray-500 absolute right-0 z-10 invisible text-sm bg-white rounded shadow-lg top-full /*before:(absolute bottom-full right-2.5 w-3 h-3 border-transparent border-8 border-b-white)*/`,
              isMenuOpen && tw`visible`,
            ]}
          >
            <div tw=" h-5 w-5 absolute bottom-full right-2 overflow-hidden after:(absolute h-2.5 w-2.5 rotate-45 bg-white shadow-md left-1/2 top-1/2 translate-y-1/2 translate-x--1/2)" />
            <button
              tw="font-medium flex items-center w-full p-2 pr-4 rounded first-of-type:(rounded-b-none) last-of-type:(rounded-t-none) focus:(outline-none) hocus:(bg-gray-200 text-gray-900) transition-colors duration-300"
              onClick={() => dispatch(deleteFile({ model, projectId, fileId, userId }))}
            >
              <TrashIcon tw="flex w-5 mr-2 opacity-50" />
              Odstranit
            </button>
            <button
              tw="font-medium flex items-center w-full p-2 pr-4 rounded first-of-type:(rounded-b-none) last-of-type:(rounded-t-none) focus:(outline-none) hocus:(bg-gray-200 text-gray-900) transition-colors duration-300"
              onClick={() => onDownload(path)}
            >
              <DownloadIcon tw="flex w-5 mr-2 opacity-50" />
              Uložit
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null
}

export default File
