// @ts-check
/** @jsx jsx */
import React, { useState } from "react"
import { jsx } from "@emotion/core"
import tw from "twin.macro"

import DetailWrapper from "../DetailWrapper"
import InvoiceList from "./InvoiceList"
import InvoiceCreateForm from "./InvoiceCreateForm"
import InvoiceUpdateForm from "./InvoiceUpdateForm"
import InvoiceDestroyDialog from "./InvoiceDestroyDialog"
import Modal from "../../common/StyledModal"
import ModalCloseButton from "../../common/ModalCloseButton"
import { modalStatus } from "./InvoiceModalStatus"

import SvgPlus from "../../../vendor/heroicons/outline/Plus"

const InvoicePage = ({ detail, ...props }) => {
  const [modalState, setModalState] = useState({ status: modalStatus.CLOSED, data: null })
  console.log(modalState)

  const Button = tw.button`flex items-center bg-blue-500 hover:bg-blue-700 transition-colors duration-300 text-white font-bold py-2 px-4 rounded focus:(outline-none shadow-outline)`

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
          <Button
            onClick={_ => setModalState({ ...modalState, status: modalStatus.CREATE })}
          >
            <SvgPlus tw="w-5 mr-1" />
            Nová faktura
          </Button>
          <Modal
            isOpen={modalState.status !== modalStatus.CLOSED}
            shouldCloseOnOverlayClick={true}
            onRequestClose={() => setModalState({ ...modalState, status: modalStatus.CLOSED })}
            closeTimeoutMS={500}
            {...props}
          >
            <ModalCloseButton
              handleClick={_ => setModalState({ status: modalStatus.CLOSED, data: null })}
            />
            {modalState.status === modalStatus.CREATE && <InvoiceCreateForm />}
            {modalState.status === modalStatus.UPDATE && <InvoiceUpdateForm />}
            {modalState.status === modalStatus.DESTROY && <InvoiceDestroyDialog />}
          </Modal>
        </div>
      ) : (
        <div>Loading…</div>
      )}
    </DetailWrapper>
  )
}

const InvoiceSummary = ({ budget, sum, label, ...props }) => (
  <div tw="p-4">
    <div key={label} tw="p-8 text-gray-600 font-medium rounded-lg shadow">
      <dl>
        <h3 tw="text-lg text-gray-700 font-medium pb-4">{label}</h3>
        <div tw="flex justify-between">
          <dt tw="text-gray-500 pr-4">rozpočet: </dt>
          <dd>{budget.toLocaleString("cs-CZ")},–</dd>
        </div>
        <div tw="flex justify-between border-b">
          <dt tw="text-gray-500 pr-4">fakturováno: </dt>
          <dd>{sum.toLocaleString("cs-CZ")},–</dd>
        </div>
        <div tw="flex justify-between pt-2">
          <dt tw="text-gray-600 pr-4">zbývá: </dt>
          <dd>{(budget - sum).toLocaleString("cs-CZ")},–</dd>
        </div>
      </dl>
    </div>
  </div>
)

export default InvoicePage
