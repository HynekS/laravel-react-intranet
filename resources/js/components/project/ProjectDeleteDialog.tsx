import { useDispatch } from "react-redux"
import { useNavigate } from "react-router"

import { ExclamationIcon } from "@heroicons/react/outline"

import { deleteProject } from "../../store/projects"
import type { akce as Akce, users as User } from "@/types/model"

type Props = {
  onModalClose: React.MouseEventHandler<HTMLButtonElement>
  detail: Akce
  userId: User["id"]
}

const ProjectDeleteDialog = ({ onModalClose, userId, detail }: Props) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id_akce: id, c_akce, nazev_akce, rok_per_year } = detail

  const handleClick = () => {
    return dispatch(
      deleteProject({ id, userId, year: Number(rok_per_year), project: detail }, navigate),
    )
  }

  return (
    <div>
      <div tw="flex items-center p-6">
        <div tw="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full text-red-500 bg-red-100 sm:(mx-0 h-10 w-10)">
          <ExclamationIcon tw="w-6 stroke-current" />
        </div>
        <div tw="px-4">
          Skutečně chcete odstranit akci{" "}
          <span tw="font-semibold truncate">
            {c_akce} {nazev_akce}
          </span>
          ?
        </div>
      </div>
      <footer tw="flex justify-end p-6 bg-gray-100 rounded-lg rounded-t-none">
        <button
          tw="text-gray-500 font-medium py-2 px-4 ml-4 rounded transition-colors duration-300 hover:(text-gray-600) focus:(outline-none ring transition-shadow duration-300)"
          onClick={onModalClose}
        >
          Zrušit
        </button>
        <button
          tw="bg-red-600 transition-colors duration-300 text-white font-medium py-2 px-4 ml-4 rounded hover:(bg-red-700) focus:(outline-none ring transition-shadow duration-300)"
          onClick={handleClick}
          // className={`${isLoading ? "spinner" : ""}`}
        >
          Odstranit akci
        </button>
      </footer>
    </div>
  )
}

export default ProjectDeleteDialog
