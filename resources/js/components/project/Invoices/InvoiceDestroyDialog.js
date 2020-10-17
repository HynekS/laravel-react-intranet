/** @jsx jsx */
import React from "react"
import { jsx, css } from "@emotion/core"
import tw from "twin.macro"

import SvgExclamation from "../../../vendor/heroicons/outline/Exclamation"

const InvoiceDestroyDialog = ({ modalState, onModalClose, ...props }) => {
  return (
    <div>
      <div tw="flex items-center p-6">
        <div tw="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full text-red-500 bg-red-100 sm:(mx-0 h-10 w-10)">
          <SvgExclamation tw="w-6 stroke-current" />
        </div>
        <div tw="px-4">Skutečně chcete odstranit fakturu č. XXX?</div>
      </div>
      <footer tw="flex justify-end bg-gray-100 p-6 rounded-lg rounded-t-none">
        <button tw="bg-gray-100 transition-colors duration-300 text-gray-500 font-medium py-2 px-4  ml-4 rounded hover:(bg-gray-300) focus:(outline-none shadow-outline transition-shadow duration-300)"
        onClick={onModalClose}
        >
          Zrušit
        </button>
        <button tw="bg-red-600 transition-colors duration-300 text-white font-medium py-2 px-4 ml-4 rounded hover:(bg-red-700) focus:(outline-none shadow-outline transition-shadow duration-300)">
          Odstranit fakturu
        </button>
      </footer>
    </div>
  )
}

export default InvoiceDestroyDialog
