import { useState } from "react"

import Modal from "../../common/StyledModal"
import ModalCloseButton from "../../common/ModalCloseButton"
import File from "./File"
import FileUpload from "../FileUpload/FileUpload"

const FilesList = ({ subgroup, detail, ...props }) => {
  const { publicName, data, model } = subgroup || {}
  const [isModalOpen, setIsModalOpen] = useState(false)

  const isSingular = ["teren_databaze", "LAB_databaze"].includes(model)

  return (
    <div>
      <div tw="pb-2">
        <div tw="p-4 pt-2 bg-gray-200 rounded">
          <h4 tw="pb-4 font-semibold text-gray-600">{publicName}</h4>
          <div tw="flex flex-wrap flex-1">
            {data.length > 0 &&
              data.map((file, i) => (
                <File
                  file={file}
                  key={file.file_path}
                  model={model}
                  projectId={file.id_akce || detail.id_akce}
                  fileId={file.id}
                />
              ))}
          </div>
          <div tw="flex-1">
            <button
              style={{ minWidth: "7rem" }}
              tw="text-white text-sm px-2 py-1 bg-blue-600 rounded focus:(outline-none ring)"
              onClick={() => setIsModalOpen(true)}
            >
              Nahrát soubor{!isSingular && "y"}
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
        <section tw="flex flex-col flex-1 h-full">
          <header tw="flex justify-between p-6">
            <h2 tw="text-lg font-medium">
              <span tw="text-gray-500">nahrát soubor{!isSingular && "y"}: </span>
              <span>{publicName}</span>
            </h2>
            <ModalCloseButton handleClick={() => setIsModalOpen(false)} />
          </header>
          <FileUpload
            model={model}
            projectId={detail.id_akce}
            isSingular={isSingular}
            modalCloseCallback={() => setIsModalOpen(false)}
          />
        </section>
      </Modal>
    </div>
  )
}

export default FilesList
