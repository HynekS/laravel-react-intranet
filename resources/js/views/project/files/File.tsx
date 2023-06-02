import fileDownload from "js-file-download"

import { useAppSelector, useAppDispatch } from "@hooks/useRedux"
import { deleteFile } from "@store/files"
import client from "@services/http/client"
import getFileExtension from "@utils/getFileExtension"

import { DownloadIcon } from "@heroicons/react/outline"
import { TrashIcon } from "@heroicons/react/solid"
import { DotsHorizontalIcon } from "@heroicons/react/solid"

import { Dropdown, DropdownItem } from "@components/Dropdown"
import SecuredImage from "@components/SecuredImage"
import triggerToast from "@components/Toast"

import type {
  teren_foto as TerenFoto,
  teren_scan as TerenScan,
  digitalizace_nalez as DigitalizaceNalez,
  digitalizace_plany as DigitalizacePlan,
  geodet_plany as GeodetPlan,
  geodet_body as GeodetBod,
  analyzy as Analyza,
} from "@codegen"
import type { FileType } from "@store/files"

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
    .catch(error => {
      triggerToast({ type: "error", message: error?.message || "Ajaj! Něco se pokazilo…" })
    })
}

type FileProps = FileType & {
  file: FileTable
}

const File = ({ file, model, projectId, fileId }: FileProps) => {
  const { id: userId } = useAppSelector(store => store.auth.user!)
  const dispatch = useAppDispatch()

  const path = file?.file_path

  const filename = String(path).substring(String(path).lastIndexOf("/") + 1)
  const folders = String(path).replace(filename, "")

  const icon = path ? String(getFileExtension(path)).toLowerCase() : "fallback"

  return path ? (
    <div tw="pb-3 pr-3 w-1/2 md:(w-1/3) lg:(w-1/4)">
      <div tw="flex justify-between w-full p-1.5 bg-white border border-opacity-75 rounded /*box-shadow[0 0 8px -2px rgba(5, 10, 29, 0.2)]*/">
        <button
          onClick={() => onDownload(path)}
          title={`uložit soubor ${path.split("/").pop()}`}
          tw="flex max-w-[80%]"
        >
          {["jpg", "jpeg", "png", "svg"].includes(getFileExtension(path).toLowerCase()) ? (
            <span tw="block w-[3em] h-[3em] min-w-[3em] bg-gray-200 rounded self-start flex-shrink-0 overflow-hidden">
              <SecuredImage
                path={`${folders}/thumbnails/thumbnail_${decodeURI(filename)}`}
                alt="thumbnail"
                tw="rounded object-cover w-[4em] h-[4em]"
              />
            </span>
          ) : (
            <span
              tw="block w-[3em] h-[3em] min-w-[3em] rounded bg-no-repeat background-size[2.5em 2.5em] bg-center self-start flex-shrink-0"
              style={{
                backgroundImage: `url(/images/fileIcons/${icon}.svg), url(/images/fileIcons/fallback.svg)`,
              }}
            />
          )}
          <span tw="flex flex-col justify-between px-3 pt-1 pb-2 pr-4 text-left">
            <div tw="flex">
              <span tw="block text-sm font-medium text-gray-600 break-all leading-none pb-1 truncate max-w-[24ch]">
                {String(path.split("/").pop()).split(".").shift()}
              </span>
              <span tw="pb-1 text-sm font-medium leading-none text-gray-600">
                .{String(path.split("/").pop()).split(".").pop()}
              </span>
            </div>
            <span tw="block text-xs font-medium text-gray-400">
              {new Date(file.vlozeno).toLocaleDateString("cs-CZ")}
            </span>
          </span>
        </button>
        <Dropdown button={() => <DotsHorizontalIcon tw="flex w-5 h-5 px-1 opacity-50" />}>
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
