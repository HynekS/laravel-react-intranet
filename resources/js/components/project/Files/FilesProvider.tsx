import fileDownload from "js-file-download"

import Button from "../../common/Button"
import client from "@services/http/client"
import where from "../../../utils/where"
import DetailWrapper from "../DetailWrapper"
import FilesListGroup from "./FilesListGroup"

import { DownloadIcon } from "@heroicons/react/outline"

import type {
  akce as Akce,
  teren_foto as TerenFoto,
  teren_scan as TerenScan,
  digitalizace_nalez as DigitalizaceNalez,
  digitalizace_plany as DigitalizacePlan,
  geodet_plany as GeodetPlan,
  geodet_body as GeodetBod,
  analyzy as Analyza,
} from "@codegen"

export type Model =
  | "teren_foto"
  | "teren_databaze"
  | "teren_scan"
  | "LAB_databaze"
  | "digitalizace_nalez"
  | "digitalizace_plan"
  | "geodet_plan"
  | "geodet_bod"
  | "analyza"

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

type Props = {
  detail: Akce & {
    teren_foto: TerenFoto
    teren_scan: TerenScan
    digitalizace_nalez: DigitalizaceNalez
    digitalizace_plan: DigitalizacePlan
    geodet_plan: GeodetPlan
    geodet_bod: GeodetBod
    analyza: Analyza
  }
}

const FilesProvider = ({ detail, ...props }: Props) => {
  const withData = relations.map(item => ({
    ...item,
    data:
      detail[item.model as Model] === null ? [] : ([] as any).concat(detail[item.model as Model]),
  }))

  return detail ? (
    <DetailWrapper>
      <div tw="flex justify-end pb-3">
        <Button
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
          <DownloadIcon tw="w-5 h-5 mr-2 -ml-1" />
          Stáhnout vše
        </Button>
      </div>
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
