import React from "react"
import { useDispatch } from "react-redux"
import tw from "twin.macro"

import { logout } from "../../store/auth"

const Button = tw.button`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`

const Logout = () => {
  const dispatch = useDispatch()
  return (
    <Button type="button" onClick={() => dispatch(logout())}>
      Odhlášení
    </Button>
  )
}

export default Logout
