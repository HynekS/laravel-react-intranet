import { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { useSelector, useDispatch } from "react-redux"
import { css } from "@emotion/react"
import tw from "twin.macro"
import DayPickerInput from "react-day-picker/DayPickerInput"
import "react-day-picker/lib/style.css"

import dateFnsFormat from "date-fns/format"
import dateFnsParse from "date-fns/parse"
import { DateUtils } from "react-day-picker"

import { updateProject } from "../../store/projects"
import { fetchActiveUsers } from "../../store/meta"

import { monthsCZ, daysCZ, daysShortCZ } from "../../services/Date/terms_cs-CZ"

import DetailWrapper from "./DetailWrapper"
import Button from "../common/Button"
import Input from "../common/Input"
import Select from "../common/Select"
import ButtonStyledRadio from "./ButtonStyledRadio"

import type { AppState } from "../../store/rootReducer"
import type { akce as Akce, users as User } from "../../types/model"

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
      ${tw`block appearance-none border-2 w-full bg-white border-gray-300 p-2 pr-8 rounded leading-tight hover:(border-gray-400) focus:(outline-none bg-white border-blue-500)`}
    }
    & .hasError {
      ${tw`border-red-400`}
    }
  }
  .errorMessage {
    ${tw`absolute left-0 z-10 inline-block p-1 pr-2 text-xs bg-white rounded shadow-sm top-full`}
  }
`

/* A lot of that can be probably delegated to 'valueAsNumber' prop, but we still has to deal with isNaN or null value */
const transformFormValues = data => ({
  ...data,
  objednavka: Number(data.objednavka),
  smlouva: Number(data.objednavka),
  rozpocet_A: Number(data.rozpocet_A),
  rozpocet_B: Number(data.rozpocet_B),
  registrovano_bit: Number(data.registrovano_bit),
  id_stav: Number(data.id_stav),
  nalez: data.nalez === "null" ? null : Number(data.nalez),
  owner_id: Number(data.owner_id),
  zaa_hlaseno: Number(data.zaa_hlaseno),

  datum_pocatku: data.datum_pocatku && data.datum_pocatku.toISOString().split("T")[0],
  datum_ukonceni: data.datum_ukonceni && data.datum_ukonceni.toISOString().split("T")[0],
})

function parseDate(str: string, format: string, locale: Locale | undefined) {
  const parsed = dateFnsParse(str, format, new Date(), { locale })
  if (DateUtils.isDate(parsed)) {
    return parsed
  }
  return undefined
}

function formatDate(date: Date, format: string, locale: Locale | undefined) {
  return dateFnsFormat(date, format, { locale })
}

type DetailProps = { detail: Akce & { user: User } }

const Detail = ({ detail }: DetailProps) => {
  const dispatch = useDispatch()
  const userId = useSelector((store: AppState) => store.auth.user.id)
  const activeUsers: User[] = useSelector((store: AppState) => store.meta.activeUsers)
  const { register, control, handleSubmit, setValue, watch, errors } = useForm()
  const { c_akce, id_akce: id } = detail || {}

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

  useEffect(() => {
    if (!activeUsers.length) {
      dispatch(fetchActiveUsers())
    }
  }, [])

  const onSubmit = data => dispatch(updateProject({ id, userId, ...transformFormValues(data) }))

  const boundTitle = watch("nazev_akce")
  const dateValues = watch(["datum_pocatku", "datum_ukonceni"])

  return (
    <DetailWrapper>
      <h1 tw="pb-4 text-xl font-semibold text-gray-700">
        {c_akce}&ensp;{boundTitle}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} /*ref={formRef}*/ css={styles}>
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
                    name="datum_pocatku"
                    format="d. M. yyyy"
                    formatDate={formatDate}
                    parseDate={parseDate}
                    placeholder={`${dateFnsFormat(new Date(), "d. M. yyyy")}`}
                    onDayChange={(date: Date) => {
                      setValue("datum_pocatku", date)
                    }}
                    dayPickerProps={{
                      months: monthsCZ,
                      weekdaysLong: daysCZ,
                      weekdaysShort: daysShortCZ,
                      firstDayOfWeek: 1,

                      selectedDays:
                        (dateValues.datum_pocatku || detail?.datum_pocatku) &&
                        new Date(dateValues.datum_pocatku || detail?.datum_pocatku),
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
                    name="datum_ukonceni"
                    format="d. M. yyyy"
                    formatDate={formatDate}
                    parseDate={parseDate}
                    placeholder={`${dateFnsFormat(new Date(), "d. M. yyyy")}`}
                    onDayChange={(date: Date) => {
                      setValue("datum_ukonceni", date)
                    }}
                    dayPickerProps={{
                      months: monthsCZ,
                      weekdaysLong: daysCZ,
                      weekdaysShort: daysShortCZ,
                      firstDayOfWeek: 1,

                      selectedDays:
                        (dateValues.datum_ukonceni || detail?.datum_ukonceni) &&
                        new Date(dateValues.datum_ukonceni || detail?.datum_ukonceni),
                    }}
                  />
                </div>
              </div>
              <Select
                name="owner_id"
                label="zajišťuje"
                options={activeUsers
                  .map(user => ({
                    label: user?.full_name,
                    value: user?.id,
                  }))
                  // If owner of the project is not among active users, add him/her to options
                  .concat(
                    activeUsers.find(user => user.id === detail.user?.id)
                      ? []
                      : {
                          label: detail.user?.full_name,
                          value: detail.user?.id,
                        },
                  )}
                register={register}
              />
            </fieldset>
            <Button type="submit">Uložit změny</Button>
          </div>
        </div>
      </form>
    </DetailWrapper>
  )
}

export default Detail
