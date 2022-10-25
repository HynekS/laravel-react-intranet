import { useState, useEffect, useRef } from "react"
import { useForm, Controller, ManualFieldError, OnSubmit } from "react-hook-form"
import { useNavigate } from "react-router"
import { css } from "@emotion/react"
import tw from "twin.macro"
import DayPickerInput from "react-day-picker/DayPickerInput"
import "react-day-picker/lib/style.css"
import dateFnsFormat from "date-fns/format"
import dateFnsParse from "date-fns/parse"
import { DateUtils } from "react-day-picker"
import { TrashIcon } from "@heroicons/react/solid"

import { useAppSelector, useAppDispatch } from "@hooks/useRedux"
import { createProject, updateProject } from "@store/projects"
import { fetchActiveUsers } from "@store/users"
import { monthsCZ, daysCZ, daysShortCZ } from "@services/date/terms_cs-CZ"

import DetailWrapper from "./DetailWrapper"
import Button from "../common/Button"
import Select from "../common/Select"
import ButtonStyledRadio from "./ButtonStyledRadio"
import { Dropdown, DropdownItem } from "../../components/common/Dropdown"
import Modal from "../common/StyledModal"
import ProjectDeleteDialog from "./ProjectDeleteDialog"
import ModalCloseButton from "../common/ModalCloseButton"
import triggerToast from "../common/Toast"
import { DefaultInput, DefaultFieldset, mergeStyles, styles } from "./DefaultInputs"

import type { akce as Akce, users as User } from "@codegen"

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
  setProjectTitle: React.SetStateAction<string>
}

function transformDefaultValues(original: Akce | undefined) {
  let obj = { ...original }
  if (!obj) return {}
  ;(Object.keys(obj) as Array<keyof Akce>).forEach((k: keyof Akce) => {
    if (obj[k] instanceof Object) {
      // (unneccessary in practise)
      return transformDefaultValues(obj[k])
    }
    if (["datum_pocatku", "datum_ukonceni"].includes(k)) {
      // Date objects
      obj[k] = new Date(obj[k])
      // TODO migrate all 'chackbox' fielsd to booleans
    } else if (["objednavka", "smlouva", "registrovano_bit"].includes(k)) {
      // checkboxes
      obj[k] = Boolean(obj[k])
    } else {
      // other inputs
      obj[k] = obj[k] ? String(obj[k]) : ""
    }
  })

  return obj
}

const Detail = ({
  detail = {} as Detail,
  type = "update",
  setProjectTitle = () => {
    return ""
  },
}: DetailProps) => {
  const defaultValues = transformDefaultValues(detail)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const userId = useAppSelector(store => store.auth.user!.id)
  const activeUsers = useAppSelector(store => store.users.activeUsers)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const getValuesRef = useRef(null)

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    setError,
    errors,
    formState,
    getValues,
  } = useForm<Akce>({ defaultValues })

  const { touched } = formState

  useEffect(() => {
    getValuesRef.current = getValues
  })

  const { id_akce: id } = detail

  useEffect(() => {
    if (!activeUsers.length) {
      dispatch(fetchActiveUsers())
    }
  }, [])

  useEffect(() => {
    window.addEventListener("beforeunload", submitOnUnmount)
    return () => {
      window.removeEventListener("beforeunload", submitOnUnmount)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (type === "update" && isFormDirty()) {
        onSubmit(getValues())
      }
    }
  }, [JSON.stringify(touched)])

  const submitOnUnmount = () => {
    ;(document.activeElement as HTMLElement)?.blur()
    if (type === "update" && isFormDirty()) {
      onSubmit(getValues())
    }
  }

  const isFormDirty = () => {
    let isDirty = false
    let currentValues = getValues()
    for (let key of Object.keys(currentValues) as Array<keyof Akce>) {
      if (String(defaultValues[key]) !== String(currentValues[key])) {
        isDirty = true
        break
      }
    }
    return isDirty
  }

  const onSubmit = (data: Akce) => {
    if (type === "update")
      return dispatch(updateProject({ id, userId, project: data }))
        .unwrap()
        .then(() => {})
    if (type === "create") setIsPending(true)
    return dispatch(createProject({ navigate, userId, project: data }))
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
          })) as ManualFieldError<Akce>[],
        )
        triggerToast({
          type: "error",
          message: err.message,
          options: { duration: 3000 },
        })
      })
  }

  const dateValues = watch(["datum_pocatku", "datum_ukonceni"])

  return (
    <DetailWrapper>
      <form onSubmit={handleSubmit(onSubmit)} tw="pb-4">
        <div tw="flex items-start justify-between">
          <div tw="flex items-center">
            {type === "update" && (
              <Dropdown tw="my-auto mr-4">
                <DropdownItem
                  onClick={() => {
                    setIsModalOpen(true)
                  }}
                  Icon={TrashIcon}
                  label="Odstranit&nbsp;akci"
                />
              </Dropdown>
            )}
            {type === "create" ? (
              <Button type="submit" className={isPending ? "spinner" : ""} disabled={isPending}>
                Vytvořit&nbsp;akci
              </Button>
            ) : null}
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
              onChange={({ target }) => {
                setProjectTitle(target.value)
              }}
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
                      formState.touched["datum_pocatku"] = true
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
                      formState.touched["datum_ukonceni"] = true
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
