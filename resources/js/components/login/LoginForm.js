import React, { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useForm } from "react-hook-form"
import uniqueId from "lodash.uniqueid"
import tw from "twin.macro"

import Logo from "./Logo"
import HiddenMessage from "../common/HiddenMessage"
import { submitLoginData } from "../../store/auth"
import handleEnter from "../../utils/handleEnterKey"

const FormContainer = tw.div`w-full max-w-xs relative z-10`
const Form = tw.form`bg-white shadow-xl rounded px-10 pt-8 pb-10 mb-4`
const Label = tw.label`block text-gray-700 text-sm font-bold mb-2`
const Input = tw.input`bg-gray-200 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:transition-shadow focus:duration-300`
const Submit = tw.button`bg-blue-600 hover:bg-blue-700 text-white w-full font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline focus:transition-shadow focus:duration-300`
const ErrorMessage = tw.div`text-red-600 text-sm pb-2`

const LoginForm = () => {
  const isAuthPending = useSelector(store => store.auth.isAuthPending)
  const error = useSelector(store => store.auth.authError)
  const dispatch = useDispatch()
  const { register, handleSubmit, errors } = useForm()
  const uid = useState(() => uniqueId())
  const onSubmit = (data, e) => dispatch(submitLoginData(data))

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Logo />
        {error && <small>{error.message}</small>}
        <Label htmlFor={"user_name" + uid}>Uživatelské jméno</Label>
        <Input
          type="text"
          name="user_name"
          id={"user_name" + uid}
          autoComplete="on"
          placeholder="Jan Novák"
          ref={register({ required: true })}
          onKeyDown={handleEnter}
        />
        <HiddenMessage show={errors.user_name}>
          <ErrorMessage>Zadejte, prosím, uživatelské jméno.</ErrorMessage>
        </HiddenMessage>
        <Label htmlFor={"password" + uid}>Heslo</Label>
        <Input
          type="password"
          name="password"
          id={"password" + uid}
          autoComplete="on"
          placeholder="*******"
          ref={register({ required: true })}
          onKeyDown={handleEnter}
        />
        <HiddenMessage show={errors.password}>
          <ErrorMessage>Zadejte, prosím, heslo.</ErrorMessage>
        </HiddenMessage>
        <Submit type="submit" className={`${isAuthPending ? "spinner" : ""}`}>
          Přihlásit
        </Submit>
      </Form>
    </FormContainer>
  )
}

export default LoginForm
