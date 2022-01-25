import React from "react"
import { jsx } from "@emotion/react"
import tw from "twin.macro"

import where from "../../../utils/where"
import DetailWrapper from "../DetailWrapper"
import FilesListGroup from "./FilesListGroup"

const relations = [
  { model: "teren_foto", publicName: "terénní foto", group: "teren" },
  {
    model: "teren_databaze",
    publicName: "terénní databáze",
    group: "teren",
  },
  {
    model: "teren_scan",
    publicName: "scany terénní dokumentace",
    group: "teren",
  },
  {
    model: "LAB_databaze",
    publicName: "databáze z laboratoře",
    group: "laborator",
  },
  {
    model: "digitalizace_nalez",
    publicName: "dokumentace nálezů",
    group: "digitalizace",
  },
  {
    model: "digitalizace_plan",
    publicName: "plánová dokumentace",
    group: "digitalizace",
  },
  { model: "geodet_plan", publicName: "geodetické plány", group: "geodezie" },
  { model: "geodet_bod", publicName: "geodetické souřadnice", group: "geodezie" },
  { model: "analyza", publicName: "odborné analýzy", group: "analyzy" },
]

const FilesProvider = ({ detail, ...props }) => {
  const withData = relations.map(item => ({
    ...item,
    data: detail[item.model] === null ? [] : [].concat(detail[item.model]),
  }))

  return detail ? (
    <DetailWrapper>
      <FilesListGroup
        group={where(withData, { group: "teren" })}
        label="Terén"
        detail={detail}
        {...props}
      />
      <FilesListGroup
        group={where(withData, { group: "laborator" })}
        label="Laboratoř"
        detail={detail}
        {...props}
      />
      <FilesListGroup
        group={where(withData, { group: "digitalizace" })}
        label="Digitalizace"
        detail={detail}
        {...props}
      />
      <FilesListGroup
        group={where(withData, { group: "geodezie" })}
        label="Geodezie"
        detail={detail}
        {...props}
      />
      <FilesListGroup
        group={where(withData, { group: "analyzy" })}
        label="Analýzy"
        detail={detail}
        {...props}
      />
    </DetailWrapper>
  ) : (
    <DetailWrapper>
      <div>No detail!</div>
    </DetailWrapper>
  )
}

export default FilesProvider
