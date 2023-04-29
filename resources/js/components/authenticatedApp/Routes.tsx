import React from "react"
import { Routes, Route } from "react-router-dom"

import Dashboard from "../dashboard/Dashboard"
import CreateProjectPage from "../project/CreateProjectPage"

const TableDataProvider = React.lazy(
  () => import(/* webpackChunkName: 'TableProvider' */ "../project/TableDataProvider"),
)

const Detail = React.lazy(() => import(/* webpackChunkName: 'Detail' */ "../project/Detail"))

const DetailProvider = React.lazy(
  () => import(/* webpackChunkName: 'DetailProvider' */ "../project/DetailProvider"),
)

const AuthenticatedRoutes = () => (
  <React.Suspense
    fallback={<div tw="flex items-center justify-center w-full h-full">Loading…</div>}
  >
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/vytvorit-akci" element={<CreateProjectPage />} />
      <Route path="/akce" element={<TableDataProvider />} />
      <Route path="/akce/:year" element={<TableDataProvider />} />
      <Route path="/akce/:year/:num/*" element={<DetailProvider />} />
    </Routes>
  </React.Suspense>
)

export default AuthenticatedRoutes
