import { useState, useEffect } from "react"
import { useForm, ManualFieldError } from "react-hook-form"
import tw from "twin.macro"
import { DocumentDownloadIcon } from "@heroicons/react/outline"

import client from "@services/http/client"
import { useAppSelector, useAppDispatch } from "@hooks/useRedux"
import DetailWrapper from "./DetailWrapper"
import Button from "../common/Button"
import TextArea from "../common/TextArea"
import { updateProject } from "@store/projects"
import triggerToast from "../common/Toast"
import { DefaultInput, mergeStyles, styles } from "./DefaultInputs"

import type { akce as Akce } from "@codegen"

type DetailProps = { detail: Akce & { user: { id: number; full_name: string } } }

const ApprovalSheet = ({ detail }: DetailProps) => {
  const [isPending, setIsPending] = useState(false)

  const userId = useAppSelector(store => store.auth!.user!.id)
  const dispatch = useAppDispatch()
  const { register, handleSubmit, setValue, setError } = useForm()
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

  const onSubmit = data => {
    setIsPending(true)
    dispatch(updateProject({ id, userId, ...data }))
      .unwrap()
      .then(() => {
        setIsPending(false)
      })
      .catch(err => {
        setIsPending(false)
        setError(
          Object.entries(err.errors).map(([key, val]) => ({
            name: key,
            message: val,
            type: "required", //?
          })) as ManualFieldError<{ [name: string]: string }>[],
        )
        triggerToast({
          type: "error",
          message: err.message,
          options: { duration: 3000 },
        })
      })
  }

  return (
    <DetailWrapper>
      <h1>Expertní list</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DefaultInput
          name="EL_lokalita"
          label="lokalita"
          placeholder="lokalita"
          register={register}
          overrides={{ input: tw`md:(w-96)` }}
        />
        <DefaultInput
          name="EL_Termin"
          label="termín kontrol"
          placeholder="termín kontrol"
          register={register}
        />
        <DefaultInput
          name="EL_Forma"
          label="forma"
          placeholder="forma"
          register={register}
          overrides={{ input: tw`md:(w-96)` }}
        />

        <DefaultInput name="EL_Denik" label="deník" placeholder="deník" register={register} />
        <DefaultInput
          name="EL_fotodokumentace"
          label="fotodokumentace"
          placeholder="fotodokumentace"
          register={register}
        />
        <DefaultInput
          name="EL_kresebna_a_textova"
          label="kresebná či textová dokumentace"
          placeholder="kresebná či textová dokumentace"
          register={register}
        />
        <DefaultInput
          name="EL_Dokumentovane"
          label="dokumentované situace"
          placeholder="dokumentované situace"
          register={register}
        />
        <DefaultInput
          name="EL_Movite"
          label="movité nálezy"
          placeholder="dokumentace"
          register={register}
        />
        <DefaultInput
          name="EL_ulozeni"
          label="uložení movitých nálezů"
          placeholder="uložení movitých nálezů"
          register={register}
        />
        <TextArea
          name="EL_Popis"
          label="popis"
          placeholder="popis"
          register={register}
          styles={mergeStyles(styles, { input: tw`max-w-full resize w-96` })}
        />
        <DefaultInput
          name="EL_datum"
          label="datum tisku"
          placeholder="datum tisku"
          register={register}
        />
        <DefaultInput
          type="checkbox"
          name="EL_hotovo"
          label="údaje pro expertní list jsou vloženy"
          register={register}
          overrides={{ input: tw`w-auto` }}
        />
        <div tw="flex items-start pt-8">
          <Button type="submit" className={isPending ? "spinner" : ""} disabled={isPending}>
            Uložit změny
          </Button>
          <Button
            tw="bg-gray-100 text-gray-500 hover:(bg-gray-200 text-gray-600) ml-4"
            type="button"
            onClick={async e => {
              e.preventDefault()
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
        </div>
      </form>
    </DetailWrapper>
  )
}

export default ApprovalSheet
