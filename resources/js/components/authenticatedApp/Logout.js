import React from "react"
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux"
import tw from "twin.macro"

import { logout } from "../../store/auth"

const Button = tw.button`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`

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
      Odhlášení
    </Button>
  )
}

export default Logout
