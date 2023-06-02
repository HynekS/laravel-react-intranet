import lazy from "react-lazy-with-preload"

const Info = lazy(() => import(/* webpackChunkName: 'Info' */ "./info/Info"))
const InvoiceView = lazy(() => import(/* webpackChunkName: 'Invoices' */ "./invoices/InvoiceView"))
const ApprovalSheet = lazy(
  () => import(/* webpackChunkName: 'ApprovalSheet' */ "./approval-sheet/ApprovalSheet"),
)
const Files = lazy(() => import(/* webpackChunkName: 'Files' */ "./files/FilesProvider"))
const GeoFeatures = lazy(
  () => import(/* webpackChunkName: 'GeoFeatures' */ "./geo-features/GeoFeatures"),
)

export { Info, InvoiceView, ApprovalSheet, Files, GeoFeatures }
