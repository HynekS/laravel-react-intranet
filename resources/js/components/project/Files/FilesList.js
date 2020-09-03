import React, { useState, useEffect } from "react"
import File from "./File"
// import FileUpload from "../FileUpload/FileUpload";
import ReactModal from "react-modal"
import { useModal } from "react-modal-hook"

const FilesList = ({ subgroup, detail, ...props }) => {
  const [showModal, hideModal] = useModal(() => (
    <ReactModal isOpen>
      <p>Modal content</p>
      <button onClick={hideModal}>Hide modal</button>
    </ReactModal>
  ))

  return (
    <div>
      <div>
        <h4>{subgroup.publicName}</h4>
        <div style={{ backgroundColor: "rgb(247, 250, 252)"}}>
          {subgroup.data.length > 0 && subgroup.data.map((file, i) => <File file={file} key={i} />)}
          <button onClick={showModal}>Nahrát soubory</button>
        </div>
      </div>
    </div>
  )
}

export default FilesList
