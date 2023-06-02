import { Fragment } from "react"
import { Dropdown, DropdownItem } from "@components/Dropdown"
import { TrashIcon, PencilIcon } from "@heroicons/react/solid"

import type { faktury as Faktura } from "@codegen"

type Props = {
  invoice: Faktura
  modalOpenCallback: ({ status, data }: { status: string; data: Faktura }) => void
}

const Invoice = ({ invoice, modalOpenCallback }: Props) => {
  // WARNING: TS compiler chokes on fragment shorthand if React is not explicitely imported.
  // https://next--emotion.netlify.app/docs/typescript
  return (
    <Fragment>
      <tr key={invoice.id_zaznam}>
        <td tw="pr-8 py-2 text-right">{invoice.c_faktury}</td>
        <td tw="pr-8 py-2 text-right">
          {new Date(Date.parse(String(invoice.datum_vlozeni))).toLocaleDateString("cs-CZ")}
        </td>
        <td tw="pr-8 py-2 text-right">{Number(invoice.castka).toLocaleString("cs-CZ")},–</td>
        <td tw="pr-8 py-2 text-right">
          <Dropdown>
            <DropdownItem
              onClick={() => modalOpenCallback({ status: "delete", data: invoice })}
              Icon={TrashIcon}
              label="Odstranit"
            />
            <DropdownItem
              onClick={() => modalOpenCallback({ status: "update", data: invoice })}
              Icon={PencilIcon}
              label="Upravit"
            />
          </Dropdown>
        </td>
      </tr>
    </Fragment>
  )
}

export default Invoice
