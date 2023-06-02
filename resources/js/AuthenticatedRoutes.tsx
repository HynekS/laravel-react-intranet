import React from "react"
import { Routes, Route } from "react-router-dom"

import Dashboard from "./views/dashboard/Dashboard"
import CreateProjectPage from "./views/project/CreateProjectPage"

const TableDataProvider = React.lazy(
  () => import(/* webpackChunkName: 'TableProvider' */ "./views/projects-table/TableDataProvider"),
)

const ProjectProvider = React.lazy(
  () => import(/* webpackChunkName: 'ProjectProvider' */ "./views/project/ProjectProvider"),
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
      <Route path="/akce/:year/:num/*" element={<ProjectProvider />} />
    </Routes>
  </React.Suspense>
)

export default AuthenticatedRoutes
