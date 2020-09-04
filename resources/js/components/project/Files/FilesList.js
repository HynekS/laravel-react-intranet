import React, { useState, useEffect } from "react"

import Modal from "../../common/StyledModal"
import File from "./File"
import FileUpload from "../FileUpload/FileUpload"



const FilesList = ({ subgroup, detail, ...props }) => {
  const { publicName, data, key } = subgroup || {}
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div>
      <div>
        <h4>{publicName}</h4>
        <div style={{ backgroundColor: "rgb(247, 250, 252)" }}>
          {data.length > 0 && data.map((file, i) => <File file={file} key={i} />)}
          <button onClick={() => setIsModalOpen(true)}>Nahrát soubory</button>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        shouldCloseOnOverlayClick={true}
        onRequestClose={() => setIsModalOpen(false)}
        closeTimeoutMS={500}
        {...props}
      >
        <section>
          <h2>Nahrát soubory: {publicName}</h2>
          <button onClick={() => setIsModalOpen(false)}>×</button>
          <FileUpload model={key} id={detail.id_akce} />
          <button onClick={() => setIsModalOpen(false)}>Hide modal</button>
        </section>
      </Modal>
    </div>
  )
}

export default FilesList
