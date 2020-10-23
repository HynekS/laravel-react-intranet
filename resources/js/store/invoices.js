// @ts-check
import client from "../utils/axiosWithDefaults"

export const invoiceStatus = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
}

// Actions
const CREATE_INVOICE_INITIALIZED = "[invoices] creating new invoice has started"
const CREATE_INVOICE_SUCCESS = "[invoices] creating new invoice was succesful"
const CREATE_INVOICE_FAILURE = "[invoices] creating new invoice has failed"

const UPDATE_INVOICE_INITIALIZED = "[invoices] updating an invoice has started"
const UPDATE_INVOICE_SUCCESS = "[invoices] updating an invoice was succesful"
const UPDATE_INVOICE_FAILURE = "[invoices] updating an invoice has failed"

const DELETE_INVOICE_INITIALIZED = "[invoices] deleting an invoice has started"
const DELETE_INVOICE_SUCCESS = "[invoices] deleting an invoice was succesful"
const DELETE_INVOICE_FAILURE = "[invoices] deleting an invoice has failed"

export { CREATE_INVOICE_SUCCESS, UPDATE_INVOICE_SUCCESS, DELETE_INVOICE_SUCCESS }

// Reducer
export default function reducer(state = [], action = {}) {
  const { response = {} } = action
  switch (action.type) {
    case CREATE_INVOICE_INITIALIZED:
      return state
    case CREATE_INVOICE_SUCCESS:
      return [...state, response]
    case CREATE_INVOICE_FAILURE:
      return state
    case UPDATE_INVOICE_INITIALIZED:
      return state
    case UPDATE_INVOICE_SUCCESS:
      return state.map(invoice => (invoice.id_zaznam === response.id_zaznam ? response : invoice))
    case UPDATE_INVOICE_FAILURE:
      return state
    case DELETE_INVOICE_INITIALIZED:
      return state
    case DELETE_INVOICE_SUCCESS:
      return state.filter(invoice => invoice.id_zaznam != response.id_zaznam)
    case DELETE_INVOICE_FAILURE:
      return state
    default:
      return state
  }
}

// Action creators
export const createInvoiceInit = () => ({ type: CREATE_INVOICE_INITIALIZED })

export const createInvoiceSuccess = ({ response, id_akce, ...data }) => ({
  type: CREATE_INVOICE_SUCCESS,
  response,
  id_akce,
  ...data,
})

export const createInvoiceFailure = error => ({ type: CREATE_INVOICE_FAILURE, error })

export const updateInvoiceInit = () => ({ type: UPDATE_INVOICE_INITIALIZED })

export const updateInvoiceSuccess = ({ response, ...data }) => ({
  type: UPDATE_INVOICE_SUCCESS,
  response,
  ...data,
})

export const updateInvoiceFailure = error => ({ type: UPDATE_INVOICE_FAILURE, error })

export const deleteInvoiceInit = () => ({ type: DELETE_INVOICE_INITIALIZED })

export const deleteInvoiceSuccess = ({ response, id_akce, typ_castky }) => ({
  type: DELETE_INVOICE_SUCCESS,
  response,
  id_akce,
  typ_castky,
})

export const deleteInvoiceFailure = error => ({ type: DELETE_INVOICE_FAILURE, error })

// TODO All actions dispatched to all reducers!
// Also, make a one shape from multiple 'id_akce', 'akce_id', 'id_zaznam' => projectId, invoiceId
// Thunks
export const createInvoice = ({ id_akce, ...data }) => async dispatch => {
  try {
    dispatch(createInvoiceInit())
    let response = await client.post("/invoices", { ...data })
    if (response) {
      dispatch(
        createInvoiceSuccess({
          response: response.data,
          id_akce,
          ...data,
        }),
      )
    }
  } catch (error) {
    console.log(error)
    dispatch(createInvoiceFailure(error))
  }
}

export const updateInvoice = ({ id, ...data }) => async dispatch => {
  try {
    dispatch(updateInvoiceInit())
    let response = await client.put(`/invoices/${id}`, { ...data })
    if (response) {
      dispatch(
        updateInvoiceSuccess({
          response: response.data,
          ...data,
        }),
      )
    }
  } catch (error) {
    console.log(error)
    dispatch(updateInvoiceFailure(error))
  }
}

export const deleteInvoice = ({ id, id_akce, typ_castky }) => async dispatch => {
  try {
    dispatch(deleteInvoiceInit())
    let response = await client.delete(`/invoices/${id}`)
    if (response) {
      console.log(response)
      dispatch(
        //manageInvoices({
        deleteInvoiceSuccess({
          // type: DELETE_INVOICE_SUCCESS,
          response: response.data,
          id_akce,
          typ_castky,
        }),
      )
    }
  } catch (error) {
    console.log(error)
    dispatch(deleteInvoiceFailure(error))
  }
}
