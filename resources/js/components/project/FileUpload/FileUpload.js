// @ts-check
/** @jsx jsx */
import React, { useState } from "react"
import uuidv4 from "uuid/v4"
import filesize from "filesize.js"
import { jsx, css } from "@emotion/core"
import tw from "twin.macro"

import client from "../../../utils/axiosWithDefaults"
import { ProgressBar } from "../../common/ProgressBar/ProgressBar"
import getFileExtension from "../../../utils/getFileExtension"
import SvgDropFiles from "./DropFiles"
import SvgCheck from "../../../vendor/heroicons/outline/Check"
import getImageOrFallback from "../../../utils/getImageOrFallback"

const getIconUrl = extension => `/images/fileIcons/${extension}.svg`
const fallbackIconUrl = "/images/fileIcons/fallback.svg"

const FileUpload = ({ model, id, fileTypes = "*/*" }) => {
  /* !!! TODO uploads must be higher up the tree to persist closing modal */

  const [uploads, setUploads] = useState([])
  const [isReadingFiles, setIsReadingFiles] = useState(false)
  const [isItemOverDropArea, setIsItemOverDropArea] = useState(false)
  const [progress, setProgress] = useState(0)
  const [response, setResponse] = useState(null)
  const [error, setError] = useState(null)

  const onFormSubmit = e => {
    e.preventDefault()
    if (!uploads.length) return false
    onUpload(uploads)
  }

  const onChange = e => {
    e.preventDefault()
    setIsItemOverDropArea(false)
    // Does it not proceed without drop because of the following lines?
    let files = [...(e.target.files || e.dataTransfer.files)]
    if (!files.length) return

    setIsReadingFiles(true)

    readFiles(files)
      .then(values =>
        Promise.all(
          values.map(item =>
            // TODO this is probably pointless, jst use two background images (extension, fallback)
            getImageOrFallback(getIconUrl(item.extension), fallbackIconUrl).then(result => ({
              ...item,
              icon: result,
            })),
          ),
        ),
      )
      .then(values => {
        // TODO remove duplicates
        setUploads([...uploads, ...values])
        setIsReadingFiles(false)
      })
      // TODO display errors in UI
      .catch(err => console.log(err))
  }

  const readFiles = files => Promise.all(files.map(file => readFile(file)))

  const readFile = file => {
    return new Promise(resolve => {
      let reader = new FileReader()
      reader.onload = e =>
        resolve({
          content: e.target.result,
          name: file.name,
          size: file.size,
          type: file.type,
          extension: getFileExtension(file.name).toLowerCase(),
        })

      reader.readAsDataURL(file)
    })
  }

  const removeFile = index => setUploads(uploads.filter((_, i) => i !== index))

  const onUpload = files => {
    const url = "/upload"
    const formData = new FormData()

    const obj = {
      filesToUpload: [...files],
      model: model,
      id: id,
    }
    formData.append("data", JSON.stringify(obj))

    client
      .post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: e => {
          let progress = (e.loaded / e.total) * 100
          console.log(Math.round(progress))
          setProgress(Math.round(progress))
        },
      })
      .then(res => {
        // TODO !!! notify user of succesful upload !!!
        setResponse(res)
        setUploads([])
      })
      .catch(error => {
        // TODO display error in UI!
        console.log(error)
        setError(error)
      })
  }
  const guid = uuidv4()

  return (
    <div tw="flex flex-1 flex-col h-full">
      {!response ? (
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
            tw`relative z-0 flex flex-grow flex-col justify-center -m-2 p-16 text-center rounded-lg transition transition-all duration-300`,
            isItemOverDropArea && tw`bg-blue-500`,
          ]}
        >
          <div
            css={[
              tw`absolute z--10 border-2 border-gray-400 border-dashed inset-2 rounded-lg pointer-events-none transition-all duration-300`,
              isItemOverDropArea && tw`border-white`,
            ]}
          >
            <span
              css={[
                tw`hidden h-full flex items-center justify-center text-white text-2xl font-medium`,
                isItemOverDropArea && tw`visible border-white`,
              ]}
            >
              přetáhněte soubory z počítače
            </span>
            {progress > 0 && !response && <ProgressBar progress={progress} />}
          </div>
          <form onSubmit={onFormSubmit} tw="pointer-events-none" id={`fileUpload-${guid}`}>
            <div css={[(isItemOverDropArea || isReadingFiles) && tw`invisible`]}>
              <div tw="text-gray-400 text-center pointer-events-none">
                <SvgDropFiles tw="w-24 pb-2 fill-gray-400 inline-block" />
              </div>
              <span tw="block text-lg">přetáhněte soubory</span>
              <span tw="block text-gray-600 pb-4 leading-4"> nebo</span>
              <input
                type="file"
                id={`fileElem-${guid}`}
                multiple
                accept={fileTypes}
                onChange={onChange}
                css={css`
                  ${tw`w-0`}
                  &:focus + label {
                    ${tw`outline-none shadow-outline transition-shadow duration-300`}
                  }
                `}
              />
              <label
                htmlFor={`fileElem-${guid}`}
                css={[
                  tw`inline-block bg-blue-600 mb-4 hover:bg-blue-700 transition-colors duration-300 text-white text-sm py-2 px-4 rounded`,
                  isItemOverDropArea ? tw`pointer-events-none` : tw`pointer-events-auto`,
                ]}
              >
                klikněte pro výběr
              </label>
            </div>
            <span css={[!isReadingFiles && tw`hidden`]}>čtení souborů…</span>
          </form>
        </div>
      ) : // TODO extract at least this to separate component, ie "SuccessMessage"
      // Also make one for error state.
      // Add close callback!!
      response.data.length ? (
        <div tw="flex flex-col items-center justify-center h-full pb-4">
          <div tw="flex pb-4">
            <SvgCheck tw="w-8 stroke-green-400 mr-1" />
            <span tw="font-medium text-gray-600 text-xl">
              Soubory byly v pořádku uloženy na server.
            </span>
          </div>
          <div>
            <button tw="flex items-center bg-blue-600 hover:bg-blue-700 transition-colors duration-300 text-white font-medium py-2 px-4 rounded focus:(outline-none shadow-outline)">
              OK
            </button>
          </div>
        </div>
      ) : null}
      <div>
        <ul tw="flex flex-wrap pt-4">
          {uploads.map((file, i) => (
            <li key={uuidv4()} tw="p-4 overflow-hidden" style={{ flex: "0 1 33.3%" }}>
              <div tw="flex">
                {file.type.includes("image") ? (
                  <div
                    tw="rounded bg-gray-300"
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
                    tw="w-8 p-3 rounded bg-gray-300"
                    style={{
                      minWidth: "4rem",
                    }}
                  >
                    <div
                      style={{
                        backgroundImage: `url(${file.icon})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        height: "100%",
                      }}
                    ></div>
                  </div>
                )}
                <div tw="py-2 pl-2 pr-4 flex-grow">
                  <span
                    tw="block overflow-hidden whitespace-no-wrap text-gray-600 text-sm font-medium"
                    style={{ maxWidth: 960, textOverflow: "ellipsis" }}
                  >
                    {file.name}
                  </span>
                  <span tw="block text-gray-500 text-xs font-medium">{filesize(file.size)}</span>
                  <span onClick={() => removeFile(i)}>Remove</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {uploads.length > 0 && (
        <div tw="flex justify-between items-center">
          <span tw="text-sm font-medium text-gray-700">
            <span tw="text-gray-500">celková velikost:</span>{" "}
            {filesize(uploads.reduce((acc, file) => acc + file.size, 0))}
          </span>
          <button
            form={`fileUpload-${guid}`}
            type="submit"
            tw="flex items-center bg-blue-600 hover:bg-blue-700 transition-colors duration-300 text-white font-medium py-2 px-4 rounded focus:(outline-none shadow-outline)"
          >
            uložit soubory
          </button>
        </div>
      )}
    </div>
  )
}

export default FileUpload
