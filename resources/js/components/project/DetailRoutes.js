import React from "react"
import { Routes, Route } from "react-router-dom"

import { Detail, InvoiceView, ExpertSheet, Files } from "./lazyImports"

const DetailRoutes = ({ detail }) => {
  return (
    <React.Suspense fallback={<div>I aM tHe SusPEnSE !!!</div>}>
      <Routes>
        <Route path="/" element={<Detail detail={detail} />} />
        <Route path="/faktury" element={<InvoiceView detail={detail} />} />
        <Route path="/expertni-list" element={<ExpertSheet />} />
        <Route path="/nahrane-soubory" element={<Files detail={detail} />} />
      </Routes>
    </React.Suspense>
  )
}

export default DetailRoutes
