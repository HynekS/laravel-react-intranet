// @ts-check
/** @jsx jsx */
import React, { useState } from "react"
import uuidv4 from "uuid/v4"
import filesize from "filesize.js"
import { jsx } from "@emotion/core"
import tw, { css } from "twin.macro"

import client from "../../../utils/axiosWithDefaults"
// import { ProgressBar } from "../../common/ProgressBar/ProgressBar"
import getFileExtension from "../../../utils/getFileExtension"
import SvgDropFiles from "./DropFiles"
import getImageOrFallback from "../../../utils/getImageOrFallback"

const getIconUrl = extension => `/images/fileIcons/${extension}.svg`
const fallbackIconUrl = "/images/fileIcons/fallback.svg"

const FileUpload = ({ model, id, fileTypes = "*/*" }) => {
  const [uploads, setUploads] = useState([])
  const [, setIsReadingFiles] = useState(false)
  const [isItemOverDropArea, setIsItemOverDropArea] = useState(false)
  // const [isUploading, setIsUploading] = useState(false) // TODO uploading, not reading – separately for every upload

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
      })
      .then(_ => {
        // TODO !!! notify user of succesful upload !!!
        setUploads([])
      })
      .catch(error => {
        // TODO display error in UI!
        console.log(error)
      })
  }
  const guid = uuidv4()
  return (
    <div tw="flex flex-1 flex-col h-full">
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
          tw`relative z-0 flex flex-grow flex-col justify-center -m-2 p-8 text-center rounded-lg transition transition-all duration-300`,
          isItemOverDropArea && tw`bg-blue-500`,
        ]}
      >
        <div
          css={[
            tw`absolute z--10 border-2 border-gray-400 border-dashed inset-2 rounded-lg pointer-events-none transition-all duration-300`,
            isItemOverDropArea && tw`border-white`,
          ]}
        ></div>
        <form onSubmit={onFormSubmit} tw="pointer-events-none">
          <input
            type="file"
            id={`fileElem-${guid}`}
            multiple
            accept={fileTypes}
            onChange={onChange}
            tw="hidden"
          />
          {
            /*uploads.length === 0 && (*/
            <div css={[isItemOverDropArea && tw`invisible`]}>
              <div tw="text-gray-400 text-center pointer-events-none">
                <SvgDropFiles tw="w-24 pb-2 fill-gray-400 inline-block" />
              </div>
              <span tw="block text-lg">přetáhněte soubory</span>
              <span tw="block text-gray-600 pb-4 leading-4"> nebo</span>
              <label
                htmlFor={`fileElem-${guid}`}
                css={[
                  tw`inline-block bg-blue-600 mb-4 hover:bg-blue-700 transition-colors duration-300 text-white text-sm py-2 px-4 rounded focus:(outline-none shadow-outline transition-shadow duration-300)`,
                  isItemOverDropArea ? tw`pointer-events-none` : tw`pointer-events-auto`,
                ]}
              >
                klikněte pro výběr
              </label>
            </div>
            /* )} */
          }
        </form>
      </div>
      <div>
        <ul tw="flex flex-wrap pt-4">
          {uploads.map(item => (
            <li key={uuidv4()} tw="p-4 overflow-hidden" style={{ flex: "0 1 33.3%" }}>
              <div tw="flex">
                <div
                  tw="w-8"
                  style={{
                    backgroundImage: `url(${item.icon})`,
                    backgroundRepeat: "no-repeat",
                    minWidth: "3rem",
                  }}
                ></div>
                <div>
                  <span
                    tw="block overflow-hidden whitespace-no-wrap"
                    style={{ maxWidth: 960, textOverflow: "ellipsis" }}
                  >
                    {item.name}
                  </span>
                  <span tw="block">{filesize(item.size)}</span>
                  {/*<span onClick={() => removeFile(i)}>Remove</span>*/}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <span>celková velikost:</span>
      {/*uploads.length > 0*/ true && (
        <button
          type="submit"
          tw="flex self-end items-center bg-blue-600 hover:bg-blue-700 transition-colors duration-300 text-white font-medium py-2 px-4 rounded focus:(outline-none shadow-outline)"
        >
          uložit soubory
        </button>
      )}
    </div>
  )
}

export default FileUpload
