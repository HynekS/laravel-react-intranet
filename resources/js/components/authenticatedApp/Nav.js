import React, { useState } from "react"
import { NavLink } from "react-router-dom"
import { useSelector } from "react-redux"
import styled from "@emotion/styled"
import tw from "twin.macro"

import UserWidget from "./UserWidget"
import LogoThumb from "../common/LogoThumb"
import Logout from "./Logout"

const NavContainer = tw.nav`flex justify-between py-2 px-4 border-b`
const StyledNavLink = styled(NavLink)`
  ${tw`p-2 text-blue-500 hover:text-blue-800`}
  &.active {
    ${tw`bg-gray-200`}
  }
`

const Nav = ({ ...props }) => {
  const user = useSelector(store => store.auth.user)

  const currentYear = new Date().getFullYear()
  return (
    <NavContainer role="navigation" aria-label="main navigation">
      <div>
        <NavLink to="/">
          <LogoThumb />
        </NavLink>
      </div>
      <div>
        <StyledNavLink to={`/akce`}>vše</StyledNavLink>
        {Array.from({ length: currentYear - 2013 }, (_, i) => currentYear - i).map((year, i) => (
          <StyledNavLink to={`/akce/${year}`} key={year}>
            {year}
          </StyledNavLink>
        ))}
      </div>
      <div>
        {user && (
          <UserWidget user={user}>
            <Logout />
          </UserWidget>
        )}
      </div>
    </NavContainer>
  )
}

export default Nav
