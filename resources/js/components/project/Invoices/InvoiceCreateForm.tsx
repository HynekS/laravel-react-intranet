import { useState } from "react"
import { useForm } from "react-hook-form"
import { css } from "@emotion/react"
import tw from "twin.macro"

import { useAppDispatch } from "@hooks/useRedux"
import { createInvoice } from "@store/invoices"

import Input from "../../common/Input"
import Select from "../../common/Select"

const styles = css`
  fieldset {
    border-bottom: 1px solid gray;
    padding: 0.5rem;
  }
  .fieldWrapper {
    ${tw`pb-2 md:(flex items-center)`}
  }
  .labelWrapper {
    ${tw`md:(w-1/4)`}
    & label {
      ${tw`block text-gray-600 font-semibold pb-1 md:(text-right mb-0 pr-4)`}
    }
  }
  .inputWrapper {
    ${tw`relative md:(w-3/4)`}
    & .DayPickerInput {
      position: relative;
      &::after {
        ${tw`absolute inset-y-0 right-0 w-4 h-full mr-2 opacity-25 fill-current`}
        content: "";
        background: url(/images/calendar-solid.svg) no-repeat center;
      }
    }
    & input[type="text"],
    .DayPickerInput input {
      ${tw`bg-gray-200 appearance-none border-2 border-gray-200 rounded py-1 px-2 text-gray-700 leading-tight focus:(outline-none bg-white border-blue-500)`}
    }
    & input[type="checkbox"] {
      ${tw`w-auto focus:(outline-none ring)`}
    }
    & select {
      ${tw`block appearance-none border-2 w-full bg-white border-gray-300 py-1 pl-2 pr-8 rounded leading-tight hover:(border-gray-400) focus:(outline-none bg-white border-blue-500)`}
    }
    & .hasError,
    input[type="text"].hasError {
      ${tw`border-red-400`}
      &:focus {
        ${tw`border-red-400`}
      }
    }
  }
  .errorMessage {
    ${tw`absolute left-0 z-10 flex p-1 pr-2 text-xs text-red-600 bg-white rounded shadow-sm top-full`}
    & svg {
      ${tw`w-4 mr-2 fill-current`}
    }
  }
`

const InvoiceCreateForm = ({ modalState: { data }, onModalClose }) => {
  const [isPending, setIsPending] = useState(false)
  const { register, handleSubmit, errors } = useForm()
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
      <form onSubmit={handleSubmit(onSubmit)} css={styles}>
        <div tw="p-6">
          <Select
            name="typ_castky"
            label="typ částky"
            options={[
              { label: "🦺 Dohled", value: 0 },
              { label: "⛏️ Výzkum", value: 1 },
            ]}
            register={register({
              required: "zvolte, prosím, typ částky",
            })}
            error={errors}
          />
          <Input
            label="číslo faktury"
            name="c_faktury"
            inputMode="numeric"
            register={register({
              pattern: { value: /^[0-9]+$/, message: "pole smí obsahovat pouze čísla" },
            })}
            error={errors}
          />
          <Input
            label="částka (Kč)"
            name="castka"
            inputMode="numeric"
            register={register({
              pattern: { value: /^[0-9]+$/, message: "pole smí obsahovat pouze čísla" },
            })}
            error={errors}
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
