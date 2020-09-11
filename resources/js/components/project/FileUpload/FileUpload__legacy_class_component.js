/** @jsx jsx */
import React, { Component } from "react"
import uuidv4 from "uuid/v4"
import { jsx } from "@emotion/core"
import tw from "twin.macro"

import client from "../../../utils/axiosWithDefaults"
import { ProgressBar } from "../../common/ProgressBar/ProgressBar"
import getFileExtension from "../../../utils/getFileExtension"
import SvgUpload from "../../../vendor/heroicons/outline/Upload"
import { emptyUploadImageBase64String } from "./empty-upload-folder"

class FileUpload extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // props defaults
      fileTypes: props.fileTypes || "*/*",
      fallbackIconUrl: "/images/fileIcons/fallback.svg",
      // components state
      uploads: [],
      uploading: false,
      progress: 0,
      fileCount: 0,
    }
  }

  onFormSubmit = e => {
    e.preventDefault()
    if (!this.state.uploads.length) return false
    this.fileUpload(this.state.uploads)
  }

  onChange = e => {
    e.preventDefault()
    let files = [...(e.target.files || e.dataTransfer.files)]
    if (!files.length) return
    this.setState({
      fileCount: files.length,
      uploading: true,
    })
    this.readFiles(files)
      .then(values => this.checkIcons(values))
      .then(values => {
        this.setState(prevState => ({
          uploads: [...prevState.uploads, ...values],
          uploading: false,
        }))
      })
      .catch(err => console.log(err))
  }

  readFiles = items => Promise.all(items.map(file => this.readFile(file)))

  readFile = file => {
    return new Promise(resolve => {
      let reader = new FileReader()
      reader.onload = e => {
        this.setState({
          progress: this.state.progress + 100 / this.state.fileCount,
        })
        resolve({
          content: e.target.result,
          name: file.name,
          extension: getFileExtension(file.name).toLowerCase(),
        })
      }
      reader.readAsDataURL(file)
    })
  }

  checkIcons = items =>
    Promise.all(
      items.map(item => {
        const url = `/images/fileIcons/${item.extension}.svg`
        return this.getImageOrFallback(url, this.state.fallbackIconUrl).then(result => {
          return { ...item, icon: result }
        })
      }),
    )

  getImageOrFallback = (path, fallback) => {
    return new Promise(resolve => {
      const img = new Image()
      img.src = path
      img.onload = () => resolve(path)
      img.onerror = () => resolve(fallback)
    })
  }

  removeFile = index => {
    this.setState({
      uploads: this.state.uploads.filter((_, i) => i !== index),
    })
  }

  fileUpload = files => {
    const url = "/upload"
    const formData = new FormData()

    const obj = {
      filesToUpload: [...files],
      model: this.props.model,
      id: this.props.id,
    }
    formData.append("data", JSON.stringify(obj))

    client
      .post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(_ => {
        this.setState({
          uploads: [],
          fileCount: 0,
          progress: 0,
        })
      })
      .catch(error => {
        // TODO display error in UI!
        console.log(error)
      })
  }

  render() {
    const { uploads, uploading } = this.state
    const guid = uuidv4()
    return (
      <section>
        <div
          onDragEnter={this.onChange}
          onDragEnd={this.onChange}
          onDragOver={this.onChange}
          onDrop={this.onChange}
          tw="border-2 border-gray-400 border-dashed rounded-lg p-8 text-center"
        >
          <div tw="text-gray-400 text-center">
            <SvgUpload tw="w-16 stroke-current inline-block" />
          </div>
          <form onSubmit={this.onFormSubmit}>
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
                    <span onClick={() => this.removeFile(i)}>Remove</span>
                  </li>
                ))}
              </ul>
            )}
            <input
              type="file"
              id={`fileElem-${guid}`}
              multiple
              accept={this.state.fileTypes}
              onChange={this.onChange}
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
            {uploading && <ProgressBar percentage={this.state.progress} />}
          </form>
        </div>
        <div style={{ backgroundImage: emptyUploadImageBase64String, backgroundRepeat: "no-repeat", backgroundPosition: "50% 50%" , height: 150 }}></div>
      </section>
    )
  }
}

export default FileUpload
