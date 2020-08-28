/** @jsx jsx */
import React from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { jsx } from "@emotion/core"
import tw from "twin.macro"

import { logout } from "../../store/auth"
import SvgLogout from "../../vendor/heroicons/outline/Logout"

const Button = tw.button`flex items-center bg-blue-500 hover:bg-blue-700 transition-colors duration-300 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`

const Logout = () => {
  const dispatch = useDispatch()
  const pending = useSelector(store => store.auth.isLogoutPending)
  const navigate = useNavigate()

  return (
    <Button
      type="button"
      className={`${pending ? "spinner" : ""}`}
      onClick={() => dispatch(logout(navigate))}
    >
      <span tw="pr-2">Odhlášení</span>
      <SvgLogout tw="w-4" />
    </Button>
  )
}

export default Logout
