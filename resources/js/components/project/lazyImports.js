import lazy from "react-lazy-with-preload"

const Detail = lazy(() => import("./Detail"))
const Invoices = lazy(() => import("./Invoices/Invoices"))
const ExpertSheet = lazy(() => import("./ExpertSheet"))
const Files = lazy(() => import("./Files/Files"))

export { Detail, Invoices, ExpertSheet, Files }