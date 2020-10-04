import lazy from "react-lazy-with-preload"

const Detail = lazy(() => import("./Detail"))
const InvoiceView = lazy(() => import("./Invoices/InvoiceView"))
const ExpertSheet = lazy(() => import("./ExpertSheet"))
const Files = lazy(() => import("./Files/FilesProvider"))

export { Detail, InvoiceView, ExpertSheet, Files }