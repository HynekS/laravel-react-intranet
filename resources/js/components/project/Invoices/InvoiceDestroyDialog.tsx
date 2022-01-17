//@ts-check
/** @jsx jsx */
import React from "react"
import { jsx, css } from "@emotion/core"
import tw from "twin.macro"
import { useSelector, useDispatch } from "react-redux"

import { deleteInvoice } from "../../../store/invoices"
import { invoiceStatus } from "../../../store/projects"

import SvgExclamation from "../../../vendor/heroicons/outline/Exclamation"

import type { AppState } from "../../../store/rootReducer"

const InvoiceDestroyDialog = ({ modalState: { data }, onModalClose, ...props }) => {
  const dispatch = useDispatch()
  const isLoading = useSelector(
    (store: AppState) => store.projects.invoiceStatus === invoiceStatus.LOADING,
  )
  const { id_zaznam: invoiceId, akce_id: projectId, typ_castky, c_faktury = "", castka = "" } = data

  const handleClick = () => {
    dispatch(deleteInvoice({ invoiceId, projectId, typ_castky }))
  }

  return (
    <div>
      <div tw="flex items-center p-6">
        <div tw="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full text-red-500 bg-red-100 sm:(mx-0 h-10 w-10)">
          <SvgExclamation tw="w-6 stroke-current" />
        </div>
        <div tw="px-4">
          Skutečně chcete odstranit fakturu č. {c_faktury} v hodnotě{" "}
          {castka.toLocaleString("cs-CZ")} Kč?
        </div>
      </div>
      <footer tw="flex justify-end bg-gray-100 p-6 rounded-lg rounded-t-none">
        <button
          tw="text-gray-500 font-medium py-2 px-4 ml-4 rounded transition-colors duration-300 hover:(text-gray-600) focus:(outline-none shadow-outline transition-shadow duration-300)"
          onClick={onModalClose}
        >
          Zrušit
        </button>
        <button
          tw="bg-red-600 transition-colors duration-300 text-white font-medium py-2 px-4 ml-4 rounded hover:(bg-red-700) focus:(outline-none shadow-outline transition-shadow duration-300)"
          onClick={handleClick}
          className={`${isLoading ? "spinner" : ""}`}
        >
          Odstranit fakturu
        </button>
      </footer>
    </div>
  )
}

export default InvoiceDestroyDialog
