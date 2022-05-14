import { useSelector, useDispatch } from "react-redux"
import { useForm } from "react-hook-form"

import Logo from "./Logo"
import Button from "../../components/common/Button"
import HiddenMessage from "../common/HiddenMessage"
import { submitLoginData } from "../../store/auth"
import useFocusNextOnEnter from "../../hooks/useFocusNextOnEnter"

import type { AppState } from "../../store/rootReducer"

const LoginForm = () => {
  const isAuthPending = useSelector((store: AppState) => store.auth.isAuthPending)
  const error = useSelector((store: AppState) => store.auth.authError)
  const dispatch = useDispatch()
  const { register, handleSubmit, errors } = useForm()
  const formRef = useFocusNextOnEnter()
  const onSubmit = data => dispatch(submitLoginData(data))

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
          name="user_name"
          id="user_name"
          autoComplete="on"
          placeholder="Jan Novák"
          ref={register({ required: true })}
          autoFocus={true}
          tw="bg-gray-200 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:(outline-none ring transition-shadow duration-300)"
        />
        <HiddenMessage show={errors.user_name}>
          <div tw="pb-2 text-sm text-red-600">Zadejte, prosím, uživatelské jméno.</div>
        </HiddenMessage>
        <label htmlFor="password" tw="block mb-2 text-sm font-bold text-gray-700">
          Heslo
        </label>
        <input
          type="password"
          name="password"
          id="password"
          autoComplete="on"
          placeholder="*******"
          ref={register({ required: true })}
          tw="bg-gray-200 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:(outline-none ring transition-shadow duration-300)"
        />
        <HiddenMessage show={errors.password}>
          <div tw="pb-2 text-sm text-red-600">Zadejte, prosím, heslo.</div>
        </HiddenMessage>
        <Button
          type="submit"
          className={`${isAuthPending ? "spinner" : ""}`}
          disabled={isAuthPending}
          tw="justify-center w-full"
        >
          Přihlásit
        </Button>
      </form>
    </div>
  )
}

export default LoginForm
