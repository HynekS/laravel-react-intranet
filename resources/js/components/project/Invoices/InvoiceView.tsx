import { useState } from "react"
import Button from "../../common/Button"
import DetailWrapper from "../DetailWrapper"
import InvoiceList from "./InvoiceList"
import InvoiceCreateForm from "./InvoiceCreateForm"
import InvoiceUpdateForm from "./InvoiceUpdateForm"
import InvoiceDestroyDialog from "./InvoiceDestroyDialog"
import Modal from "../../common/StyledModal"
import ModalCloseButton from "../../common/ModalCloseButton"

import { PlusIcon } from "@heroicons/react/outline"

import type { akce as Akce, faktury as Faktura } from "@/types/model"

type Props = {
  detail: Akce & {
    faktury_dohled: Faktura[]
    faktury_vyzkum: Faktura[]
  }
}

type SummaryProps = {
  budget: number
  sum: number
  label: string
}

export type ModalState = {
  status: "closed" | "create" | "update" | "delete"
  data: Props["detail"] | null
}

const InvoicePage = ({ detail, ...props }: Props) => {
  const [modalState, setModalState] = useState<ModalState>({
    status: "closed",
    data: null,
  })

  const onModalClose = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e && e.preventDefault()
    setModalState({ status: "closed", data: null })
  }

  const {
    faktury_dohled,
    faktury_vyzkum,
    rozpocet_B: rozpocet_dohled,
    rozpocet_A: rozpocet_vyzkum,
  } = detail || {}

  const fakturyDohledSum = faktury_dohled.reduce((acc, item) => acc + Number(item.castka), 0)
  const fakturyVyzkumSum = faktury_vyzkum.reduce((acc, item) => acc + Number(item.castka), 0)

  return (
    <DetailWrapper>
      {detail ? (
        <div>
          <div tw="flex flex-wrap">
            <div style={{ flex: "0 0 62%" /* 62 is approximately 100/golden ratio */ }}>
              {!!faktury_dohled.length && (
                <InvoiceList
                  invoices={faktury_dohled}
                  label="dohledy"
                  modalOpenCallback={setModalState}
                />
              )}
              {!!faktury_vyzkum.length && (
                <InvoiceList
                  invoices={faktury_vyzkum}
                  label="výzkum"
                  modalOpenCallback={setModalState}
                />
              )}
              {faktury_dohled.length + faktury_vyzkum.length === 0 && (
                <div tw="pb-4">K této akci nebyly zatím vystaveny žádné faktury.</div>
              )}
            </div>
            {!!rozpocet_dohled && (
              <InvoiceSummary budget={rozpocet_dohled} sum={fakturyDohledSum} label="Dohledy" />
            )}
            {!!rozpocet_vyzkum && (
              <InvoiceSummary budget={rozpocet_vyzkum} sum={fakturyVyzkumSum} label="Výzkum" />
            )}
          </div>
          <Button onClick={() => setModalState({ status: "create", data: detail })}>
            <PlusIcon tw="w-5 mr-1" />
            Nová faktura
          </Button>
          <Modal
            isOpen={modalState.status !== "closed"}
            shouldCloseOnOverlayClick={true}
            onRequestClose={onModalClose}
            closeTimeoutMS={500}
            {...props}
          >
            <header tw="flex justify-between p-6">
              <h2 tw="text-lg font-medium">
                {modalState.status === "create" && "Vytvořit fakturu"}
                {modalState.status === "update" && "Upravit fakturu"}
                {modalState.status === "delete" && "Odstranit fakturu"}
              </h2>
              <ModalCloseButton handleClick={onModalClose} />
            </header>
            {modalState.status === "create" && (
              <InvoiceCreateForm modalState={modalState} onModalClose={onModalClose} />
            )}
            {modalState.status === "update" && (
              <InvoiceUpdateForm modalState={modalState} onModalClose={onModalClose} />
            )}
            {modalState.status === "delete" && (
              <InvoiceDestroyDialog modalState={modalState} onModalClose={onModalClose} />
            )}
          </Modal>
        </div>
      ) : (
        <div>Loading…</div>
      )}
    </DetailWrapper>
  )
}

const InvoiceSummary = ({ budget, sum, label }: SummaryProps) => (
  <div tw="p-4">
    <div key={label} tw="p-8 font-medium text-gray-600 rounded-lg shadow">
      <dl>
        <h3 tw="pb-4 text-lg font-medium text-gray-700">{label}</h3>
        <div tw="flex justify-between">
          <dt tw="pr-4 text-gray-500">rozpočet: </dt>
          <dd>{budget.toLocaleString("cs-CZ")},–</dd>
        </div>
        <div tw="flex justify-between border-b">
          <dt tw="pr-4 text-gray-500">fakturováno: </dt>
          <dd>{sum.toLocaleString("cs-CZ")},–</dd>
        </div>
        <div tw="flex justify-between pt-2">
          <dt tw="pr-4 text-gray-600">zbývá: </dt>
          <dd>{(budget - sum).toLocaleString("cs-CZ")},–</dd>
        </div>
      </dl>
    </div>
  </div>
)

export default InvoicePage
