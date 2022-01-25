import type { users as User } from "@/types/model"

type Props = {
  user: User
  children: React.ReactNode
}

const UserWidget = ({ user, children }: Props) => {
  return (
    <section tw="flex">
      <div tw="py-2 px-4">Přihlášený uživatel: {user.full_name}</div>
      {children}
    </section>
  )
}

export default UserWidget
