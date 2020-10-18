import client from "../utils/axiosWithDefaults"

// @ts-check
export const invoiceStatus = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
}

const initialState = {}

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

// Reducer
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case CREATE_INVOICE_INITIALIZED:
      return {
        ...state,
      }
    case CREATE_INVOICE_SUCCESS:
      return {
        ...state,
      }
    case CREATE_INVOICE_FAILURE:
      return {
        ...state,
      }
    case UPDATE_INVOICE_INITIALIZED:
      return {
        ...state,
      }
    case UPDATE_INVOICE_SUCCESS:
      return {
        ...state,
      }
    case UPDATE_INVOICE_FAILURE:
      return {
        ...state,
      }
    case DELETE_INVOICE_INITIALIZED:
      return {
        ...state,
      }
    case DELETE_INVOICE_SUCCESS:
      return {
        ...state,
      }
    case DELETE_INVOICE_FAILURE:
      return {
        ...state,
      }
    default:
      return state
  }
}

// Action creators
export const createInvoiceInit = () => ({ type: CREATE_INVOICE_INITIALIZED })

export const createInvoiceSuccess = () => ({ type: CREATE_INVOICE_SUCCESS })

export const createInvoiceFailure = () => ({ type: CREATE_INVOICE_FAILURE })

export const updateInvoiceInit = () => ({ type: UPDATE_INVOICE_INITIALIZED })

export const updateInvoiceSuccess = () => ({ type: UPDATE_INVOICE_SUCCESS })

export const updateInvoiceFailure = () => ({ type: UPDATE_INVOICE_FAILURE })

export const deleteInvoiceInit = () => ({ type: DELETE_INVOICE_INITIALIZED })

export const deleteInvoiceSuccess = () => ({ type: DELETE_INVOICE_SUCCESS })

export const deleteInvoiceFailure = () => ({ type: DELETE_INVOICE_FAILURE })

// Thunks
export const createInvoice = data => async dispatch => {
  dispatch(createInvoiceInit())
  try {
    let response = await client.post("/invoices/", {})
    if (response) {
      dispatch(createInvoiceSuccess(response.data))
    }
  } catch (error) {
    dispatch(createInvoiceFailure(error))
  }
}

export const updateInvoice = ({ id, ...data }) => async dispatch => {
  dispatch(updateInvoiceInit())
  console.log({ id, ...data })
  try {
    let response = await client.put(`/invoices/${id}`, { ...data })
    if (response) {
      dispatch(updateInvoiceSuccess(response.data))
    }
  } catch (error) {
    dispatch(updateInvoiceFailure(error))
  }
}

export const deleteInvoice = ({ id }) => async dispatch => {
  dispatch(deleteInvoiceInit())
  try {
    let response = await client.delete(`/invoices/${id}`, {})
    if (response) {
      dispatch(deleteInvoiceSuccess(response.data))
    }
  } catch (error) {
    dispatch(deleteInvoiceFailure(error))
  }
}
