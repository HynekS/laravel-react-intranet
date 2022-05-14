import Invoice from "./Invoice"

import type { faktury as Faktura } from "@/types/model"

type Props = {
  invoices: Faktura[]
  label: string
  modalOpenCallback: ({ status, data }: { status: string; data: Faktura }) => void
}

const InvoiceList = ({ invoices, label, modalOpenCallback }: Props) => {
  return (
    <div tw="relative pb-8 pr-8">
      <h2>Faktury {label}</h2>
      <table>
        <thead>
          <tr>
            <th tw="px-2 text-right">číslo faktury</th>
            <th tw="px-2 text-right">vloženo</th>
            <th tw="px-2 text-right">částka</th>
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
            <td />
            <td>{label} fakturováno celkem</td>
            <td tw="px-2 py-2 text-right">
              <strong>
                {invoices
                  .reduce((acc, item) => acc + Number(item.castka), 0)
                  .toLocaleString("cs-CZ")}
                ,–
              </strong>
            </td>
            <td />
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

export default InvoiceList
