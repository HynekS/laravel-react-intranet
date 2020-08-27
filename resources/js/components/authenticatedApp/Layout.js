import React from "react"
import { Routes, Route } from "react-router-dom"

import Header from "./Header"
import Nav from "./Nav"
import Main from "./Main"
import Dashboard from "../dashboard/Dashboard"
const TableDataProvider = React.lazy(() => import("../project/TableDataProvider"))
const DetailProvider = React.lazy(() => import("../project/DetailProvider"))

const Layout = props => {
  return (
    <div>
      <Header>
        <Nav />
      </Header>
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
    </div>
  )
}

export default Layout
