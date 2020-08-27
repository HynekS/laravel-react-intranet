import React, { Component } from "react";


import Http from "../../../utils/axiosWithDefaults";
import uuidv4 from "uuid/v4";

import { ProgressBar } from "../../common/ProgressBar/ProgressBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons/faUpload";

import getFileExtension from "../../../utils/helpers/getFileExtension";

class FileUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // props defaults
      fileTypes: props.fileTypes || "*/*",
      fallbackIconUrl: "./icons/fallback.svg",
      // components state
      uploads: [],
      uploading: false,
      progress: 0,
      fileCount: 0
    };
  }

  onFormSubmit = e => {
    e.preventDefault();
    if (!this.state.uploads.length) return false;
    this.fileUpload(this.state.uploads);
  };

  onChange = e => {
    e.preventDefault();
    let files = [...(e.target.files || e.dataTransfer.files)];
    if (!files.length) return;
    this.setState({
      fileCount: files.length,
      uploading: true
    });
    this.readFiles(files)
      .then(values => this.checkIcons(values))
      .then(values => {
        this.setState(prevState => ({
          uploads: [...prevState.uploads, ...values],
          uploading: false
        }));
      })
      .catch(err => console.log(err));
  };

  readFiles = items => Promise.all(items.map(file => this.readFile(file)));

  readFile = file => {
    return new Promise(resolve => {
      let reader = new FileReader();
      reader.onload = e => {
        this.setState({
          progress: this.state.progress + 100 / this.state.fileCount
        });
        resolve({
          content: e.target.result,
          name: file.name,
          extension: getExtension(file.name).toLowerCase()
        });
      };
      reader.readAsDataURL(file);
    });
  };

  getExtension = filename =>
    filename.substring(filename.lastIndexOf(".") + 1, filename.length) ||
    filename;

  checkIcons = items =>
    Promise.all(
      items.map(item => {
        const url = `./icons/${item.extension}.svg`;
        return this.getImageOrFallback(url, this.state.fallbackIconUrl).then(result => {
          return { ...item, icon: result };
        });
      })
    );

  getImageOrFallback = (path, fallback) => {
    return new Promise(resolve => {
      const img = new Image();
      img.src = path;
      img.onload = () => resolve(path);
      img.onerror = () => resolve(fallback);
    });
  };

  removeFile = index => {
    this.setState({
      uploads: this.state.uploads.filter((_, i) => i !== index)
    });
  };

  fileUpload = files => {
    const url = "/upload";
    const formData = new FormData();

    const obj = {
      filesToUpload: [...files],
      model: this.props.model,
      id: this.props.id
    };
    formData.append("data", JSON.stringify(obj));

    Http.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
      .then(success => {
        this.setState({
          uploads: [],
          fileCount: 0,
          progress: 0
        });
        console.log(success);
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    const { uploads, uploading } = this.state;
    const guid = uuidv4();
    return (
      <div
        style={{
          padding: "50px",
          backgroundColor: "CornflowerBlue"
        }}
        onDragEnter={this.onChange}
        onDragEnd={this.onChange}
        onDragOver={this.onChange}
        onDrop={this.onChange}
      >
        <form onSubmit={this.onFormSubmit}>
          {uploads.length > 0 && (
            <ul
              style={{
                alignItems: "center",
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap"
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
                    width: `${100 / uploads.length}%`
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
              display: "none"
            }}
          />
          {uploads.length === 0 && (
            <label className="title is-6" htmlFor={`fileElem-${guid}`}>
              přetáhněte soubory nebo klikněte pro výběr
            </label>
          )}
          {uploads.length > 0 && (
            <button type="submit">
              uložit soubory
              <FontAwesomeIcon icon={faUpload} size="xs" />
            </button>
          )}
          {uploading && <ProgressBar percentage={this.state.progress} />}
        </form>
      </div>
    );
  }
}

export default FileUpload;
