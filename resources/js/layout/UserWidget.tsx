import { Dropdown, DropdownItem } from "@components/Dropdown"
import { LogoutIcon } from "@heroicons/react/solid"
import { logout } from "@store/auth"
import { useNavigate } from "react-router"

import { useAppSelector, useAppDispatch } from "@hooks/useRedux"

const UserWidget = () => {
  const user = useAppSelector(store => store.auth.user)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  return user ? (
    <section tw="flex items-center px-2 border-t pt-4 md:(border-t-0 pt-0)">
      <div
        tw="rounded-full bg-lightblue-200 w-9 h-9 md:mr-3"
        style={{ backgroundImage: `url(/storage/${user.avatar_path})` }}
      ></div>
      <div tw="hidden py-2 text-sm font-semibold text-gray-500 md:block">{user.full_name}</div>
      <Dropdown tw="hidden my-auto md:block">
        <DropdownItem
          label="odhlásit&nbsp;se"
          onClick={() => dispatch(logout(navigate))}
          Icon={LogoutIcon}
        />
      </Dropdown>
      <button
        tw="flex items-center px-4 py-2 text-sm font-semibold text-gray-500 md:hidden"
        onClick={() => dispatch(logout(navigate))}
      >
        <span> odhlásit&nbsp;se</span>
        <LogoutIcon tw="w-4 h-4 ml-2" />
      </button>
    </section>
  ) : null
}

export default UserWidget
