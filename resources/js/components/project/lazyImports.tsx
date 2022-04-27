import lazy from "react-lazy-with-preload"

const Detail = lazy(() => import(/* webpackChunkName: 'Detail' */ "./Detail"))
const InvoiceView = lazy(() => import(/* webpackChunkName: 'Invoices' */ "./Invoices/InvoiceView"))
const ApprovalSheet = lazy(() => import(/* webpackChunkName: 'ApprovalSheet' */ "./ApprovalSheet"))
const Files = lazy(() => import(/* webpackChunkName: 'Files' */ "./Files/FilesProvider"))
const GeoFeatures = lazy(() => import(/* webpackChunkName: 'GeoFeatures' */ "./GeoFeatures"))

export { Detail, InvoiceView, ApprovalSheet, Files, GeoFeatures }
