import { NavLink } from "react-router-dom"

import Header from "./Header"
import Nav from "./Nav"
import Main from "./Main"
import RootFlexWrapper from "./RootFlexWrapper"
import HeaderFlexWrapper from "./HeaderFlexWrapper"
import ContentFlexWrapper from "./ContentFlexWrapper"
import HomePageLink from "./HomePageLink"
import UserWidget from "./UserWidget"

import AuthenticatedRoutes from "./Routes"

const Layout = () => {
  return (
    <RootFlexWrapper>
      <HeaderFlexWrapper>
        <Header>
          <HomePageLink />
          <Nav />
          <div tw="flex gap-6">
            <NavLink
              to="vytvorit-akci"
              aria-label="vytvořit novou akci"
              tw="px-2 py-1 my-auto text-sm border rounded"
            >
              + vytvořit novou akci
            </NavLink>
            <UserWidget />
          </div>
        </Header>
      </HeaderFlexWrapper>
      <ContentFlexWrapper>
        <Main>
          <AuthenticatedRoutes />
        </Main>
      </ContentFlexWrapper>
    </RootFlexWrapper>
  )
}

export default Layout
