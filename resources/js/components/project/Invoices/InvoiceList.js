// @ts-check
/** @jsx jsx */
import React from "react"
import { jsx, css } from "@emotion/core"
import tw from "twin.macro"

import Invoice from "./Invoice"

const InvoiceList = ({ invoices, label, modalOpenCallback }) => {
  return (
    <div tw="pb-8 pr-8 relative">
      <h2>Faktury {label}</h2>
      <table>
        <thead>
          <tr>
            <th tw="text-right px-2">číslo faktury</th>
            <th tw="text-right px-2">vloženo</th>
            <th tw="text-right px-2">částka</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {invoices.map(invoice => (
            <Invoice invoice={invoice} key={invoice?.c_faktury} modalOpenCallback={modalOpenCallback}/>
          ))}
        </tbody>
        <tfoot tw="border-t">
          <tr>
            <td />
            <td>{label} fakturováno celkem</td>
            <td tw="text-right px-2 py-2">
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
