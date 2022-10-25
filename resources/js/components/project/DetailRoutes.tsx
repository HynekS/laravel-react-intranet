import React from "react"
import { Routes, Route } from "react-router-dom"

import { Detail, InvoiceView, ApprovalSheet, Files, GeoFeatures } from "./lazyImports"

const DetailRoutes = ({ detail, setProjectTitle }) => {
  return (
    <React.Suspense fallback={<div>Loading component…</div>}>
      <Routes>
        <Route path="/" element={<Detail detail={detail} setProjectTitle={setProjectTitle} />} />
        <Route path="/faktury" element={<InvoiceView detail={detail} />} />
        <Route path="/expertni-list" element={<ApprovalSheet detail={detail} />} />
        <Route path="/lokalizace" element={<GeoFeatures detail={detail} />} />
        <Route path="/nahrane-soubory" element={<Files detail={detail} />} />
      </Routes>
    </React.Suspense>
  )
}

export default DetailRoutes
