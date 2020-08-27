import React from "react"
import { Routes, Route } from "react-router-dom"

import Detail from "./Detail"
import Invoices from "./Invoices/Invoices"
import ExpertSheet from "./ExpertSheet"
import Files from "./Files/Files"

const DetailRoutes = ({ detail }) => {
  return (
    <Routes>
      <Route path="/" element={<Detail detail={detail} />} />
      <Route path="/faktury" element={<Invoices detail={detail} />} />
      <Route path="/expertni-list" element={<ExpertSheet />} />
      <Route path="/nahrane-soubory" element={<Files detail={detail} />} />
    </Routes>
  )
}

export default DetailRoutes
