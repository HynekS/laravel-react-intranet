import lazy from "react-lazy-with-preload"

const Detail = lazy(() => import(/* webpackChunkName: 'Detail' */ "./Detail"))
const InvoiceView = lazy(() => import(/* webpackChunkName: 'Invoices' */ "./Invoices/InvoiceView"))
const ExpertSheet = lazy(() => import(/* webpackChunkName: 'ExpertSheet' */ "./ExpertSheet"))
const Files = lazy(() => import(/* webpackChunkName: 'Files' */ "./Files/FilesProvider"))

export { Detail, InvoiceView, ExpertSheet, Files }