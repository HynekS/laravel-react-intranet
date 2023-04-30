import { useState, memo } from "react"
import { PlusIcon } from "@heroicons/react/solid"

import Modal from "../../common/StyledModal"
import ModalCloseButton from "../../common/ModalCloseButton"
import File from "./File"
import FileUpload from "../FileUpload/FileUpload"

import type {
  akce as Akce,
  teren_foto as TerenFoto,
  teren_scan as TerenScan,
  digitalizace_nalez as DigitalizaceNalez,
  digitalizace_plany as DigitalizacePlan,
  geodet_plany as GeodetPlan,
  geodet_body as GeodetBod,
  analyzy as Analyza,
} from "@codegen"

type FileTable =
  | TerenFoto
  | DigitalizaceNalez
  | DigitalizacePlan
  | GeodetBod
  | GeodetPlan
  | TerenScan
  | Analyza

import type { FileType } from "@store/files"

type Props = {
  detail: Akce
  subgroup: {
    publicName: string
    data: FileTable[]
    model: FileType["model"]
  }
}

const FilesList = memo(({ subgroup, detail, ...props }: Props) => {
  const { publicName, data, model } = subgroup || {}
  const [isModalOpen, setIsModalOpen] = useState(false)

  const isSingular = ["teren_databaze", "LAB_databaze"].includes(model)

  return (
    <div>
      <div tw="pb-2">
        <div tw="p-4 pt-2 border rounded">
          <h4 tw="pb-4 font-semibold text-gray-600">{publicName}</h4>
          <div tw="flex flex-wrap flex-1">
            {data.length > 0 &&
              data.map(file => (
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
              tw="flex items-center justify-center text-blue-700 border-blue-500 text-xs px-2 py-1.5 border border-blue-600 font-medium rounded transition-colors focus:(outline-none ring) min-w-[7.5rem] hover:(border-blue-700 bg-blue-50)"
              onClick={() => setIsModalOpen(true)}
            >
              <PlusIcon tw="w-4 h-4 opacity-75 mr-1" />
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
})

export default FilesList
