import { useState } from "react"
import { useForm } from "react-hook-form"
import tw from "twin.macro"

import { useAppDispatch } from "@hooks/useRedux"
import { createInvoice } from "@store/invoices"

import Select from "../../common/Select"

import { DefaultInput, mergeStyles, styles } from "../DefaultInputs"

import { faktury as Faktura } from "@codegen"

type Props = {
  modalState: {
    data: Faktura
  }
  onModalClose: () => void
}

const InvoiceCreateForm = ({ modalState: { data }, onModalClose }: Props) => {
  const [isPending, setIsPending] = useState(false)
  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm()
  const dispatch = useAppDispatch()
  const { c_akce, id_akce: projectId } = data

  const onSubmit = formData => {
    dispatch(createInvoice({ ...formData, c_akce, projectId }))
      .unwrap()
      .then(() => {
        setIsPending(false)
        onModalClose()
      })
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div tw="p-6">
          <Select
            label="typ částky"
            options={[
              { label: "🦺 Dohled", value: 0 },
              { label: "⛏️ Výzkum", value: 1 },
            ]}
            styles={mergeStyles(styles, { input: tw`width[26ch]` })}
            error={errors}
            {...register("typ_castky", {
              required: "zvolte, prosím, typ částky",
            })}
          />
          <DefaultInput
            label="číslo faktury"
            inputMode="numeric"
            error={errors}
            {...register("c_faktury", {
              pattern: { value: /^[0-9]+$/, message: "pole smí obsahovat pouze čísla" },
            })}
          />
          <DefaultInput
            label="částka (Kč)"
            inputMode="numeric"
            error={errors}
            {...register("castka", {
              pattern: { value: /^[0-9]+$/, message: "pole smí obsahovat pouze čísla" },
            })}
          />
        </div>
        <footer tw="flex justify-end p-6 bg-gray-100 rounded-lg rounded-t-none">
          <button
            tw="text-gray-500 font-medium py-2 px-4 ml-4 rounded transition-colors duration-300 hover:(text-gray-600) focus:(outline-none ring transition-shadow duration-300)"
            onClick={onModalClose}
          >
            Zrušit
          </button>
          <button
            tw="bg-blue-600 transition-colors duration-300 text-white font-medium py-2 px-4  ml-4 rounded hover:(bg-blue-700) focus:(outline-none ring transition-shadow duration-300)"
            className={`${isPending ? "spinner" : ""}`}
            disabled={isPending}
          >
            Vytvořit fakturu
          </button>
        </footer>
      </form>
    </div>
  )
}

export default InvoiceCreateForm
