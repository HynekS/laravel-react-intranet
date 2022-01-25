import { useState } from "react"
import uuidv4 from "uuid/v4"
import filesize from "filesize.js"
import { css } from "@emotion/react"
import tw from "twin.macro"
import { useSelector, useDispatch } from "react-redux"

import {
  batchReadFiles,
  uploadMultipleFiles,
  removeFileFromUploads,
  setInitialState,
  filesStatus,
} from "../../../store/upload"
import { ProgressBar } from "../../common/ProgressBar/ProgressBar"
import SvgDropIcon from "./DropIcon"
import SvgCheck from "../../../vendor/heroicons/outline/Check"

import type { AppState } from "../../../store/rootReducer"

const FileUpload = ({ model, projectId, fileTypes = "*/*", isSingular, modalCloseCallback }) => {
  const [isItemOverDropArea, setIsItemOverDropArea] = useState(false)

  const dispatch = useDispatch()
  // const response = useSelector(store => store.files.response)
  const { id: userId } = useSelector((store: AppState) => store.auth.user)

  const filesToUpload = useSelector((store: AppState) => store.upload.filesToUpload)
  const status = useSelector((store: AppState) => store.upload.status)
  const uploadProgress = useSelector((store: AppState) =>
    store.upload.uploadProgress.reduce(
      (acc: number, val: number, _: number, self: number[]) => (acc + val) / self.length,
      0,
    ),
  )

  const onFormSubmit = e => {
    e.preventDefault()
    if (!filesToUpload.length) return false
    dispatch(uploadMultipleFiles({ filesToUpload, model, projectId, userId }))
  }

  const onChange = e => {
    e.preventDefault()
    setIsItemOverDropArea(false)
    let files = isSingular
      ? [...(e.target.files || e.dataTransfer.files)].slice(-1)
      : [...(e.target.files || e.dataTransfer.files)]
    if (!files.length) return

    dispatch(batchReadFiles(files))
  }

  return (
    <div tw="flex flex-col flex-1 h-full">
      {status !== filesStatus.UPLOADING && status !== filesStatus.UPLOADING_DONE && (
        <div tw="px-5 pb-5">
          <div
            onDrop={onChange}
            onDragEnd={onChange}
            onDragEnter={() => {
              setIsItemOverDropArea(true)
            }}
            onDragOver={e => {
              e.preventDefault()
            }}
            onDragLeave={() => setIsItemOverDropArea(false)}
            css={[
              tw`relative z-0 flex flex-col justify-center flex-grow p-16 -m-2 text-center transition-all transition duration-300 rounded-lg`,
              isItemOverDropArea && tw`bg-blue-500`,
            ]}
          >
            <div
              css={[
                tw`absolute transition-all duration-300 border-2 border-gray-400 border-dashed rounded-lg pointer-events-none z--10 inset-2`,
                isItemOverDropArea && tw`border-white`,
              ]}
            >
              <span
                css={[
                  tw`flex items-center justify-center h-full text-2xl font-medium text-white`,
                  isItemOverDropArea ? tw`visible border-white` : tw`invisible`,
                ]}
              >
                přetáhněte soubor{!isSingular && "y"} z počítače
              </span>
            </div>
            <form onSubmit={onFormSubmit} tw="pointer-events-none" id={`fileUpload-${model}`}>
              <div css={[isItemOverDropArea && tw`invisible`]}>
                <div tw="text-center text-gray-400 pointer-events-none">
                  <SvgDropIcon tw="inline-block w-24 pb-2 fill-gray-400" />
                </div>
                <span tw="block text-lg">přetáhněte soubor{!isSingular && "y"}</span>
                <span tw="block pb-4 leading-4 text-gray-600"> nebo</span>
                <input
                  type="file"
                  id={`fileElem-${model}`}
                  multiple={!isSingular}
                  accept={fileTypes}
                  onChange={onChange}
                  css={css`
                    ${tw`w-0 opacity-0`}
                    &:focus + label {
                      ${tw`transition-shadow duration-300 outline-none ring`}
                    }
                  `}
                />
                <label
                  htmlFor={`fileElem-${model}`}
                  css={[
                    tw`inline-block px-4 py-2 mb-4 text-sm text-white transition-colors duration-300 bg-blue-600 rounded hover:bg-blue-700`,
                    isItemOverDropArea ? tw`pointer-events-none` : tw`pointer-events-auto`,
                  ]}
                >
                  klikněte pro výběr
                </label>
              </div>
              <span css={[status !== filesStatus.READING && tw`hidden`]}>čtení souborů…</span>
            </form>
          </div>
        </div>
      )}
      {status === filesStatus.UPLOADING && (
        <div tw="p-4">
          <div tw="p-2 text-xl font-medium text-center">
            <span>nahrávání: {Math.round(uploadProgress)} %</span>
          </div>
          <ProgressBar progress={uploadProgress} />
        </div>
      )}
      {status === filesStatus.UPLOADING_DONE && (
        <div tw="flex flex-col items-center justify-center h-full pb-4">
          <div tw="flex pb-4">
            <SvgCheck tw="w-8 mr-1 stroke-green-400" />
            <span tw="text-xl font-medium text-gray-600">
              Soubory byly v pořádku uloženy na server.
            </span>
          </div>
          <div>
            <button
              tw="flex items-center bg-blue-600 hover:bg-blue-700 transition-colors duration-300 text-white font-medium py-2 px-4 rounded focus:(outline-none ring)"
              onClick={() => {
                modalCloseCallback()
                dispatch(setInitialState())
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
      {[filesStatus.READING, filesStatus.READING_DONE].includes(status) && (
        <div>
          <ul tw="flex flex-wrap pt-4">
            {filesToUpload.map((file, i) => (
              <li key={uuidv4()} tw="p-4 overflow-hidden" style={{ flex: "0 1 33.3%" }}>
                <div tw="flex">
                  {file.type.includes("image") ? (
                    <div
                      tw="bg-gray-300 rounded"
                      style={{
                        backgroundImage: `url(${file.content})`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "contain",
                        backgroundPosition: "center",
                        minWidth: "4rem",
                      }}
                    ></div>
                  ) : (
                    <div
                      tw="w-8 p-3 bg-gray-300 rounded"
                      style={{
                        minWidth: "4rem",
                      }}
                    >
                      <div
                        style={{
                          backgroundImage: `url(/images/fileIcons/${file.extension}.svg), url(/images/fileIcons/fallback.svg)`,
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "center",
                          height: "100%",
                        }}
                      ></div>
                    </div>
                  )}
                  <div tw="flex-grow py-2 pl-2 pr-4">
                    <span
                      tw="block overflow-hidden text-sm font-medium text-gray-600 whitespace-nowrap"
                      style={{ maxWidth: 960, textOverflow: "ellipsis" }}
                    >
                      {file.name}
                    </span>
                    <span tw="block text-xs font-medium text-gray-500">{filesize(file.size)}</span>
                    <span onClick={() => dispatch(removeFileFromUploads(i))}>× odstranit</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {filesToUpload.length > 0 && status !== filesStatus.UPLOADING && (
        <footer tw="flex p-6 bg-gray-100 rounded-lg rounded-t-none">
          <div tw="flex items-center justify-between w-full">
            <span tw="text-sm font-medium text-gray-700">
              <span tw="text-gray-500">celková velikost:</span>{" "}
              {filesize(filesToUpload.reduce((acc, file) => acc + file.size, 0))}
            </span>
            <div tw="flex">
              <button
                tw="text-gray-500 font-medium py-2 px-4 ml-4 rounded transition-colors duration-300 hover:(text-gray-600) focus:(outline-none ring transition-shadow duration-300)"
                onClick={() => {
                  dispatch(setInitialState())
                  modalCloseCallback()
                }}
              >
                zrušit
              </button>
              <button
                form={`fileUpload-${model}`}
                type="submit"
                tw="flex items-center bg-blue-600 hover:bg-blue-700 transition-colors duration-300 text-white font-medium py-2 px-4 ml-4 rounded focus:(outline-none ring)"
              >
                uložit soubory
              </button>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}

export default FileUpload
