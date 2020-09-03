import React from "react"
import { Routes, Route } from "react-router-dom"
/*
import Detail from "./Detail"
import Invoices from "./Invoices/Invoices"
import ExpertSheet from "./ExpertSheet"
import Files from "./Files/Files"
*/

const Detail = React.lazy(() => import("./Detail"))
const Invoices = React.lazy(() => import("./Invoices/Invoices"))
const ExpertSheet = React.lazy(() => import("./ExpertSheet"))
const Files = React.lazy(() => import("./Files/Files"))

const DetailRoutes = ({ detail }) => {
  return (
    <React.Suspense fallback={<div>I aM tHe SusPEnSE !!!</div>}>
      <Routes>
        <Route path="/" element={<Detail detail={detail} />} />
        <Route path="/faktury" element={<Invoices detail={detail} />} />
        <Route path="/expertni-list" element={<ExpertSheet />} />
        <Route path="/nahrane-soubory" element={<Files detail={detail} />} />
      </Routes>
    </React.Suspense>
  )
}

export default DetailRoutes
