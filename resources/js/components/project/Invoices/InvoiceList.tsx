import Invoice from "./Invoice"

import type { faktury as Faktura } from "@/types/model"

type Props = {
  invoices: Faktura[]
  label: string
  modalOpenCallback: ({ status, data }: { status: string; data: Faktura }) => void
}

const InvoiceList = ({ invoices, label, modalOpenCallback }: Props) => {
  return (
    <div tw="relative pb-8 pt-4 md:pt-0 md:pr-8">
      <h2 tw="mb-4 font-medium text-gray-400 text-lg">Faktury {label}</h2>
      <table>
        <thead>
          <tr>
            <th tw="pr-8 text-right font-medium">číslo faktury</th>
            <th tw="pr-8 text-right font-medium">vloženo</th>
            <th tw="pr-8 text-right font-medium">částka</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {invoices.map(invoice => (
            <Invoice
              invoice={invoice}
              key={invoice?.c_faktury}
              modalOpenCallback={modalOpenCallback}
            />
          ))}
        </tbody>
        <tfoot tw="border-t">
          <tr>
            <td colSpan={2} tw="text-right align-baseline pr-8">
              {label} fakturováno celkem
            </td>
            <td tw="pr-8 py-2 text-right align-baseline font-medium">
              {invoices.reduce((acc, item) => acc + Number(item.castka), 0).toLocaleString("cs-CZ")}
              ,–
            </td>
            <td />
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

export default InvoiceList
