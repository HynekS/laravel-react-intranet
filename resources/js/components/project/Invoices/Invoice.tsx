import { Fragment, useState } from "react"
import tw from "twin.macro"

import { modalStatus } from "./InvoiceModalStatus"
import useOuterClick from "../../../hooks/useOuterClick"
import { TrashIcon } from "@heroicons/react/solid"
import { PencilIcon } from "@heroicons/react/solid"
import { DotsHorizontalIcon } from "@heroicons/react/solid"

import type { faktury as InvoiceT } from "@/types/model"

type Props = {
  invoice: InvoiceT
  modalOpenCallback: ({ status, data }: { status: string; data: InvoiceT }) => void
}

const Invoice = ({ invoice, modalOpenCallback }: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const innerRef = useOuterClick<HTMLDivElement>(() => {
    setIsMenuOpen(false)
  })

  return (
    <Fragment>
      <tr key={invoice.id_zaznam}>
        <td tw="px-2 py-2 text-right">{invoice.c_faktury}</td>
        <td tw="px-2 py-2 text-right">
          {new Date(Date.parse(String(invoice.datum_vlozeni))).toLocaleDateString("cs-CZ")}
        </td>
        <td tw="px-2 py-2 text-right">{Number(invoice.castka).toLocaleString("cs-CZ")},–</td>
        <td tw="px-2 py-2 text-right">
          <div ref={innerRef} tw="relative">
            <button tw="flex items-center" onClick={() => setIsMenuOpen(true)}>
              <DotsHorizontalIcon tw="flex w-5 opacity-50" />
            </button>
            <div
              css={[
                tw`absolute left-0 z-10 invisible text-sm bg-white rounded shadow top-full`,
                isMenuOpen && tw`visible`,
              ]}
            >
              <button
                tw="flex items-center w-full p-2 pr-4 rounded rounded-b-none focus:(outline-none) hocus:(bg-gray-200) transition-colors duration-300"
                onClick={() => modalOpenCallback({ status: modalStatus.DESTROY, data: invoice })}
              >
                <TrashIcon tw="flex w-5 mr-2 opacity-50" />
                Odstranit
              </button>
              <button
                tw="flex items-center w-full p-2 pr-4 rounded rounded-t-none focus:(outline-none) hocus:(bg-gray-200) transition-colors duration-300"
                onClick={() => modalOpenCallback({ status: modalStatus.UPDATE, data: invoice })}
              >
                <PencilIcon tw="flex w-5 mr-2 opacity-50" />
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
