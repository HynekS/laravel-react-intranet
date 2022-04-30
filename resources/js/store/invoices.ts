import client from "../utils/axiosWithDefaults"

// Actions
export const CREATE_INVOICE_INITIALIZED = "[invoices] creating new invoice has started"
export const CREATE_INVOICE_SUCCESS = "[invoices] creating new invoice was succesful"
export const CREATE_INVOICE_FAILURE = "[invoices] creating new invoice has failed"

export const UPDATE_INVOICE_INITIALIZED = "[invoices] updating an invoice has started"
export const UPDATE_INVOICE_SUCCESS = "[invoices] updating an invoice was succesful"
export const UPDATE_INVOICE_FAILURE = "[invoices] updating an invoice has failed"

export const DELETE_INVOICE_INITIALIZED = "[invoices] deleting an invoice has started"
export const DELETE_INVOICE_SUCCESS = "[invoices] deleting an invoice was succesful"
export const DELETE_INVOICE_FAILURE = "[invoices] deleting an invoice has failed"

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

export const createInvoiceSuccess = ({ response, projectId, ...data }) => ({
  type: CREATE_INVOICE_SUCCESS,
  response,
  projectId,
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

export const deleteInvoiceSuccess = ({ response, projectId, typ_castky }) => ({
  type: DELETE_INVOICE_SUCCESS,
  response,
  projectId,
  typ_castky,
})

export const deleteInvoiceFailure = error => ({ type: DELETE_INVOICE_FAILURE, error })

// Thunks
export const createInvoice = ({ projectId, ...data }) => async dispatch => {
  try {
    dispatch(createInvoiceInit())
    let response = await client.post("/invoices", { akce_id: projectId, ...data })
    if (response) {
      dispatch(
        createInvoiceSuccess({
          response: response.data,
          projectId,
          ...data,
        }),
      )
    }
  } catch (error) {
    console.log(error)
    dispatch(createInvoiceFailure(error))
  }
}

export const updateInvoice = ({ invoiceId, ...data }) => async dispatch => {
  try {
    dispatch(updateInvoiceInit())
    let response = await client.put(`/invoices/${invoiceId}`, { ...data })
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

export const deleteInvoice = ({ invoiceId, projectId, typ_castky }) => async dispatch => {
  try {
    dispatch(deleteInvoiceInit())
    let response = await client.delete(`/invoices/${invoiceId}`)
    if (response) {
      dispatch(
        deleteInvoiceSuccess({
          response: response.data,
          projectId,
          typ_castky,
        }),
      )
    }
  } catch (error) {
    console.log(error)
    dispatch(deleteInvoiceFailure(error))
  }
}
