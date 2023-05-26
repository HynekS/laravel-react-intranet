import { useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { useAppSelector } from "@hooks/useRedux"
import { TrashIcon } from "@heroicons/react/solid"

import pick from "@utils/pick"
import DetailPage from "./DetailPage"
import ResultBadge from "./ResultBadge"
import { Dropdown, DropdownItem } from "../common/Dropdown"
import DetailNav from "./DetailNav"
import DetailRoutes from "./DetailRoutes"
import Modal from "../common/StyledModal"

import type { akce as Akce } from "@codegen"
import ModalCloseButton from "../common/ModalCloseButton"
import ProjectDeleteDialog from "./ProjectDeleteDialog"

const detailFields = [
  "id_akce",
  "nazev_akce",
  "objednavka",
  "objednavka_cislo",
  "objednavka_info",
  "smlouva",
  "rozpocet_B",
  "rozpocet_A",
  "registrovano_bit",
  "registrace_info",
  "id_stav",
  "nalez",
  "investor_jmeno",
  "investor_kontakt",
  "investor_adresa",
  "investor_ico",
  "datum_pocatku_text",
  "datum_pocatku",
  "datum_ukonceni_text",
  "datum_ukonceni",
  "user_id",
  "katastr",
  "okres",
  "kraj",
] as const

const InfoFormProvider = ({ detail }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const userId = useAppSelector(store => store.auth.user!.id)
  const defaultValues = pick(detail, ...detailFields)
  const methods = useForm<Akce>({
    defaultValues,
    mode: "onTouched",
  })

  const { control } = methods

  const projectTitle = useWatch({ control, name: "nazev_akce" })
  const nalez = useWatch({ control, name: "nalez" })

  return (
    <DetailPage>
      <div tw="px-2 flex justify-between md:px-0 ">
        <div tw="flex flex-col py-4 h-full md:(flex-row items-center)">
          <ResultBadge value={nalez} />
          <h1 tw="pt-2 text-xl font-semibold text-gray-700 leading-none md:(py-0)">
            {detail.c_akce}
            &ensp;
            {projectTitle}
          </h1>
        </div>

        <Dropdown tw="my-auto mr-4">
          <DropdownItem
            onClick={() => {
              setIsModalOpen(true)
            }}
            Icon={TrashIcon}
            label="Odstranit&nbsp;akci"
          />
        </Dropdown>
      </div>
      <DetailNav detail={detail} />
      <DetailRoutes detail={detail} methods={methods} />
      <Modal
        isOpen={isModalOpen}
        shouldCloseOnOverlayClick={true}
        onRequestClose={() => setIsModalOpen(false)}
        closeTimeoutMS={500}
      >
        <header tw="flex justify-between p-6">
          <h2 tw="text-lg font-medium">Odstranit akci</h2>
          <ModalCloseButton handleClick={() => setIsModalOpen(false)} />
        </header>
        <ProjectDeleteDialog
          onModalClose={() => setIsModalOpen(false)}
          detail={detail}
          userId={userId}
        />
      </Modal>
    </DetailPage>
  )
}

export default InfoFormProvider
