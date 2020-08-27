import React from "react"

const dict = {
  rozpocet_A: "faktury_vyzkum",
  rozpocet_B: "faktury_dohled",
}

const budgetCellRenderer = ({ row, key }) => {
  // const { invoice_sum } = row
  const budget = row[key]
  //const sum = invoice_sum[dict[key]]
  const sum = row[dict[key]].reduce((acc, item) => acc + item.castka, 0)

  if (budget && sum === 0) {
    return <div style={{ width: "inherit", textAlign: "right" }}>{budget.toLocaleString("cs-CZ")}</div>
  } else if (budget && sum) {
    return (
      <div style={{ width: "inherit", textAlign: "right" }}>
        <div style={{ display: "inline-block" }}>
          <div>{budget.toLocaleString("cs-CZ")}</div>
          <div style={{ borderBottom: "1px solid #ddd", lineHeight: 1.3 }}>
            -{sum.toLocaleString("cs-CZ")}
          </div>
          <div
            style={{
              paddingTop: 3,
              paddingBottom: 3,
              fontWeight: 500,
            }}
          >
            {(budget - sum).toLocaleString("cs-CZ")}
          </div>
        </div>
      </div>
    )
  } else {
    return null
  }
}

export default budgetCellRenderer
