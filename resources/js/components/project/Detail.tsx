import { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router"
import { css } from "@emotion/react"
import tw from "twin.macro"
import DayPickerInput from "react-day-picker/DayPickerInput"
import "react-day-picker/lib/style.css"
import dateFnsFormat from "date-fns/format"
import dateFnsParse from "date-fns/parse"
import { DateUtils } from "react-day-picker"
import { TrashIcon } from "@heroicons/react/solid"

import { createProject, updateProject, deleteProject } from "../../store/projects"
import { fetchActiveUsers } from "../../store/meta"

import { monthsCZ, daysCZ, daysShortCZ } from "../../services/Date/terms_cs-CZ"

import DetailWrapper from "./DetailWrapper"
import Button from "../common/Button"
import Input, { InputProps, StyleScopeObject } from "../common/Input"
import Select from "../common/Select"
import ButtonStyledRadio from "./ButtonStyledRadio"
import { Dropdown, DropdownItem } from "../../components/common/Dropdown"
import Modal from "../common/StyledModal"
import ProjectDeleteDialog from "./ProjectDeleteDialog"
import ModalCloseButton from "../common/ModalCloseButton"

import type { AppState } from "../../store/rootReducer"
import type { akce as Akce, users as User } from "../../types/model"

const styles = {
  fieldWrapper: tw`flex text-sm mb-2 flex-col md:(flex-row)`,
  labelWrapper: tw`pr-4 md:(w-60 flex items-center justify-end) lg:(w-72) xl:(w-80)`,
  label: tw`font-semibold`,
  inputWrapper: tw`relative flex-1 w-full`,
  input: tw`border border-gray-200 text-gray-600 rounded-sm py-0.5 px-1.5 width[20ch] focus:(border-transparent outline-none ring ring-2 transition-shadow duration-300) placeholder:(text-gray-300)`,
  inputError: tw`border-red-400 focus:(ring-red-400)`,
  errorMessage: tw`absolute left-0 z-10 flex inline-block p-1 pr-2 text-xs text-red-400 bg-white border-red-300 rounded shadow-sm top-full`,
}

const mergeStyles = (styles: StyleScopeObject = {}, overrides: StyleScopeObject = {}) => {
  let result = { ...styles }
  ;(Object.keys(result) as Array<keyof StyleScopeObject>).forEach(key => {
    result[key] = overrides[key] ? [result[key]].concat(overrides[key]).flat() : result[key]
  })
  return result
}

const DefaultInput = ({ overrides, ...props }: InputProps) => (
  <Input {...props} styles={mergeStyles(styles, overrides)} />
)

const DefaultFieldset = ({ children, ...props }) => (
  <fieldset tw="pb-5" {...props}>
    {children}
  </fieldset>
)

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
  user_id: Number(data.user_id),
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

type Detail = Akce & { user: User }

type DetailProps = {
  detail?: Akce & { user: User }
  type: "update" | "create"
}

const Detail = ({ detail = {} as Detail, type = "update" }: DetailProps) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const userId = useSelector((store: AppState) => store.auth.user.id)
  const activeUsers: User[] = useSelector((store: AppState) => store.meta.activeUsers)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { register, control, handleSubmit, setValue, watch, errors } = useForm()

  const { c_akce, id_akce: id, rok_per_year } = detail

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

  const onSubmit = data => {
    if (type === "update")
      return dispatch(updateProject({ id, userId, ...transformFormValues(data) }))
    if (type === "create")
      return dispatch(createProject({ userId, ...transformFormValues(data) }, navigate))
    return
  }

  const boundTitle = watch("nazev_akce")
  const dateValues = watch(["datum_pocatku", "datum_ukonceni"])

  return (
    <DetailWrapper>
      <form onSubmit={handleSubmit(onSubmit)} tw="pb-4">
        <div tw="flex items-start justify-between">
          <h1 tw="pb-4 text-xl font-semibold text-gray-700">
            {c_akce}&ensp;{boundTitle}
          </h1>
          <div tw="flex items-center">
            {type === "update" && (
              <Dropdown tw="my-auto mr-4">
                <DropdownItem
                  onClick={() => {
                    setIsModalOpen(true)
                    /*
                    return dispatch(
                      deleteProject(
                        { id, userId, year: Number(rok_per_year), project: detail },
                        navigate,
                      ),
                    )*/
                  }}
                  Icon={TrashIcon}
                  label="Odstranit&nbsp;akci"
                />
              </Dropdown>
            )}
            <Button type="submit">
              {type === "update" ? "Uložit\u00a0změny" : "Vytvořit\u00a0akci"}
            </Button>
          </div>
        </div>
        <div>
          <DefaultFieldset>
            <DefaultInput
              name="nazev_akce"
              label="název akce"
              placeholder="název akce"
              register={register({
                required: { value: true, message: "toto pole je třeba vyplnit" },
              })}
              error={errors}
              overrides={{ input: tw`w-7/12` }}
            />
          </DefaultFieldset>
        </div>
        <div tw="flex justify-start">
          <div tw="w-4/12">
            <DefaultFieldset>
              <DefaultInput
                type="checkbox"
                name="objednavka"
                label="objednávka"
                register={register}
                overrides={{
                  input: tw`appearance-none h-3 w-3 checked:(bg-blue-500 border-blue-500) transition duration-200 my-1 p-1.5 align-top bg-no-repeat bg-center bg-contain float-left cursor-pointer`,
                }}
              />
              <DefaultInput
                name="objednavka_cislo"
                label="číslo objednávky"
                placeholder="číslo objednávky"
                register={register}
              />
              <DefaultInput
                name="objednavka_info"
                label="objednávka info"
                placeholder="objednávka info"
                register={register}
              />
              <DefaultInput
                type="checkbox"
                name="smlouva"
                label="smlouva podepsána"
                register={register}
                overrides={{
                  input: tw`appearance-none h-3 w-3 checked:(bg-blue-500 border-blue-500) transition duration-200 my-1 p-1.5 align-top bg-no-repeat bg-center bg-contain float-left cursor-pointer`,
                }}
              />
              <DefaultInput
                name="rozpocet_B"
                label="rozpočet dohledy"
                placeholder="Rozpočet dohledy"
                register={register}
              />
              <DefaultInput
                name="rozpocet_A"
                label="rozpočet výzkum"
                placeholder="Rozpočet výzkum"
                register={register}
              />
            </DefaultFieldset>
          </div>
          <div>
            <DefaultFieldset>
              <DefaultInput
                type="checkbox"
                name="registrovano_bit"
                label="registrováno v databázi"
                register={register}
                overrides={{
                  input: tw`appearance-none h-3 w-3 checked:(bg-blue-500 border-blue-500) transition duration-200 my-1 p-1.5 align-top bg-no-repeat bg-center bg-contain float-left cursor-pointer`,
                }}
              />
              <DefaultInput
                name="registrace_info"
                label="id registrace"
                placeholder="id registrace"
                register={register}
                overrides={{ input: tw`width[26ch]` }}
              />
            </DefaultFieldset>
            <DefaultFieldset>
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
                styles={mergeStyles(styles, { input: tw`width[26ch]` })}
              />
              <ButtonStyledRadio
                name="nalez"
                label="nález"
                options={{
                  nezjištěno: null,
                  pozitivní: 1,
                  negativní: 0,
                }}
                register={register}
                styles={mergeStyles(styles, {})}
              />
            </DefaultFieldset>
          </div>
        </div>
        <DefaultFieldset>
          <DefaultInput
            name="investor_jmeno"
            label="název investora"
            placeholder="jméno investora"
            register={register}
            overrides={{ input: tw`w-7/12` }}
          />
          <DefaultInput
            name="investor_kontakt"
            label="zástupce investora"
            placeholder="zástupce investora"
            register={register}
            overrides={{ input: tw`w-7/12` }}
          />
          <DefaultInput
            name="investor_adresa"
            label="sídlo investora"
            placeholder="sídlo investora"
            register={register}
            overrides={{ input: tw`w-7/12` }}
          />
          <DefaultInput
            name="investor_ico"
            label="IČO investora"
            placeholder="IČO investora"
            register={register}
          />
        </DefaultFieldset>
        <div tw="flex">
          <div tw="w-4/12">
            <DefaultFieldset>
              <DefaultInput
                name="datum_pocatku_text"
                label="předběžné datum počátku"
                register={register}
              />
              <div className="fieldWrapper" css={[styles.fieldWrapper]}>
                <div className="labelWrapper" css={[styles.labelWrapper]}>
                  <label css={[styles.label]}>datum počátku</label>
                </div>
                <div
                  className="inputWrapper"
                  css={css`
                    ${styles.inputWrapper}
                    & .DayPickerInput {
                      ${tw`relative after:(absolute inset-y-0 right-0 w-4 h-full mr-2 opacity-25 fill-current background[url(/images/calendar-solid.svg) no-repeat center])`}
                      & input {
                        ${styles.input}
                      }
                    }
                    & .DayPicker {
                      font-size: small;
                    }
                    & .DayPickerInput-Overlay {
                      bottom: 100%;
                      left: 100%;
                    }
                  `}
                >
                  <Controller
                    tw="border border-gray-200 text-gray-500 rounded-sm py-0.5 px-1.5 width[24ch] focus:(border-transparent outline-none ring ring-2 transition-shadow duration-300)"
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
              <DefaultInput
                type="text"
                name="datum_ukonceni_text"
                label="předběžné datum ukončení"
                register={register}
              />
              <div className="fieldWrapper" css={[styles.fieldWrapper]}>
                <div className="labelWrapper" css={[styles.labelWrapper]}>
                  <label css={[styles.label]}>datum ukončení</label>
                </div>
                <div
                  className="inputWrapper"
                  css={css`
                    ${styles.inputWrapper}
                    & .DayPickerInput {
                      ${tw`relative after:(absolute inset-y-0 right-0 w-4 h-full mr-2 opacity-25 fill-current background[url(/images/calendar-solid.svg) no-repeat center])`}
                      & input {
                        ${styles.input}
                      }
                    }
                    & .DayPicker {
                      font-size: small;
                    }
                    & .DayPickerInput-Overlay {
                      bottom: 100%;
                      left: 100%;
                    }
                  `}
                >
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
                name="user_id"
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
                styles={mergeStyles(styles, {})}
              />
            </DefaultFieldset>
          </div>
          <div>
            <DefaultFieldset>
              <DefaultInput
                name="katastr"
                label="katastr"
                placeholder="katastr"
                register={register}
              />
              <DefaultInput
                type="text"
                name="okres"
                label="okres"
                placeholder="okres"
                register={register}
              />
              <DefaultInput
                type="text"
                name="kraj"
                label="kraj"
                placeholder="kraj"
                register={register}
              />
            </DefaultFieldset>
          </div>
        </div>
      </form>
      <Modal
        isOpen={isModalOpen}
        shouldCloseOnOverlayClick={true}
        onRequestClose={() => setIsModalOpen(false)}
        closeTimeoutMS={500}
      >
        <header tw="flex justify-between p-6">
          <h2 tw="text-lg font-medium">Odstranit akci</h2>
          <ModalCloseButton handleClick={() => setIsModalOpen(false)} />
        </header>
        <ProjectDeleteDialog
          onModalClose={() => setIsModalOpen(false)}
          detail={detail}
          userId={userId}
        />
      </Modal>
    </DetailWrapper>
  )
}

export default Detail
