import React from "react"

const InvoicePage = ({ detail }) => {
  const { faktury_dohled, faktury_vyzkum } = detail || {}
  return detail ? (
    <div>
      {!!faktury_dohled.length && <Invoices invoices={faktury_dohled} title="Faktury dohled" />}
      {!!faktury_vyzkum.length && <Invoices invoices={faktury_vyzkum} title="Faktury výzkum" />}
      {faktury_dohled.length + faktury_vyzkum.length === 0 && (
        <div>K této akci nebyly nalezeny žádné faktury.</div>
      )}
    </div>
  ) : (
    <div>Loading…</div>
  )
}

const Invoices = ({ invoices, title }) => (
  <div>
    <h2>{title}</h2>
    <table>
      <thead>
        <tr>
          <th>číslo faktury</th>
          <th>vloženo</th>
          <th>částka</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {invoices.map(item => (
          <tr key={item.id_zaznam}>
            <td>{item.c_faktury}</td>
            <td>{new Date(Date.parse(item.datum_vlozeni)).toLocaleDateString("cs-CZ")}</td>
            <td>{item.castka.toLocaleString("cs-CZ")},–</td>
            <td>
              <button>Odstranit</button>
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td />
          <td>dohledy fakturováno celkem</td>
          <td>
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
