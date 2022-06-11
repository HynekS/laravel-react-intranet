import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import client from "@services/http/client"

import type { faktury as Invoice } from "@codegen"

const invoiceSlice = createSlice({
  name: "invoices",
  initialState: [] as Invoice[],
  reducers: {},
  extraReducers: builder => {
    builder.addCase(createInvoice.fulfilled, (state, { payload }) => {
      return [...state, payload.data]
    })
    builder.addCase(updateInvoice.fulfilled, (state, { payload }) => {
      return state.map(invoice =>
        invoice.id_zaznam === payload.data.id_zaznam ? payload.data : invoice,
      )
    })
    builder.addCase(deleteInvoice.fulfilled, (state, { payload }) => {
      return state.filter(invoice => invoice.id_zaznam != payload.data.id_zaznam)
    })
  },
})

export const createInvoice = createAsyncThunk<
  { projectId: number; data: Invoice },
  { projectId: number; data: Invoice },
  {
    rejectValue: string
  }
>("invoices/createInvoice", async ({ projectId, ...data }) => {
  const response = await client.post("/invoices", { akce_id: projectId, ...data })
  return { projectId, data: response.data }
})

export const updateInvoice = createAsyncThunk<
  { projectId: number; data: Invoice },
  { invoiceId: number; data: Invoice },
  {
    rejectValue: string
  }
>("invoices/updateInvoice", async ({ invoiceId, ...data }) => {
  const response = await client.put(`/invoices/${invoiceId}`, { ...data })
  return { projectId: response.data.id_akce, data: response.data }
})

export const deleteInvoice = createAsyncThunk<
  { projectId: number; data: Invoice },
  { invoiceId: number; projectId: number },
  {
    rejectValue: string
  }
>("invoices/deleteInvoice", async ({ invoiceId, projectId }) => {
  const response = await client.delete(`/invoices/${invoiceId}`)
  return { projectId, data: response.data }
})

export default invoiceSlice.reducer
