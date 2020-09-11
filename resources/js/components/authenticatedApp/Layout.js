import React from "react"
import { Routes, Route } from "react-router-dom"

import Header from "./Header"
import Nav from "./Nav"
import Main from "./Main"
import Dashboard from "../dashboard/Dashboard"
import RootFlexWrapper from "./RootFlexWrapper"
import HeaderFlexWrapper from "./HeaderFlexWrapper"
import ContentFlexWrapper from "./ContentFlexWrapper"
const TableDataProvider = React.lazy(() => import("../project/TableDataProvider"))
const DetailProvider = React.lazy(() => import("../project/DetailProvider"))

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
          <React.Suspense fallback={<div>I aM tHe SusPEnSE !!!</div>}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/akce" element={<TableDataProvider />} />
              <Route path="/akce/:year" element={<TableDataProvider />} />
              <Route path="/akce/:year/:num/*" element={<DetailProvider />} />
            </Routes>
          </React.Suspense>
        </Main>
      </ContentFlexWrapper>
    </RootFlexWrapper>
  )
}

export default Layout
