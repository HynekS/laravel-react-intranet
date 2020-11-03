import React from "react"

const dict = {
  rozpocet_A: "faktury_vyzkum",
  rozpocet_B: "faktury_dohled",
}

const budgetCellRenderer = ({ row, key }) => {
  const budget = row[key]
  const sum = row[dict[key]].reduce((acc, item) => acc + item.castka, 0)

  if (budget && sum === 0) {
    return <div>{budget.toLocaleString("cs-CZ")}</div>
  } else if (budget && sum) {
    return (
      <div style={{ width: "inherit", textAlign: "right" }}>
        <div style={{ display: "inline-block" }}>
          <div key="budget">{budget.toLocaleString("cs-CZ")}</div>
          <div key="spent" style={{ lineHeight: 1.3, position: "relative" }}>
            <div
              style={{
                position: "absolute",
                height: 1,
                left: 0,
                right: 0,
                top: "100%",
                borderBottom: "1px solid currentcolor",
                opacity: 0.3,
              }}
            ></div>
            -{sum.toLocaleString("cs-CZ")}
          </div>
          <div
            key="remaining"
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
