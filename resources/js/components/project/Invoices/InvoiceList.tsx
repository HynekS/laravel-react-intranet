import React from "react"
import { jsx, css } from "@emotion/react"
import tw from "twin.macro"

import Invoice from "./Invoice"

const InvoiceList = ({ invoices, label, modalOpenCallback }) => {
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
                {invoices.reduce((acc, item) => acc + item.castka, 0).toLocaleString("cs-CZ")},–
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
