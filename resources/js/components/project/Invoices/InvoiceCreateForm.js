/** @jsx jsx */
import React from "react"
import { useForm } from "react-hook-form"
import { jsx, css } from "@emotion/core"
import tw from "twin.macro"
import "react-day-picker/lib/style.css"

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
        ${tw`fill-current h-full w-4 mr-2 absolute inset-y-0 right-0 opacity-25`}
        content: "";
        background: url(/images/calendar-solid.svg) no-repeat center;
      }
    }
    & input[type="text"],
    .DayPickerInput input {
      ${tw`bg-gray-200 appearance-none border-2 border-gray-200 rounded py-1 px-2 text-gray-700 leading-tight focus:(outline-none bg-white border-blue-500)`}
    }
    & input[type="checkbox"] {
      ${tw`w-auto focus:(outline-none shadow-outline)`}
    }
    & select {
      ${tw`block appearance-none border-2 w-full bg-white border-gray-300 p-2 pr-8 rounded leading-tight hover:(border-gray-400) focus:(outline-none bg-white border-blue-500)`}
    }
    & .hasError {
      ${tw`border-red-400`}
    }
  }
  .errorMessage {
    ${tw`absolute inline-block z-10 left-0 top-full text-xs bg-white p-1 pr-2 rounded shadow-sm`}
  }
`

const InvoiceCreateForm = ({ modalState, onModalClose, ...props }) => {
  const { register, control, handleSubmit, errors } = useForm()

  const onSubmit = data => console.log(data)

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} css={styles}>
        <div tw="p-6">
          <Select
            name="typ_castky"
            label="typ částky"
            options={[
              { label: "Dohled", value: 0 },
              { label: " Výzkum", value: 1 },
            ]}
            register={register({ required: true })}
          />
          <Input
            label="číslo faktury"
            name="c_faktury"
            register={register({
              pattern: { value: /^[0-9]+$/, message: "pole může obsahovat pouze čísla" },
            })}
            error={errors}
          />
          <Input
            label="částka"
            name="castka"
            register={register({
              pattern: { value: /^[0-9]+$/, message: "pole může obsahovat pouze čísla" },
            })}
            error={errors}
          />
        </div>
        <footer tw="flex justify-end bg-gray-100 p-6 rounded-lg rounded-t-none">
          <button
            tw="bg-gray-100 transition-colors duration-300 text-gray-500 font-medium py-2 px-4  ml-4 rounded hover:(bg-gray-300) focus:(outline-none shadow-outline transition-shadow duration-300)"
            onClick={onModalClose}
          >
            Zrušit
          </button>
          <button tw="bg-blue-600 transition-colors duration-300 text-white font-medium py-2 px-4  ml-4 rounded hover:(bg-blue-700) focus:(outline-none shadow-outline transition-shadow duration-300)">
            Vytvořit fakturu
          </button>
        </footer>
      </form>
    </div>
  )
}

export default InvoiceCreateForm
