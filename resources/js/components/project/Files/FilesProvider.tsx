import fileDownload from "js-file-download"

import client from "../../../utils/axiosWithDefaults"
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
      <button
        tw="text-white bg-red-500"
        onClick={() => {
          const fileName = `Soubory_k_akci_${
            detail
              ? `${detail.c_akce}_${detail.nazev_akce?.split(" ").slice(0, 5).join(" ")}….zip`
              : `.pdf`
          }`

          client
            .get(`/download_all/${detail.id_akce}`, {
              responseType: "blob",
            })
            .then(response => {
              fileDownload(response.data, fileName)
            })
            .catch(error => console.log(error))
        }}
      >
        Stáhnout vše
      </button>
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
