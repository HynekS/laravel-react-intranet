// @ts-check
import React from "react"
import { Routes, Route } from "react-router-dom"

import Dashboard from "../dashboard/Dashboard"
import CreateProjectView from "../project/CreateProjectView"
const TableDataProvider = React.lazy(() => import(/* webpackChunkName: 'TableProvider' */ "../project/TableDataProvider"))
const DetailProvider = React.lazy(() => import(/* webpackChunkName: 'DetailProvider' */ "../project/DetailProvider"))

const AuthenticatedRoutes = props => (
  <React.Suspense fallback={<div>I aM tHe SusPEnSE !!!</div>}>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/vytvorit-akci" element={<CreateProjectView />}/>
      <Route path="/akce" element={<TableDataProvider />} />
      <Route path="/akce/:year" element={<TableDataProvider />} />
      <Route path="/akce/:year/:num/*" element={<DetailProvider />} />
    </Routes>
  </React.Suspense>
)

export default AuthenticatedRoutes
