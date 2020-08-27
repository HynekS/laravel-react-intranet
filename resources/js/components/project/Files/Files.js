import React from "react"

import where from "../../../utils/where"
import FilesGroup from "./FilesGroup"

const relations = [
  { key: "teren_foto", publicName: "terénní foto", group: "teren" },
  { key: "teren_databaze", publicName: "terénní databáze", group: "teren" },
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

const ProjectRelatedFiles = ({ detail, ...props }) => {
  /*
  TBH, I have a little idea what this function is exactly doing. But in general, it is supposed
  to create groups of related data with meaningful labels (see the 'relations' schema above).
  */
  const withData = relations.map(item =>
    Object.assign({}, item, {
      data: detail[item.key] === null ? [] : [].concat(detail[item.key]),
    }),
  )

  return detail ? (
    <div>
      <FilesGroup
        group={where(withData, { group: "teren" })}
        label="Terén"
        detail={detail}
        {...props}
      />
      <FilesGroup
        group={where(withData, { group: "laborator" })}
        label="Laboratoř"
        detail={detail}
        {...props}
      />
      <FilesGroup
        group={where(withData, { group: "digitalizace" })}
        label="Digitalizace"
        detail={detail}
        {...props}
      />
      <FilesGroup
        group={where(withData, { group: "geodezie" })}
        label="Geodezie"
        detail={detail}
        {...props}
      />
      <FilesGroup
        group={where(withData, { group: "analyzy" })}
        label="Analýzy"
        detail={detail}
        {...props}
      />
    </div>
  ) : (
    <div>No detail!</div>
  )
}

export default ProjectRelatedFiles
