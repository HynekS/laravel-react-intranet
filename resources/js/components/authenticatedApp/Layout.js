import React from "react"
import { Routes, Route } from "react-router-dom"

import Header from "./Header"
import Nav from "./Nav"
import Main from "./Main"
import Table from "../project/Table"
import Dashboard from "../dashboard/Dashboard"

const Layout = props => {
  return (
    <div>
      <Header>
        <Nav></Nav>
      </Header>
      <Main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/akce" element={<Table />} />
          <Route path="/akce/:year" element={<Table />} />
        </Routes>
      </Main>
    </div>
  )
}

export default Layout
