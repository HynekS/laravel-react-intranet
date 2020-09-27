import React from "react"

import Header from "./Header"
import Nav from "./Nav"
import Main from "./Main"
import RootFlexWrapper from "./RootFlexWrapper"
import HeaderFlexWrapper from "./HeaderFlexWrapper"
import ContentFlexWrapper from "./ContentFlexWrapper"

import AuthenticatedRoutes from "./Routes"

const Layout = props => {
  return (
    <RootFlexWrapper>
      <HeaderFlexWrapper>
        <Header>
          <Nav />
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
