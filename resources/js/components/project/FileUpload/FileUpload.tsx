import { FormEvent, useState } from "react"
import { v4 as uuidv4 } from "uuid"
import filesize from "filesize.js"
import { css } from "@emotion/react"
import tw from "twin.macro"

import { useAppSelector, useAppDispatch } from "@hooks/useRedux"
import {
  batchReadFiles,
  uploadMultipleFiles,
  removeFileFromUploads,
  setInitialState,
  FileObject,
} from "@store/upload"
import triggerToast from "../../common/Toast"
import Button from "../../common/Button"
import { ProgressBar } from "../../common/ProgressBar/ProgressBar"
import DropIcon from "./DropIcon"

import type { Model } from "@store/files"

type Props = {
  model: Model
  fileTypes?: string
  projectId: number
  isSingular: boolean
  modalCloseCallback: Function
}

const FileUpload = ({
  model,
  projectId,
  fileTypes = "*/*",
  isSingular,
  modalCloseCallback,
}: Props) => {
  const [isItemOverDropArea, setIsItemOverDropArea] = useState(false)

  const dispatch = useAppDispatch()
  const { id: userId } = useAppSelector(store => store.auth.user)

  const filesToUpload = useAppSelector(store => store.upload.filesToUpload as FileObject[])
  const status = useAppSelector(store => store.upload.status)
  const uploadProgress = useAppSelector(store =>
    (store.upload.uploadProgress as number[]).reduce(
      (acc: number, val: number, _: number, self: number[]) => (acc + val) / self.length,
      0,
    ),
  )

  const onFormSubmit: React.FormEventHandler<HTMLFormElement> = (e: FormEvent) => {
    e.preventDefault()
    if (!filesToUpload.length) return false

    dispatch(uploadMultipleFiles({ filesToUpload, model, projectId, userId }))
      .unwrap()
      .then(() => {
        modalCloseCallback()
        triggerToast({
          type: "success",
          message: "Soubory byly úspěšně uloženy na server",
          options: { duration: 4000 },
        })
      })
      .catch(err => {
        modalCloseCallback()
        triggerToast({
          type: "error",
          message: err.message,
          options: { duration: 4000 },
        })
      })
  }

  const onChange = (e: React.DragEvent<HTMLDivElement> | React.ChangeEvent<HTMLInputElement>) => {
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
      {status !== "uploading" && (
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
              tw`relative z-0 flex flex-col justify-center flex-grow p-16 -m-2 text-center transition-all duration-300 rounded-lg`,
              isItemOverDropArea && tw`bg-blue-500`,
            ]}
          >
            <div
              css={[
                tw`absolute transition-all duration-300 border-2 border-gray-400 border-dashed rounded-lg pointer-events-none -z-10 inset-2`,
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
                  <DropIcon tw="inline-block w-24 pb-2 fill-gray-400" />
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
              <span css={[status !== "reading" && tw`hidden`]}>čtení souborů…</span>
            </form>
          </div>
        </div>
      )}
      {status === "uploading" && (
        <div tw="p-4">
          <div tw="p-2 text-xl font-medium text-center">
            <span>nahrávání: {Math.round(uploadProgress)} %</span>
          </div>
          <ProgressBar progress={uploadProgress} />
        </div>
      )}
      {["reading", "reading_done"].includes(status) && (
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
      {filesToUpload.length > 0 && status !== "uploading" && (
        <footer tw="flex p-6 bg-gray-100 rounded-lg rounded-t-none">
          <div tw="flex items-center justify-between w-full">
            <span tw="text-sm font-medium text-gray-700">
              <span tw="text-gray-500">celková velikost:</span>{" "}
              {filesize(filesToUpload.reduce((acc, file) => acc + file.size, 0))}
            </span>
            <div tw="flex">
              <Button
                onClick={() => {
                  dispatch(setInitialState())
                  modalCloseCallback()
                }}
                tw="text-gray-500 duration-300 bg-transparent mr-4 hocus:(text-gray-600 bg-transparent) focus:(outline-none ring transition-shadow duration-300)"
              >
                zrušit
              </Button>
              <Button form={`fileUpload-${model}`} type="submit">
                uložit soubory
              </Button>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}

export default FileUpload
