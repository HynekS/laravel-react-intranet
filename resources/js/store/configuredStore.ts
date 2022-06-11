import { configureStore } from "@reduxjs/toolkit"
import { Action } from "redux"

import auth from "./auth"
import projects from "./projects"
import users from "./users"
import table from "./table"
import upload from "./upload"
import updates from "./updates"
import stats from "./stats"
import search from "./search"

const actionSanitizer = <A extends Action<string>>(action: A): A =>
  action.type === "[upload] Reading multiple files has ended" && action.filesToUpload
    ? { ...action, filesToUpload: action.filesToUpload.map(() => "<<LONG_BLOB>>") }
    : action

const stateSanitizer = <S>(state: S): S =>
  state.upload.filesToUpload.length
    ? {
        ...state,
        files: {
          ...state.upload,
          filesToUpload: state.upload.filesToUpload.map(() => "<<LONG_BLOB>>"),
        },
      }
    : state

const configuredStore = configureStore({
  reducer: {
    auth,
    projects,
    users,
    table,
    upload,
    updates,
    stats,
    search,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
  devTools: {
    actionsBlacklist: ["[upload] uploadProgressUpdated"],
    actionSanitizer,
    stateSanitizer,
  },
})

export type RootState = ReturnType<typeof configuredStore.getState>

export type AppDispatch = typeof configuredStore.dispatch

export default configuredStore
