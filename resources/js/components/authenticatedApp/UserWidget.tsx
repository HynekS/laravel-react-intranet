import { Dropdown, DropdownItem } from "../../components/common/Dropdown"
import { LogoutIcon } from "@heroicons/react/solid"
import { logout } from "@store/auth"
import { useNavigate } from "react-router"

import { useAppSelector, useAppDispatch } from "@hooks/useRedux"

const UserWidget = () => {
  const user = useAppSelector(store => store.auth.user)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  return user ? (
    <section tw="flex items-center px-2">
      <div
        tw="mr-3 border-2 border-gray-200 rounded-full bg-lightblue-200 w-9 h-9"
        style={{ backgroundImage: `url(/storage/${user.avatar_path})` }}
      ></div>
      <div tw="py-2 text-sm font-semibold text-gray-500">{user.full_name}</div>
      <Dropdown tw="my-auto">
        <DropdownItem
          label="odhlásit&nbsp;se"
          onClick={() => dispatch(logout(navigate))}
          Icon={LogoutIcon}
        />
      </Dropdown>
    </section>
  ) : null
}

export default UserWidget
