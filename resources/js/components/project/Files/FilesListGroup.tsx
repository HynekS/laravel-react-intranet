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
} from "@codegen"

type FileTable =
  | TerenFoto
  | DigitalizaceNalez
  | DigitalizacePlan
  | GeodetBod
  | GeodetPlan
  | TerenScan
  | Analyza

import type { FileType } from "@store/files"

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
        group.map((subgroup, i) => (
          <FilesList subgroup={subgroup} detail={detail} {...props} key={i} />
        ))}
    </div>
  )
}

export default FilesListGroup
