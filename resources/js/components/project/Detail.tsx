// @ts-check
/** @jsx jsx */
import React, { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { jsx, css } from "@emotion/core"
import tw from "twin.macro"
import DayPickerInput from "react-day-picker/DayPickerInput"
import "react-day-picker/lib/style.css"
import { useSelector, useDispatch } from "react-redux"

import { updateProject } from "../../store/projects"
import { fetchActiveUsers } from "../../store/meta"

import { monthsCZ, daysCZ, daysShortCZ } from "../../services/Date/terms_cs-CZ"
import isValidDate from "../../services/Date/isValidDate"
import swapCzDateToISODate from "../../services/Date/swapCzDateToISODate"
import czechDateRegexp from "../../services/Date/czechDateRegexp"

import useFocusNextOnEnter from "../../hooks/useFocusNextOnEnter"

import DetailWrapper from "./DetailWrapper"
import Input from "../common/Input"
import Select from "../common/Select"
import ButtonStyledRadio from "./ButtonStyledRadio"

import type { AppState } from "../../store/rootReducer"

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

const transformFormValues = data => ({
  ...data,
  objednavka: Number(data.objednavka),
  smlouva: Number(data.objednavka),
  rozpocet_A: Number(data.rozpocet_A),
  rozpocet_B: Number(data.rozpocet_B),
  registrovano_bit: Number(data.registrovano_bit),
  id_stav: Number(data.id_stav),
  nalez: data.nalez === "null" ? null : Number(data.nalez),
  user_id: Number(data.user_id),
  zaa_hlaseno: Number(data.zaa_hlaseno),
  datum_pocatku:
    data.datum_pocatku &&
    new Date(swapCzDateToISODate(data.datum_pocatku)).toISOString().split("T")[0],
  datum_ukonceni:
    data.datum_ukonceni &&
    new Date(swapCzDateToISODate(data.datum_ukonceni)).toISOString().split("T")[0],
})

const Detail = ({ detail }) => {
  const dispatch = useDispatch()
  const activeUsers = useSelector((store: AppState) => store.meta.activeUsers)
  const { register, control, handleSubmit, setValue, watch, errors } = useForm()
  const formRef = useFocusNextOnEnter()
  const { c_akce, id_akce: id } = detail || {}

  useEffect(() => {
    if (detail) {
      for (let [key, value] of Object.entries(detail)) {
        setValue(key, value)
      }
    }
  }, [detail])

  useEffect(() => {
    if (!activeUsers.length) {
      dispatch(fetchActiveUsers())
    }
  }, [])

  const onSubmit = data => dispatch(updateProject({ id, ...transformFormValues(data) }))

  const boundTitle = watch("nazev_akce")
  const dateValues = watch(["datum_pocatku", "datum_ukonceni"])

  return (
    <DetailWrapper>
      <h1 tw="font-semibold text-gray-700 text-xl pb-4">
        {c_akce}&ensp;{boundTitle}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} ref={formRef} css={styles}>
        <div>
          <div>
            <fieldset>
              <Input
                name="nazev_akce"
                label="název akce"
                placeholder="název akce"
                register={register({ required: true })}
              />
            </fieldset>
          </div>
          <div>
            <fieldset>
              <Input type="checkbox" name="objednavka" label="objednávka" register={register} />
              <Input
                name="objednavka_cislo"
                label="číslo objednávky"
                placeholder="číslo objednávky"
                register={register}
              />
              <Input
                name="objednavka_info"
                label="objednávka info"
                placeholder="objednávka info"
                register={register}
              />
              <Input type="checkbox" name="smlouva" label="smlouva podepsána" register={register} />
              <Input
                name="rozpocet_B"
                label="rozpočet dohledy"
                placeholder="Rozpočet dohledy"
                register={register}
              />
              <Input
                name="rozpocet_A"
                label="rozpočet výzkum"
                placeholder="Rozpočet výzkum"
                register={register}
              />
            </fieldset>
          </div>

          <div>
            <fieldset>
              <Input
                type="checkbox"
                name="registrovano_bit"
                label="registrováno v databázi"
                register={register}
              />
              <Input
                name="registrace_info"
                label="id registrace"
                placeholder="id registrace"
                register={register}
              />
              <Select
                name="id_stav"
                label="stav"
                placeholder="stav"
                options={[
                  { label: "❌ -1 (akce padla)", value: -1 },
                  { label: "⏰ 1 (před zahájením)", value: 1 },
                  { label: "⛏️ 2 (zahájeno v terénu)", value: 2 },
                  { label: "💻 3 (probíhá zpracování)", value: 3 },
                  { label: "✔️ 4 (hotovo)", value: 4 },
                ]}
                register={register}
              />
            </fieldset>
          </div>

          <div>
            <fieldset>
              <Input
                name="investor_jmeno"
                label="název investora"
                placeholder="jméno investora"
                register={register}
              />
              <Input
                name="investor_kontakt"
                label="zástupce investora"
                placeholder="zástupce investora"
                register={register}
              />
              <Input
                name="investor_adresa"
                label="sídlo investora"
                placeholder="sídlo investora"
                register={register}
              />
              <Input
                name="investor_ico"
                label="IČO investora"
                placeholder="IČO investora"
                register={register}
              />
            </fieldset>
          </div>

          <div>
            <fieldset>
              <Input name="katastr" label="katastr" placeholder="katastr" register={register} />
              <Input
                type="text"
                name="okres"
                label="okres"
                placeholder="okres"
                register={register}
              />
              <Input type="text" name="kraj" label="kraj" placeholder="kraj" register={register} />
            </fieldset>
          </div>

          <div>
            <fieldset>
              <ButtonStyledRadio
                name="nalez"
                label="nález"
                options={{
                  nezjištěno: null,
                  pozitivní: 1,
                  negativní: 0,
                }}
                register={register}
              />
              <Input
                name="datum_pocatku_text"
                label="předběžné datum pořátku"
                register={register}
              />
              <div className="fieldWrapper">
                <div className="labelWrapper">
                  <label>datum počátku</label>
                </div>
                <div className="inputWrapper">
                  <Controller
                    as={DayPickerInput}
                    control={control}
                    rules={{ pattern: czechDateRegexp }}
                    name="datum_pocatku"
                    format="d. M. yyyy"
                    formatDate={date => new Intl.DateTimeFormat("cs-CZ").format(date)}
                    parseDate={date => {
                      if (date.match(czechDateRegexp)) {
                        let testDate = new Date(swapCzDateToISODate(date))
                        return isValidDate(testDate) && testDate
                      }
                    }}
                    placeholder="dd. mm. yyyy"
                    value={new Date(detail?.datum_pocatku)}
                    dayPickerProps={{
                      locale: "cs-CZ",
                      months: monthsCZ,
                      weekdaysLong: daysCZ,
                      weekdaysShort: daysShortCZ,
                      firstDayOfWeek: 1,
                      selectedDays:
                        (dateValues.datum_pocatku || detail?.datum_pocatku) &&
                        new Date(
                          swapCzDateToISODate(dateValues.datum_pocatku || detail?.datum_pocatku),
                        ),
                    }}
                  />
                </div>
              </div>
              <Input
                type="text"
                name="datum_ukonceni_text"
                label="předběžné datum ukončení"
                register={register}
              />
              <div className="fieldWrapper">
                <div className="labelWrapper">
                  <label>datum ukončení</label>
                </div>
                <div className="inputWrapper">
                  <Controller
                    as={DayPickerInput}
                    control={control}
                    rules={{ pattern: czechDateRegexp }}
                    name="datum_ukonceni"
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
                      selectedDays:
                        (dateValues.datum_pocatku || detail?.datum_pocatku) &&
                        new Date(
                          swapCzDateToISODate(dateValues.datum_pocatku || detail?.datum_pocatku),
                        ),
                    }}
                  />
                </div>
              </div>
              <Select
                name="user_id"
                label="zajišťuje"
                options={activeUsers
                  .map(user => ({
                    label: user.full_name,
                    value: user.id,
                  }))
                  // If owner of the project is not among active users, add him/her to options
                  .concat(
                    activeUsers.find(user => user.id === detail.user.id)
                      ? []
                      : {
                          label: detail.user.full_name,
                          value: detail.user.id,
                        },
                  )}
                register={register}
              />
            </fieldset>
            <button
              type="submit"
              tw="bg-blue-600 hover:bg-blue-700 transition-colors duration-300 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline focus:transition-shadow focus:duration-300"
            >
              Uložit změny
            </button>
          </div>
        </div>
      </form>
    </DetailWrapper>
  )
}

export default Detail
