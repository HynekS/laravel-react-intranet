/** @jsx jsx */
import React, { useState, useEffect } from "react"
import { jsx } from "@emotion/core"
import tw from "twin.macro"

import Modal from "../../common/StyledModal"
import File from "./File"
import FileUpload from "../FileUpload/FileUpload"
import SvgX from "../../../vendor/heroicons/outline/X"

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
        <section tw="flex flex-1 flex-col h-full">
          <header tw="flex justify-between pb-4">
            <h2 tw="text-lg font-bold">
              <span tw="text-gray-500">nahrát soubory: </span>
              <span>{publicName}</span>
            </h2>
            <button onClick={() => setIsModalOpen(false)}>
              <SvgX tw="w-6" />
            </button>
          </header>
          <FileUpload model={key} id={detail.id_akce} />
        </section>
      </Modal>
    </div>
  )
}

export default FilesList
