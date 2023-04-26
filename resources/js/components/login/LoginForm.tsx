import { useState } from "react"

import { useForm } from "react-hook-form"
import { EyeIcon } from "@heroicons/react/solid"
import { EyeOffIcon } from "@heroicons/react/solid"

import { useAppSelector, useAppDispatch } from "@hooks/useRedux"
import Logo from "./Logo"
import Button from "../../components/common/Button"
import HiddenMessage from "../common/HiddenMessage"
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
    formState: { errors },
  } = useForm<{ user_name: string; password: string }>()
  const formRef = useFocusNextOnEnter()
  const onSubmit = (data: { user_name: string; password: string }) =>
    dispatch(submitLoginData(data))

  return (
    <div tw="relative z-10 w-full max-w-xs">
      <form
        onSubmit={handleSubmit(onSubmit)}
        ref={formRef}
        tw="px-10 pt-8 pb-10 mb-4 bg-white rounded shadow-xl"
      >
        <Logo />
        {error && <div tw="pb-2 text-sm text-red-600">{error.message}</div>}
        <label htmlFor="user_name" tw="block mb-2 text-sm font-bold text-gray-700">
          Uživatelské jméno
        </label>
        <input
          type="text"
          {...register('user_name', { required: true })}
          id="user_name"
          autoComplete="on"
          placeholder="Jan Novák"
          autoFocus={true}
          tw="bg-gray-200 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:(outline-none ring transition-shadow duration-300)" />
        <HiddenMessage show={errors.user_name}>
          <div tw="pb-2 text-sm text-red-600">Zadejte, prosím, uživatelské jméno.</div>
        </HiddenMessage>
        <label htmlFor="password" tw="block mb-2 text-sm font-bold text-gray-700">
          Heslo
        </label>
        <div tw="relative">
          <input
            type={passwordShown ? "text" : "password"}
            {...register('password', { required: true })}
            id="password"
            autoComplete="on"
            placeholder="*******"
            tw="bg-gray-200 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:(outline-none ring transition-shadow duration-300)" />
          <button
            type="button"
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
  );
}

export default LoginForm
