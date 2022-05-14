import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import tw from "twin.macro"

import Button from "../../components/common/Button"
import { logout } from "../../store/auth"
import { LogoutIcon } from "@heroicons/react/outline"

import type { AppState } from "../../store/rootReducer"

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
      <LogoutIcon tw="w-4 mr-2" />
      <span tw="pr-2">Odhlášení</span>
    </Button>
  )
}

export default Logout
