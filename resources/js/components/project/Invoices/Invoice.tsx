// @ts-check
/** @jsx jsx */
import React, { Fragment, useState } from "react"
import { jsx, css } from "@emotion/core"
import tw from "twin.macro"

import { modalStatus } from "./InvoiceModalStatus"
import useOuterClick from "../../../hooks/useOuterClick"
import SvgTrashSolid from "../../../vendor/heroicons/solid/Trash"
import SvgPencilSolid from "../../../vendor/heroicons/solid/Pencil"
import SvgDotsHorizontalSolid from "../../../vendor/heroicons/solid/DotsHorizontal"

const Invoice = ({ invoice, modalOpenCallback }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const innerRef = useOuterClick(() => {
    setIsMenuOpen(false)
  })

  return (
    <Fragment>
      <tr key={invoice.id_zaznam}>
        <td tw="text-right px-2 py-2">{invoice.c_faktury}</td>
        <td tw="text-right px-2 py-2">
          {new Date(Date.parse(invoice.datum_vlozeni)).toLocaleDateString("cs-CZ")}
        </td>
        <td tw="text-right px-2 py-2">{invoice.castka.toLocaleString("cs-CZ")},–</td>
        <td tw="text-right px-2 py-2">
          <div ref={innerRef} tw="relative">
            <button tw="flex items-center" onClick={() => setIsMenuOpen(true)}>
              <SvgDotsHorizontalSolid tw="flex w-5 opacity-50" />
            </button>
            <div
              css={[
                tw`absolute top-full left-0 text-sm bg-white shadow invisible rounded z-10`,
                isMenuOpen && tw`visible`,
              ]}
            >
              <button
                tw="flex items-center w-full p-2 pr-4 rounded rounded-b-none focus:(outline-none) hocus:(bg-gray-200) transition-colors duration-300"
                onClick={() => modalOpenCallback({ status: modalStatus.DESTROY, data: invoice })}
              >
                <SvgTrashSolid tw="flex w-5 opacity-50 mr-2" />
                Odstranit
              </button>
              <button
                tw="flex items-center w-full p-2 pr-4 rounded rounded-t-none focus:(outline-none) hocus:(bg-gray-200) transition-colors duration-300"
                onClick={() => modalOpenCallback({ status: modalStatus.UPDATE, data: invoice })}
              >
                <SvgPencilSolid tw="flex w-5 opacity-50 mr-2" />
                Upravit
              </button>
            </div>
          </div>
        </td>
      </tr>
    </Fragment>
  )
}

export default Invoice
