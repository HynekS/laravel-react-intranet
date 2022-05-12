import { useState } from "react"
import tw from "twin.macro"

import DetailWrapper from "../DetailWrapper"
import InvoiceList from "./InvoiceList"
import InvoiceCreateForm from "./InvoiceCreateForm"
import InvoiceUpdateForm from "./InvoiceUpdateForm"
import InvoiceDestroyDialog from "./InvoiceDestroyDialog"
import Modal from "../../common/StyledModal"
import ModalCloseButton from "../../common/ModalCloseButton"
import { modalStatus } from "./InvoiceModalStatus"

import { PlusIcon } from "@heroicons/react/outline"

const InvoicePage = ({ detail, ...props }) => {
  const [modalState, setModalState] = useState({ status: modalStatus.CLOSED, data: null })

  const onModalClose = e => {
    e && e.preventDefault()
    setModalState({ status: modalStatus.CLOSED, data: null })
  }

  const Button = tw.button`flex items-center bg-blue-600 hover:bg-blue-700 transition-colors duration-300 text-white font-medium py-2 px-4 rounded focus:(outline-none ring)`

  const {
    faktury_dohled,
    faktury_vyzkum,
    rozpocet_B: rozpocet_dohled,
    rozpocet_A: rozpocet_vyzkum,
  } = detail || {}

  const fakturyDohledSum = faktury_dohled.reduce((acc, item) => acc + item.castka, 0)
  const fakturyVyzkumSum = faktury_vyzkum.reduce((acc, item) => acc + item.castka, 0)

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
                <div tw="pb-4">K této akci nebyly nalezeny žádné faktury.</div>
              )}
            </div>
            {!!rozpocet_dohled && (
              <InvoiceSummary budget={rozpocet_dohled} sum={fakturyDohledSum} label="Dohledy" />
            )}
            {!!rozpocet_vyzkum && (
              <InvoiceSummary budget={rozpocet_vyzkum} sum={fakturyVyzkumSum} label="Výzkum" />
            )}
          </div>
          <Button onClick={() => setModalState({ status: modalStatus.CREATE, data: detail })}>
            <PlusIcon tw="w-5 mr-1" />
            Nová faktura
          </Button>
          <Modal
            isOpen={modalState.status !== modalStatus.CLOSED}
            shouldCloseOnOverlayClick={true}
            onRequestClose={onModalClose}
            closeTimeoutMS={500}
            className=""
            {...props}
          >
            <header tw="flex justify-between p-6">
              <h2 tw="text-lg font-medium">
                {modalState.status === modalStatus.CREATE && "Vytvořit fakturu"}
                {modalState.status === modalStatus.UPDATE && "Upravit fakturu"}
                {modalState.status === modalStatus.DESTROY && "Odstranit fakturu"}
              </h2>
              <ModalCloseButton handleClick={onModalClose} />
            </header>
            {modalState.status === modalStatus.CREATE && (
              <InvoiceCreateForm modalState={modalState} onModalClose={onModalClose} />
            )}
            {modalState.status === modalStatus.UPDATE && (
              <InvoiceUpdateForm modalState={modalState} onModalClose={onModalClose} />
            )}
            {modalState.status === modalStatus.DESTROY && (
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

const InvoiceSummary = ({ budget, sum, label }) => (
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
