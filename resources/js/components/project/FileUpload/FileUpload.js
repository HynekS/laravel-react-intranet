// @ts-check
/** @jsx jsx */
import React, { useState } from "react"
import uuidv4 from "uuid/v4"
import { jsx } from "@emotion/core"
import tw from "twin.macro"

import client from "../../../utils/axiosWithDefaults"
// import { ProgressBar } from "../../common/ProgressBar/ProgressBar"
import getFileExtension from "../../../utils/getFileExtension"
import SvgUpload from "../../../vendor/heroicons/outline/Upload"
import { emptyUploadImageBase64String } from "./empty-upload-folder"
import getImageOrFallback from "../../../utils/getImageOrFallback"

const getIconUrl = extension => `/images/fileIcons/${extension}.svg`
const fallbackIconUrl = "/images/fileIcons/fallback.svg"

const FileUpload = ({ model, id, fileTypes = "*/*" }) => {
  const [uploads, setUploads] = useState([])
  const [, setIsReadingFiles] = useState(false)
  // const [isUploading, setIsUploading] = useState(false) // TODO uploading, not reading – separately for every upload

  const onFormSubmit = e => {
    e.preventDefault()
    if (!uploads.length) return false
    onUpload(uploads)
  }

  const onChange = e => {
    e.preventDefault()
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
    <section>
      <div
        onDragEnter={onChange}
        onDragEnd={onChange}
        onDragOver={onChange}
        onDrop={onChange}
        tw="border-2 border-gray-400 border-dashed rounded-lg p-8 text-center"
      >
        <div tw="text-gray-400 text-center">
          <SvgUpload tw="w-16 stroke-current inline-block" />
        </div>
        <form onSubmit={onFormSubmit}>
          {uploads.length > 0 && (
            <ul
              style={{
                alignItems: "center",
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
              }}
            >
              {uploads.map((item, i) => (
                <li
                  key={uuidv4()}
                  style={{
                    backgroundImage: `url(${item.icon})`,
                    backgroundPosition: "50% 0",
                    backgroundRepeat: "no-repeat",
                    color: "white",
                    display: "inline-block",
                    height: "100px",
                    listStyle: "none",
                    paddingTop: "80px",
                    textAlign: "center",
                    width: `${100 / uploads.length}%`,
                  }}
                >
                  {item.name}
                  <span onClick={() => removeFile(i)}>Remove</span>
                </li>
              ))}
            </ul>
          )}
          <input
            type="file"
            id={`fileElem-${guid}`}
            multiple
            accept={fileTypes}
            onChange={onChange}
            style={{
              display: "none",
            }}
          />
          {uploads.length === 0 && (
            <div>
              <span tw="block text-lg">přetáhněte soubory</span>
              <span tw="block text-gray-600 pb-4 leading-4"> nebo</span>
              <label
                htmlFor={`fileElem-${guid}`}
                tw="inline-block bg-blue-600 hover:bg-blue-700 transition-colors duration-300 text-white text-sm py-2 px-4 rounded focus:outline-none focus:shadow-outline focus:transition-shadow focus:duration-300"
              >
                klikněte pro výběr
              </label>
            </div>
          )}
          {uploads.length > 0 && <button type="submit">uložit soubory</button>}
        </form>
      </div>
      <div
        style={{
          backgroundImage: emptyUploadImageBase64String,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "50% 50%",
          height: 150,
        }}
      ></div>
    </section>
  )
}

export default FileUpload
