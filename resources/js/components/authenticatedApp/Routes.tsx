import React from "react"
import { Routes, Route } from "react-router-dom"

import Dashboard from "../dashboard/Dashboard"
import Detail from "../project/Detail"

const TableDataProvider = React.lazy(
  () => import(/* webpackChunkName: 'TableProvider' */ "../project/TableDataProvider"),
)
const DetailProvider = React.lazy(
  () => import(/* webpackChunkName: 'DetailProvider' */ "../project/DetailProvider"),
)

const AuthenticatedRoutes = () => (
  <React.Suspense
    fallback={<div tw="h-full w-full flex items-center justify-center">Loading…</div>}
  >
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/vytvorit-akci" element={<Detail type="create" />} />
      <Route path="/akce" element={<TableDataProvider />} />
      <Route path="/akce/:year" element={<TableDataProvider />} />
      <Route path="/akce/:year/:num/*" element={<DetailProvider />} />
    </Routes>
  </React.Suspense>
)

export default AuthenticatedRoutes
