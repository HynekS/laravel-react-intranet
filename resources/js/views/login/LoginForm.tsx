import { useState } from "react"

import { useForm } from "react-hook-form"
import { EyeIcon } from "@heroicons/react/solid"
import { EyeOffIcon } from "@heroicons/react/solid"

import { useAppSelector, useAppDispatch } from "@hooks/useRedux"
import StickyNote from "./StickyNote"
import Button from "@components/Button"
import HiddenMessage from "@components/HiddenMessage"
import { submitLoginData } from "@store/auth"
import useFocusNextOnEnter from "@hooks/useFocusNextOnEnter"

const LoginForm = () => {
  const [passwordShown, setPasswordShown] = useState(false)
  const status = useAppSelector(store => store.auth.status)
  const error = useAppSelector(store => store.auth.error)
  const dispatch = useAppDispatch()
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<{ user_name: string; password: string }>()
  const formRef = useFocusNextOnEnter()
  const onSubmit = (data: { user_name: string; password: string }) =>
    dispatch(submitLoginData(data))

  const fillAndSubmitDemoCredentials = () => {
    setValue("user_name", "demo")
    setValue("password", "CorrectHorseBatteryStaple")
    onSubmit({ user_name: "demo", password: "CorrectHorseBatteryStaple" })
  }

  return (
    <div tw="relative z-10 w-full max-w-xs">
      <StickyNote onClick={fillAndSubmitDemoCredentials} />
      <form
        onSubmit={handleSubmit(onSubmit)}
        ref={formRef}
        tw="px-10 pt-8 pb-10 mb-4 bg-white rounded shadow-xl"
      >
        <div tw="h-20">
          <img src="/images/logoipsum-237.svg" tw="w-full pl-3 pr-6" />
        </div>
        {error && <div tw="pb-2 text-sm text-red-600">{error.message}</div>}
        <label htmlFor="user_name" tw="block mb-2 text-sm font-bold text-gray-700">
          Uživatelské jméno
        </label>
        <input
          id="user_name"
          autoComplete="on"
          placeholder="Jan Novák"
          autoFocus={true}
          tw="appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:(border-transparent outline-none ring-2 transition-shadow duration-300)"
          {...register("user_name", { required: true })}
        />
        <HiddenMessage show={errors.user_name}>
          <div tw="pb-2 text-sm text-red-600">Zadejte, prosím, uživatelské jméno.</div>
        </HiddenMessage>
        <label htmlFor="password" tw="block mb-2 text-sm font-bold text-gray-700">
          Heslo
        </label>
        <div tw="relative">
          <input
            type={passwordShown ? "text" : "password"}
            id="password"
            autoComplete="on"
            placeholder="*******"
            tw="appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:(border-transparent outline-none ring-2 transition-shadow duration-300)"
            {...register("password", { required: true })}
          />
          <button
            type="button"
            data-skipEnterFocus={true}
            tw="absolute top-0 bottom-0 text-gray-400 right-2"
            aria-label="show password"
            onClick={() => setPasswordShown(!passwordShown)}
          >
            {passwordShown ? <EyeOffIcon tw="w-4 h-4" /> : <EyeIcon tw="w-4 h-4" />}
          </button>
        </div>
        <HiddenMessage show={errors.password}>
          <div tw="pb-2 text-sm text-red-600">Zadejte, prosím, heslo.</div>
        </HiddenMessage>
        <Button
          type="submit"
          className={`${status === "pending" ? "spinner" : ""}`}
          disabled={status === "pending"}
          tw="justify-center w-full"
        >
          Přihlásit
        </Button>
      </form>
    </div>
  )
}

export default LoginForm
