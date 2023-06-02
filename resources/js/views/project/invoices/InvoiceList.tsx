import Invoice from "./Invoice"

import type { faktury as Faktura } from "@codegen"

type Props = {
  invoices: Faktura[]
  label: string
  modalOpenCallback: ({ status, data }: { status: string; data: Faktura }) => void
}

const InvoiceList = ({ invoices, label, modalOpenCallback }: Props) => {
  return (
    <div tw="relative pt-4 pb-8 md:pt-0 md:pr-8">
      <h2 tw="mb-4 text-lg font-medium text-gray-400">Faktury {label}</h2>
      <table>
        <thead>
          <tr>
            <th tw="pr-8 font-medium text-right">číslo faktury</th>
            <th tw="pr-8 font-medium text-right">vloženo</th>
            <th tw="pr-8 font-medium text-right">částka</th>
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
            <td colSpan={2} tw="pr-8 text-right align-baseline">
              {label} fakturováno celkem
            </td>
            <td tw="py-2 pr-8 font-medium text-right align-baseline">
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
