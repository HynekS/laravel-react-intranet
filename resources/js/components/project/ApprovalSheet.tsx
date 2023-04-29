import { useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import tw from "twin.macro"
import { DocumentDownloadIcon } from "@heroicons/react/outline"

import client from "@services/http/client"
import { useAppSelector, useAppDispatch } from "@hooks/useRedux"
import { updateProject } from "@store/projects"
import pick from "@utils/pick"

import DetailWrapper from "./DetailWrapper"
import Button from "../common/Button"
import TextArea from "../common/TextArea"
import triggerToast from "../common/Toast"
import { DefaultInput, mergeStyles, styles } from "./DefaultInputs"

import type { akce as Akce, users as User } from "@codegen"

const approvalSheetFields = [
  "id_akce",
  "EL_lokalita",
  "EL_Termin",
  "EL_Forma",
  "EL_fotodokumentace",
  "EL_kresebna_a_textova",
  "EL_Dokumentovane",
  "EL_Movite",
  "EL_ulozeni",
  "EL_Popis",
  "EL_datum",
  "EL_hotovo",
] as const

type Detail = Akce & { user: User }

type DetailProps = { detail?: Akce & { user: User } }

const ApprovalSheet = ({ detail = {} as Detail }: DetailProps) => {
  const defaultValues = pick(detail, ...approvalSheetFields)
  const userId = useAppSelector(store => store.auth.user!.id)
  const dispatch = useAppDispatch()
  const dirtyRef = useRef(false)

  const { register, handleSubmit, setError, formState, getValues } = useForm<Akce>({
    defaultValues,
    mode: "onTouched",
  })

  const { errors, dirtyFields, isDirty, touchedFields } = formState

  const { id_akce: id } = detail

  dirtyRef.current = isDirty

  useEffect(() => {
    window.addEventListener("beforeunload", submitOnUnmount)
    return () => {
      window.removeEventListener("beforeunload", submitOnUnmount)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (isDirty) {
        onSubmit(getValues())
      }
    }
  }, [JSON.stringify(touchedFields)])

  const submitOnUnmount = () => {
    ;(document.activeElement as HTMLElement)?.blur()
    if (dirtyRef.current) {
      onSubmit(getValues())
    }
  }

  const onSubmit = (data: Akce) => {
    //setIsPending(true)
    dispatch(updateProject({ id, userId, project: data }))
      .unwrap()
      .then(() => {})
      .catch(err => {
        Object.entries(err.errors).forEach((key, val) => {
          setError(key, { type: val })
        })
        triggerToast({
          type: "error",
          message: err.message,
          options: { duration: 3000 },
        })
      })
  }

  return (
    <DetailWrapper>
      <form onSubmit={handleSubmit(onSubmit)} tw="pt-4">
        <DefaultInput
          label="lokalita"
          placeholder="lokalita"
          overrides={{ input: tw`md:(w-96)` }}
          {...register("EL_lokalita")}
        />
        <DefaultInput
          label="termín kontrol"
          placeholder="termín kontrol"
          {...register("EL_Termin")}
        />
        <DefaultInput
          label="forma"
          placeholder="forma"
          {...register("EL_Forma")}
          overrides={{ input: tw`md:(w-96)` }}
        />

        <DefaultInput label="deník" placeholder="deník" {...register("EL_Denik")} />
        <DefaultInput
          label="fotodokumentace"
          placeholder="fotodokumentace"
          {...register("EL_fotodokumentace")}
        />
        <DefaultInput
          label="kresebná či textová dokumentace"
          placeholder="kresebná či textová dokumentace"
          {...register("EL_kresebna_a_textova")}
        />
        <DefaultInput
          label="dokumentované situace"
          placeholder="dokumentované situace"
          {...register("EL_Dokumentovane")}
        />
        <DefaultInput label="movité nálezy" placeholder="dokumentace" {...register("EL_Movite")} />
        <DefaultInput
          label="uložení movitých nálezů"
          placeholder="uložení movitých nálezů"
          {...register("EL_ulozeni")}
        />
        <TextArea
          label="popis"
          placeholder="popis"
          {...register("EL_Popis")}
          styles={mergeStyles(styles, {
            input: tw`max-w-full resize w-96 min-height[4rem]`,
            labelWrapper: tw`md:(items-start pt-1)`,
          })}
        />
        <DefaultInput label="datum tisku" placeholder="datum tisku" {...register("EL_datum")} />
        <DefaultInput
          type="checkbox"
          label="údaje pro expertní list jsou vloženy"
          // TODO these overrides should be defaults for checkboxes
          overrides={{
            input: tw`appearance-none h-3 w-3 checked:(bg-blue-500 border-blue-500) transition duration-200 my-1 p-1.5 align-top bg-no-repeat bg-center bg-contain float-left cursor-pointer`,
          }}
          {...register("EL_hotovo")}
        />
        <div tw="flex items-start pt-8">
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
