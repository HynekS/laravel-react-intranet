/** @jsx jsx */
import React from "react"
import { jsx } from "@emotion/core"
import tw from "twin.macro"

import where from "../../../utils/where"
import DetailWrapper from "../DetailWrapper"
import FilesListGroup from "./FilesListGroup"

const relations = [
  { key: "teren_foto", publicName: "terénní foto", group: "teren" },
  {
    key: "teren_databaze",
    publicName: "terénní databáze",
    group: "teren",
  },
  {
    key: "teren_scan",
    publicName: "scany terénní dokumentace",
    group: "teren",
  },
  {
    key: "LAB_databaze",
    publicName: "databáze z laboratoře",
    group: "laborator",
  },
  {
    key: "digitalizace_nalez",
    publicName: "dokumentace nálezů",
    group: "digitalizace",
  },
  {
    key: "digitalizace_plan",
    publicName: "plánová dokumentace",
    group: "digitalizace",
  },
  { key: "geodet_plan", publicName: "geodetické plány", group: "geodezie" },
  { key: "geodet_bod", publicName: "geodetické souřadnice", group: "geodezie" },
  { key: "analyza", publicName: "odborné analýzy", group: "analyzy" },
]

const FilesProvider = ({ detail, ...props }) => {
  const withData = relations.map(item => ({
    ...item,
    data: detail[item.key] === null ? [] : [].concat(detail[item.key]),
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
