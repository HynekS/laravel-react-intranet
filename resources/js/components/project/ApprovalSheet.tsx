import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useForm } from "react-hook-form"
import tw from "twin.macro"

import client from "../../utils/axiosWithDefaults"
import DetailWrapper from "./DetailWrapper"
import { DocumentDownloadIcon } from "@heroicons/react/outline"
import Button from "../common/Button"
import Input from "../common/Input"

import { updateProject } from "../../store/projects"

import type { AppState } from "../../store/rootReducer"
import type { akce as Akce } from "../../types/model"

type DetailProps = { detail: Akce & { user: { id: number; full_name: string } } }

const ApprovalSheet = ({ detail }: DetailProps) => {
  const userId = useSelector((store: AppState) => store.auth.user.id)
  const dispatch = useDispatch()
  const { register, control, handleSubmit, setValue, watch, errors } = useForm()
  const { id_akce: id } = detail || {}

  useEffect(() => {
    if (detail) {
      for (let [key, value] of Object.entries(detail)) {
        if (value && ["datum_pocatku", "datum_ukonceni"].includes(key)) {
          setValue(key, new Date(value))
        } else {
          setValue(key, value)
        }
      }
    }
  }, [detail])

  const onSubmit = data => dispatch(updateProject({ id, userId, ...data }))

  return (
    <DetailWrapper>
      <h1>Expertní list</h1>
      <form onSubmit={handleSubmit(onSubmit)} /*ref={formRef}*/>
        <Input name="EL_lokalita" label="lokalita" placeholder="lokalita" register={register} />
        <Input
          name="EL_Termin"
          label="termín kontrol"
          placeholder="termín kontrol"
          register={register}
        />
        <Input name="EL_Forma" label="forma" placeholder="forma" register={register} />

        <Input name="EL_Denik" label="deník" placeholder="deník" register={register} />
        <Input
          name="EL_fotodokumentace"
          label="fotodokumentace"
          placeholder="fotodokumentace"
          register={register}
        />
        <Input
          name="EL_kresebna_a_textova"
          label="kresebná či textová dokumentace"
          placeholder="kresebná či textová dokumentace"
          register={register}
        />
        <Input
          name="EL_Dokumentovane"
          label="dokumentované situace"
          placeholder="dokumentované situace"
          register={register}
        />
        <Input
          name="EL_Movite"
          label="movité nálezy"
          placeholder="dokumentace"
          register={register}
        />
        <Input
          name="EL_ulozeni"
          label="uložení movitých nálezů"
          placeholder="uložení movitých nálezů"
          register={register}
        />
        <Input name="EL_Popis" label="popis" placeholder="popis" register={register} />
        <Input name="EL_datum" label="datum tisku" placeholder="datum tisku" register={register} />
        <Input
          type="checkbox"
          name="EL_hotovo"
          label="údaje pro expertní list jsou vloženy"
          register={register}
        />
      </form>
      <Button
        type="button"
        onClick={async () => {
          client({
            url: `/report/${detail.id_akce}`,
            method: "POST",
            responseType: "blob",
            data: {
              ...detail,
            },
          }).then(response => {
            const url = window.URL.createObjectURL(
              new Blob([response.data], { type: "application/pdf" }),
            )
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", "Examen.pdf")
            link.target = "_blank"
            link.download = `expertni_list_${
              detail
                ? `${detail.c_akce}_${detail.nazev_akce?.split(" ").slice(0, 5).join(" ")}….pdf`
                : `.pdf`
            }`
            link.click()
          })
        }}
      >
        <DocumentDownloadIcon tw="w-5 mr-1" />
        Stáhnout PDF
      </Button>
    </DetailWrapper>
  )
}

export default ApprovalSheet
