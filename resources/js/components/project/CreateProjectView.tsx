import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { jsx } from "@emotion/react"
import styled from "@emotion/styled"
import tw from "twin.macro"
import { useSelector, useDispatch } from "react-redux"

import { fetchActiveUsers } from "../../store/meta"
import Input from "../common/Input"

const CreateProjectView = props => {
  const dispatch = useDispatch()
  const activeUsers = useSelector(store => store.meta.activeUsers)
  const { register, handleSubmit, setValue, watch, errors, reset } = useForm({
    defaultValues: {
      id_stav: 1,
      nalez: "null",
    },
  })

  useEffect(() => {
    if (!activeUsers.length) {
      dispatch(fetchActiveUsers())
    }
  }, [])

  const boundTitle = watch("nazev_akce")

  return (
    <div tw="w-full p-8">
      <div tw="p-8 bg-white rounded-lg">
        <h1 tw="text-xl font-semibold text-gray-700">
          {boundTitle?.length ? boundTitle : "Nová akce"}
        </h1>
      </div>
    </div>
  )
}

export default CreateProjectView
