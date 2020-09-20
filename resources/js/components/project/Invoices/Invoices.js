// @ts-check
/** @jsx jsx */
import React from "react"
import { jsx } from "@emotion/core"
import tw from "twin.macro"

import DetailWrapper from "../DetailWrapper"
import SvgTrash from "../../../vendor/heroicons/outline/Trash"
import SvgPlus from "../../../vendor/heroicons/outline/Plus"

const InvoicePage = ({ detail }) => {
  const Button = tw.button`flex items-center bg-blue-500 hover:bg-blue-700 transition-colors duration-300 text-white font-bold py-2 px-4 rounded focus:(outline-none shadow-outline)`

  const {
    faktury_dohled,
    faktury_vyzkum,
    rozpocet_B: rozpocet_dohled,
    rozpocet_A: rozpocet_vyzkum,
  } = detail || {}

  const fakturyDohledSum = faktury_dohled.reduce((acc, item) => acc + item.castka, 0)
  const fakturyVyzkumSum = faktury_vyzkum.reduce((acc, item) => acc + item.castka, 0)

  return (
    <DetailWrapper>
      {detail ? (
        <div>
          <div tw="flex flex-wrap">
            <div style={{ flex: "0 0 62%" /* 62 is approximately 100/golden ratio */ }}>
              {!!faktury_dohled.length && <Invoices invoices={faktury_dohled} label="dohledy" />}
              {!!faktury_vyzkum.length && <Invoices invoices={faktury_vyzkum} label="výzkum" />}
              {faktury_dohled.length + faktury_vyzkum.length === 0 && (
                <div tw="pb-4">K této akci nebyly nalezeny žádné faktury.</div>
              )}
            </div>
            {!!rozpocet_dohled && (
              <InvoiceSummary budget={rozpocet_dohled} sum={fakturyDohledSum} label="Dohledy" />
            )}
            {!!rozpocet_vyzkum && (
              <InvoiceSummary budget={rozpocet_vyzkum} sum={fakturyVyzkumSum} label="Výzkum" />
            )}
          </div>
          <Button>
            <SvgPlus tw="w-5 mr-1" />
            Nová faktura
          </Button>
        </div>
      ) : (
        <div>Loading…</div>
      )}
    </DetailWrapper>
  )
}

const InvoiceSummary = ({ budget, sum, label, ...props }) => (
  <div tw="p-4">
    <div key={label} tw="p-8 text-gray-600 font-medium rounded-lg shadow">
      <dl>
        <h3 tw="text-lg text-gray-700 font-medium pb-4">{label}</h3>
        <div tw="flex justify-between">
          <dt tw="text-gray-500 pr-4">rozpočet: </dt>
          <dd>{budget.toLocaleString("cs-CZ")},–</dd>
        </div>
        <div tw="flex justify-between border-b">
          <dt tw="text-gray-500 pr-4">fakturováno: </dt>
          <dd>{sum.toLocaleString("cs-CZ")},–</dd>
        </div>
        <div tw="flex justify-between pt-2">
          <dt tw="text-gray-600 pr-4">zbývá: </dt>
          <dd>{(budget - sum).toLocaleString("cs-CZ")},–</dd>
        </div>
      </dl>
    </div>
  </div>
)

const Invoices = ({ invoices, label }) => (
  <div tw="pb-8 pr-8">
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
        {invoices.map(item => (
          <tr key={item.id_zaznam}>
            <td tw="text-right px-2 py-2">{item.c_faktury}</td>
            <td tw="text-right px-2 py-2">
              {new Date(Date.parse(item.datum_vlozeni)).toLocaleDateString("cs-CZ")}
            </td>
            <td tw="text-right px-2 py-2">{item.castka.toLocaleString("cs-CZ")},–</td>
            <td tw="text-right px-2 py-2">
              <button tw="flex items-center text-right text-xs text-gray-700 hover:(text-red-700 border-red-600 border-opacity-75) border px-2 py-1 rounded">
                <SvgTrash tw="flex w-4 opacity-50 mr-1" />
                Odstranit
              </button>
            </td>
          </tr>
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

export default InvoicePage
