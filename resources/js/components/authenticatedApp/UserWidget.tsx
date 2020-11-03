import React from "react"
import tw from "twin.macro"

const Widget = tw.section`flex`
const User = tw.section`py-2 px-4`

const UserWidget = ({ user, children }) => {
  return (
    <Widget>
      <User>Přihlášený uživatel: {user.full_name}</User>
      {children}
    </Widget>
  )
}

export default UserWidget
