import { useState, useEffect, useRef, Dispatch, SetStateAction } from "react"
import { useForm, Controller } from "react-hook-form"
import { useNavigate } from "react-router"
import { css } from "@emotion/react"
import tw from "twin.macro"

import { parse, isValid } from "date-fns"
import cs from "date-fns/locale/cs"
import ReactDatePicker, { registerLocale } from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

import { useAppSelector, useAppDispatch } from "@hooks/useRedux"
import { createProject, updateProject } from "@store/projects"
import { fetchActiveUsers } from "@store/users"
import pick from "@utils/pick"

import DetailWrapper from "./DetailWrapper"
import Button from "../common/Button"
import Select from "../common/Select"
import triggerToast from "../common/Toast"
import { DefaultInput, DefaultFieldset, mergeStyles, styles } from "./DefaultInputs"

import type { akce as Akce, users as User } from "@codegen"

registerLocale("cs-CZ", cs)

const detailFields = [
  "id_akce",
  "nazev_akce",
  "objednavka",
  "objednavka_cislo",
  "objednavka_info",
  "smlouva",
  "rozpocet_B",
  "rozpocet_A",
  "registrovano_bit",
  "registrace_info",
  "id_stav",
  "nalez",
  "investor_jmeno",
  "investor_kontakt",
  "investor_adresa",
  "investor_ico",
  "datum_pocatku_text",
  "datum_pocatku",
  "datum_ukonceni_text",
  "datum_ukonceni",
  "user_id",
  "katastr",
  "okres",
  "kraj",
] as const

function parseDate(str: string, format: string) {
  const parsed = parse(str, format, new Date())

  if (isValid(parsed)) {
    return parsed
  }
  return undefined
}

function formatDateAsdMyyyy(date: Date) {
  return `${date.getDate()}. ${date.getMonth() + 1}. ${date.getFullYear()}`
}

type Detail = Akce & { user: User }

type DetailProps = {
  detail?: Akce & { user: User }
  type: "update" | "create"
  setProjectTitle: Dispatch<SetStateAction<string>>
}

const Detail = ({
  detail = {} as Detail,
  type = "update",
  setProjectTitle = () => {
    return ""
  },
}: DetailProps) => {
  const defaultValues = pick(detail, ...detailFields)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const userId = useAppSelector(store => store.auth.user!.id)
  const activeUsers = useAppSelector(store => store.users.activeUsers)
  const [isPending, setIsPending] = useState(false)

  const { register, control, handleSubmit, setError, formState, getValues, setValue } =
    useForm<Akce>({
      defaultValues,
      mode: "onTouched",
    })

  // TODO submit only dirty fields
  const { errors, dirtyFields, isDirty, touchedFields } = formState

  const { id_akce: id } = detail

  const dirtyRef = useRef(false)
  dirtyRef.current = isDirty

  useEffect(() => {
    ;(["datum_pocatku", "datum_ukonceni"] as const).forEach(field => {
      if (detail[field] && isValid(new Date(detail[field]!)))
        setValue(field, new Date(detail[field]!))
    })
  }, [])

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
      if (type === "update" && isDirty) {
        onSubmit(getValues())
      }
    }
  }, [JSON.stringify(touchedFields)])

  const submitOnUnmount = () => {
    ;(document.activeElement as HTMLElement)?.blur()
    if (type === "update" && dirtyRef.current) {
      onSubmit(getValues())
    }
  }

  const onSubmit = (data: Akce /*Partial<Pick<Akce, typeof detailFields[number]>>*/) => {
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
      <form onSubmit={handleSubmit(onSubmit)} tw="pt-4 pb-3">
        <div tw="flex items-start justify-end">
          <div tw="flex items-center">
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
              label="název akce"
              placeholder="název akce"
              error={errors}
              overrides={{ input: tw`w-7/12` }}
              {...register("nazev_akce", {
                required: { value: true, message: "toto pole je třeba vyplnit" },
              })}
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
                label="objednávka"
                // TODO these overrides should be defaults for checkboxes
                overrides={{
                  input: tw`appearance-none h-3 w-3 checked:(bg-blue-500 border-blue-500) transition duration-200 my-1 p-1.5 align-top bg-no-repeat bg-center bg-contain float-left cursor-pointer`,
                }}
                {...register("objednavka")}
              />
              <DefaultInput
                label="číslo objednávky"
                placeholder="číslo objednávky"
                {...register("objednavka_cislo")}
              />
              <DefaultInput
                label="objednávka info"
                placeholder="objednávka info"
                {...register("objednavka_info")}
              />
              <DefaultInput
                type="checkbox"
                label="smlouva podepsána"
                // TODO these overrides should be defaults for checkboxes
                overrides={{
                  input: tw`appearance-none h-3 w-3 checked:(bg-blue-500 border-blue-500) transition duration-200 my-1 p-1.5 align-top bg-no-repeat bg-center bg-contain float-left cursor-pointer`,
                }}
                {...register("smlouva")}
              />
              <DefaultInput
                label="rozpočet dohledy"
                placeholder="Rozpočet dohledy"
                {...register("rozpocet_B")}
              />
              <DefaultInput
                label="rozpočet výzkum"
                placeholder="Rozpočet výzkum"
                {...register("rozpocet_A")}
              />
            </DefaultFieldset>
          </div>
          <div>
            <DefaultFieldset>
              <DefaultInput
                type="checkbox"
                label="registrováno v databázi"
                // TODO these overrides should be defaults for checkboxes
                overrides={{
                  input: tw`appearance-none h-3 w-3 checked:(bg-blue-500 border-blue-500) transition duration-200 my-1 p-1.5 align-top bg-no-repeat bg-center bg-contain float-left cursor-pointer`,
                }}
                {...register("registrovano_bit")}
              />
              <DefaultInput
                label="id registrace"
                placeholder="id registrace"
                overrides={{ input: tw`width[26ch]` }}
                {...register("registrace_info")}
              />
            </DefaultFieldset>
            <DefaultFieldset>
              <Select
                label="stav"
                placeholder="stav"
                options={[
                  { label: "❌ -1 (akce padla)", value: -1 },
                  { label: "⏰ 1 (před zahájením)", value: 1 },
                  { label: "⛏️ 2 (zahájeno v terénu)", value: 2 },
                  { label: "💻 3 (probíhá zpracování)", value: 3 },
                  { label: "✔️ 4 (hotovo)", value: 4 },
                ]}
                styles={mergeStyles(styles, { input: tw`width[26ch]` })}
                {...register("id_stav")}
              />
              <div css={[styles.fieldWrapper]}>
                <div css={[styles.labelWrapper]}>
                  <label htmlFor="nalez" css={[styles.label]}>
                    nález
                  </label>
                </div>
                <div
                  css={css`
                    ${styles.inputWrapper}
                    & label {
                      transition: all 0.2s ease-in-out;
                    }
                    & input[value="0"] {
                      &:checked + label {
                        ${tw`text-red-700 bg-red-50 border-transparent`}
                        box-shadow: 0 0 0 1px rgba(185, 28, 28, 0.4);
                      }
                      &:focus + label {
                        box-shadow: 0 0 0 1px rgba(185, 28, 28, 0.4),
                          0 0 2px 2px rgba(185, 28, 28, 0.2);
                      }
                    }
                    & input[value="1"] {
                      &:checked + label {
                        ${tw`text-green-700 bg-green-50 border-transparent`}
                        box-shadow: 0 0 0 1px rgba(47, 133, 90, 0.4);
                      }
                      &:focus + label {
                        box-shadow: 0 0 0 1px rgba(47, 133, 90, 0.4),
                          0 0 2px 2px rgba(47, 133, 90, 0.2);
                      }
                    }
                    & input[value="2"] {
                      &:checked + label {
                        ${tw`text-gray-700 bg-gray-50 border-transparent`}
                        box-shadow: 0 0 0 1px rgba(74, 85, 104, 0.45);
                      }
                      &:focus + label {
                        box-shadow: 0 0 0 1px rgba(74, 85, 104, 0.4),
                          0 0 2px 2px rgba(74, 85, 104, 0.2);
                      }
                    }
                  `}
                >
                  <div tw="relative inline-block">
                    <input
                      type="radio"
                      id={`negativní`}
                      value="0"
                      tw="absolute w-0 appearance-none"
                      {...register("nalez")}
                    />
                    <label
                      htmlFor={`negativní`}
                      tw="inline-block px-4 py-2 border border-l-0 border-gray-300 border-solid border-l rounded-l-lg"
                    >
                      negativní
                    </label>
                  </div>
                  <div tw="relative inline-block">
                    <input
                      type="radio"
                      id={`pozitivní`}
                      value="1"
                      tw="absolute w-0 appearance-none"
                      {...register("nalez")}
                    />
                    <label
                      htmlFor={`pozitivní`}
                      tw="inline-block px-4 py-2 border border-l-0 border-gray-300 border-solid"
                    >
                      pozitivní
                    </label>
                  </div>
                  <div tw="relative inline-block">
                    <input
                      type="radio"
                      id={`nezjištěno`}
                      value="2"
                      tw="absolute w-0 appearance-none"
                      {...register("nalez")}
                    />
                    <label
                      htmlFor={`nezjištěno`}
                      tw="inline-block px-4 py-2 border border-l-0 border-gray-300 border-solid rounded-r-lg"
                    >
                      nezjištěno
                    </label>
                  </div>
                </div>
              </div>
            </DefaultFieldset>
          </div>
        </div>
        <DefaultFieldset>
          <DefaultInput
            label="název investora"
            placeholder="jméno investora"
            overrides={{ input: tw`w-7/12` }}
            {...register("investor_jmeno")}
          />
          <DefaultInput
            label="zástupce investora"
            placeholder="zástupce investora"
            overrides={{ input: tw`w-7/12` }}
            {...register("investor_kontakt")}
          />
          <DefaultInput
            label="sídlo investora"
            placeholder="sídlo investora"
            overrides={{ input: tw`w-7/12` }}
            {...register("investor_adresa")}
          />
          <DefaultInput
            label="IČO investora"
            placeholder="IČO investora"
            {...register("investor_ico")}
          />
        </DefaultFieldset>
        <div
          tw="flex"
          css={css`
            .react-datepicker {
              ${tw`border-gray-200 shadow-lg`};
            }
            .react-datepicker,
            .react-datepicker__current-month,
            .react-datepicker-time__header,
            .react-datepicker-year-header {
              color: inherit;
            }
            .react-datepicker__header {
              ${tw`border-b-gray-200`}
            }
            .react-datepicker__header,
            .react-datepicker__today-button {
              ${tw`bg-gray-100`}
            }
            [class*="--keyboard-selected"] {
              ${tw`bg-blue-100 text-blue-700`}
              &:hover {
                ${tw`bg-blue-200 text-blue-900`}
              }
            }
          `}
        >
          <div tw="w-4/12">
            <DefaultFieldset>
              <DefaultInput label="předběžné datum počátku" {...register("datum_pocatku_text")} />
              <div className="fieldWrapper" css={[styles.fieldWrapper]}>
                <div className="labelWrapper" css={[styles.labelWrapper]}>
                  <label css={[styles.label]}>datum počátku</label>
                </div>
                <div className="inputWrapper">
                  <Controller
                    control={control}
                    name="datum_pocatku"
                    render={({ field }) => (
                      <ReactDatePicker
                        onBlur={field.onBlur}
                        dateFormat="d. M. yyyy"
                        locale="cs-CZ"
                        showTimeSelect={false}
                        dropdownMode="select"
                        placeholderText={formatDateAsdMyyyy(new Date())}
                        shouldCloseOnSelect
                        customInput={<input css={[styles.input]} />}
                        onChange={date => {
                          // Using this method results in inverted day and month.
                          // But it still needs to be used for clearing the input field (when using the button).
                          if (date === null) field.onChange(date)
                        }}
                        onChangeRaw={e => {
                          const trimmedInput = String(e.target.value).trim()
                          const maybeADate =
                            /^\d{1,2}\.\s*\d{1,2}\.\s*\d{4}$/.test(trimmedInput) &&
                            parseDate(trimmedInput.replace(/\s/g, ""), "d.M.yyyy")
                          if (maybeADate) {
                            field.onChange(maybeADate)
                            setValue("datum_pocatku", maybeADate, { shouldTouch: true })
                          }
                        }}
                        onSelect={date => {
                          field.onChange(date)
                          setValue("datum_pocatku", date, { shouldTouch: true })
                        }}
                        {...(field.value && isValid(field.value)
                          ? { selected: new Date(field.value) }
                          : {})}
                      />
                    )}
                  />
                </div>
              </div>
              <DefaultInput label="předběžné datum ukončení" {...register("datum_ukonceni_text")} />
              <div className="fieldWrapper" css={[styles.fieldWrapper]}>
                <div className="labelWrapper" css={[styles.labelWrapper]}>
                  <label css={[styles.label]}>datum ukončení</label>
                </div>
                <div className="inputWrapper">
                  <Controller
                    control={control}
                    name="datum_ukonceni"
                    render={({ field }) => (
                      <ReactDatePicker
                        onBlur={field.onBlur}
                        dateFormat="d. M. yyyy"
                        locale="cs-CZ"
                        showTimeSelect={false}
                        dropdownMode="select"
                        placeholderText={formatDateAsdMyyyy(new Date())}
                        shouldCloseOnSelect
                        customInput={<input css={[styles.input]} />}
                        onChange={date => {
                          // Using this method results in inverted day and month.
                          // But it still needs to be used for clearing the input field (when using the button).
                          if (date === null) field.onChange(date)
                        }}
                        onChangeRaw={e => {
                          const trimmedInput = String(e.target.value).trim()
                          const maybeADate =
                            /^\d{1,2}\.\s*\d{1,2}\.\s*\d{4}$/.test(trimmedInput) &&
                            parseDate(trimmedInput.replace(/\s/g, ""), "d.M.yyyy")
                          if (maybeADate) {
                            field.onChange(maybeADate)
                            setValue("datum_ukonceni", maybeADate, { shouldTouch: true })
                          }
                        }}
                        onSelect={date => {
                          field.onChange(date)
                          setValue("datum_ukonceni", date, { shouldTouch: true })
                        }}
                        {...(field.value && isValid(field.value)
                          ? { selected: new Date(field.value) }
                          : {})}
                      />
                    )}
                  />
                </div>
              </div>
              <Select
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
                styles={mergeStyles(styles, {})}
                {...register("user_id")}
              />
            </DefaultFieldset>
          </div>
          <div>
            <DefaultFieldset>
              <DefaultInput label="katastr" placeholder="katastr" {...register("katastr")} />
              <DefaultInput label="okres" placeholder="okres" {...register("okres")} />
              <DefaultInput label="kraj" placeholder="kraj" {...register("kraj")} />
            </DefaultFieldset>
          </div>
        </div>
      </form>
    </DetailWrapper>
  )
}

export default Detail
