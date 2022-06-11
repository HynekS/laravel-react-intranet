import { useState } from "react"

import { deleteInvoice } from "../../../store/invoices"
import { status } from "../../../store/projects"

import { ExclamationIcon } from "@heroicons/react/outline"

import type { AppState } from "../../../store/rootReducer"
import type { faktury as Faktura } from "@/types/model"

type Props = {
  modalState: {
    data: Faktura
  }
  onModalClose: React.MouseEventHandler<HTMLButtonElement>
}

const InvoiceDestroyDialog = ({ modalState: { data }, onModalClose }: Props) => {
  const [isPending, setIsPending] = useState(false)
  const dispatch = useAppDispatch()

  const { id_zaznam: invoiceId, akce_id: projectId, typ_castky, c_faktury = "", castka = "" } = data

  const handleClick = () => {
    setIsPending(true)
    dispatch(deleteInvoice({ invoiceId, projectId, typ_castky }))
      .unwrap()
      .then(() => {
        setIsPending(false)
        onModalClose()
      })
  }

  return (
    <div>
      <div tw="flex items-center p-6">
        <div tw="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full text-red-500 bg-red-100 sm:(mx-0 h-10 w-10)">
          <ExclamationIcon tw="w-6 stroke-current" />
        </div>
        <div tw="px-4">
          Skutečně chcete odstranit fakturu č. {c_faktury} v hodnotě{" "}
          {castka?.toLocaleString("cs-CZ")} Kč?
        </div>
      </div>
      <footer tw="flex justify-end p-6 bg-gray-100 rounded-lg rounded-t-none">
        <button
          tw="text-gray-500 font-medium py-2 px-4 ml-4 rounded transition-colors duration-300 hover:(text-gray-600) focus:(outline-none ring transition-shadow duration-300)"
          onClick={onModalClose}
        >
          Zrušit
        </button>
        <button
          tw="bg-red-600 transition-colors duration-300 text-white font-medium py-2 px-4 ml-4 rounded hover:(bg-red-700) focus:(outline-none ring transition-shadow duration-300)"
          onClick={handleClick}
          className={`${isPending ? "spinner" : ""}`}
          disabled={isPending}
        >
          Odstranit fakturu
        </button>
      </footer>
    </div>
  )
}

export default InvoiceDestroyDialog
