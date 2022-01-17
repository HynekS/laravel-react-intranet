/** @jsx jsx */
import React from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { jsx } from "@emotion/core"
import tw from "twin.macro"

import { logout } from "../../store/auth"
import SvgLogout from "../../vendor/heroicons/outline/Logout"

import type { AppState } from "../../store/rootReducer"

const Button = tw.button`flex items-center bg-blue-500 hover:bg-blue-700 transition-colors duration-300 text-white font-medium py-2 px-4 rounded focus:(outline-none shadow-outline)`

const Logout = () => {
  const dispatch = useDispatch()
  const pending = useSelector((store: AppState) => store.auth.isLogoutPending)
  const navigate = useNavigate()

  return (
    <Button
      type="button"
      className={`${pending ? "spinner" : ""}`}
      onClick={() => dispatch(logout(navigate))}
    >
      <SvgLogout tw="w-4 mr-2" />
      <span tw="pr-2">Odhlášení</span>
    </Button>
  )
}

export default Logout
