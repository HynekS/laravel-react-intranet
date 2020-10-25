/** @jsx jsx */
import React, { useState, useEffect } from "react"
import { jsx } from "@emotion/core"
import tw from "twin.macro"

import Modal from "../../common/StyledModal"
import ModalCloseButton from "../../common/ModalCloseButton"
import File from "./File"
import FileUpload from "../FileUpload/FileUpload"

const FilesList = ({ subgroup, detail, ...props }) => {
  const { publicName, data, key } = subgroup || {}
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div>
      <div tw="pb-2">
        <div tw="p-4 pt-2 bg-gray-200 rounded">
          <h4 tw="pb-4 text-gray-600 font-semibold">{publicName}</h4>
          <div tw="flex flex-1 flex-wrap">
            {data.length > 0 && data.map((file, i) => <File file={file} key={i} />)}
          </div>
          <div tw="flex-1">
            <button
              tw="text-white text-sm px-2 py-1 bg-blue-600 rounded focus:(outline-none shadow-outline)"
              onClick={() => setIsModalOpen(true)}
            >
              Nahrát soubory
            </button>
          </div>
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
          <header tw="flex justify-between p-6">
            <h2 tw="text-lg font-medium">
              <span tw="text-gray-500">nahrát soubory: </span>
              <span>{publicName}</span>
            </h2>
            <ModalCloseButton handleClick={() => setIsModalOpen(false)} />
          </header>
          <FileUpload model={key} id={detail.id_akce} modalCloseCallback={() => setIsModalOpen(false)}/>
        </section>
      </Modal>
    </div>
  )
}

export default FilesList
