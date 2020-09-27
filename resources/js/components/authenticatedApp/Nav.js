/** @jsx jsx */
import React from "react"
import { NavLink } from "react-router-dom"
import { useSelector } from "react-redux"
import styled from "@emotion/styled"
import { jsx } from "@emotion/core"
import tw from "twin.macro"

import UserWidget from "./UserWidget"
import LogoThumb from "../common/LogoThumb"
import Logout from "./Logout"

const Container = tw.section`flex flex-wrap justify-between py-2 px-4 border-b`
const StyledNavLink = styled(NavLink)`
  ${tw`p-2 text-blue-500 hover:text-blue-800`}
  &.active {
    ${tw`bg-gray-200`}
  }
`
const NavContainer = tw.nav`py-2 px-4 flex flex-wrap`

const Nav = ({ ...props }) => {
  const user = useSelector(store => store.auth.user)

  const currentYear = new Date().getFullYear()
  return (
    <Container role="navigation" aria-label="main navigation">
      <div>
        <NavLink to="/" aria-label="návrat na domovskou stránku">
          <LogoThumb />
        </NavLink>
      </div>
      <NavContainer>
        <StyledNavLink to={`/akce`}>vše</StyledNavLink>
        {Array.from({ length: currentYear - 2013 }, (_, i) => currentYear - i).map((year, i) => (
          <StyledNavLink
            to={`/akce/${year}`}
            key={year}
            aria-label={`akce proběhlé v roce ${year}`}
          >
            {year}
          </StyledNavLink>
        ))}
      </NavContainer>
      <div>
        <NavLink to="vytvorit-akci" aria-label="vytvořit novou akci">
          + vytvořit novou akci
        </NavLink>
        {user && (
          <UserWidget user={user}>
            <Logout />
          </UserWidget>
        )}
      </div>
    </Container>
  )
}

export default Nav
