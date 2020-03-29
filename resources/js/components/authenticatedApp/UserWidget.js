import React from "react"
import tw from "twin.macro"

const Widget = tw.div`flex`

const UserWidget = ({ user, children }) => {
  return (
    <Widget>
      <p>Přihlášený uživatel: {user.full_name}</p>
      {children}
    </Widget>
  )
}

export default UserWidget
