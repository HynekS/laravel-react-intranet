import React from "react"
import { jsx } from "@emotion/react"
import tw from "twin.macro"

import FilesList from "./FilesList"

import type {
  akce as Akce,
  teren_foto as TerenFoto,
  teren_scan as TerenScan,
  digitalizace_nalez as DigitalizaceNalez,
  digitalizace_plany as DigitalizacePlan,
  geodet_plany as GeodetPlan,
  geodet_body as GeodetBod,
  analyzy as Analyza,
} from "@/types/model"

type FileTable =
  | TerenFoto
  | DigitalizaceNalez
  | DigitalizacePlan
  | GeodetBod
  | GeodetPlan
  | TerenScan
  | Analyza

import type { FileType } from "../../../store/files"

type Props = {
  group: Array<{
    publicName: string
    data: FileTable[]
    model: FileType["model"]
  }>

  detail: Akce
  label: string
}

const FilesListGroup = ({ group, label, detail, ...props }: Props) => {
  return (
    <div tw="pb-8">
      <h3 tw="pb-2 text-xl font-medium">{label}</h3>
      {!!group.length &&
        group.map((item, i) => <FilesList subgroup={item} detail={detail} {...props} key={i} />)}
    </div>
  )
}

export default FilesListGroup
