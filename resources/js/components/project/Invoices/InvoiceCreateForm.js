/** @jsx jsx */
import React from "react"
import { useForm, Controller } from "react-hook-form"
import { jsx, css } from "@emotion/core"
import tw from "twin.macro"
import DayPickerInput from "react-day-picker/DayPickerInput"
import "react-day-picker/lib/style.css"

import { monthsCZ, daysCZ, daysShortCZ } from "../../../services/Date/terms_cs-CZ"
import isValidDate from "../../../services/Date/isValidDate"
import swapCzDateToISODate from "../../../services/Date/swapCzDateToISODate"
import czechDateRegexp from "../../../services/Date/czechDateRegexp"

import Input from "../../common/Input"

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

const InvoiceCreateForm = ({ ...props }) => {
  const { register, control, handleSubmit, errors } = useForm()

  const onSubmit = data => console.log(data)

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} css={styles}>
        <Input label="číslo faktury" name="c_faktury" register={register({ pattern: /\d+/ })} />
        <div className="fieldWrapper">
          <div className="labelWrapper">
            <label>datum počátku</label>
          </div>
          <div className="inputWrapper">
            <Controller
              as={DayPickerInput}
              control={control}
              rules={{ pattern: czechDateRegexp }}
              name="datum_vlozeni"
              format="d. M. yyyy"
              formatDate={date => new Intl.DateTimeFormat("cs-CZ").format(date)}
              parseDate={date => {
                if (date.match(czechDateRegexp)) {
                  let testDate = new Date(swapCzDateToISODate(date))
                  return isValidDate(testDate) && testDate
                }
              }}
              placeholder="dd. mm. yyyy"
              dayPickerProps={{
                locale: "cs-CZ",
                months: monthsCZ,
                weekdaysLong: daysCZ,
                weekdaysShort: daysShortCZ,
                firstDayOfWeek: 1,
              }}
            />
          </div>
        </div>
        <Input label="částka" name="castka" register={register({ pattern: /\d+/ })} />
        <button
          type="submit"
          tw="bg-blue-600 hover:bg-blue-700 transition-colors duration-300 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline focus:transition-shadow focus:duration-300"
        >
          Vytvořit fakturu
        </button>
      </form>
    </div>
  )
}

export default InvoiceCreateForm
