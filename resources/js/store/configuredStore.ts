import { createStore, applyMiddleware, compose } from "redux"
import thunk from "redux-thunk"
import { composeWithDevTools } from "redux-devtools-extension"
import type { AnyAction } from "redux"

import rootReducer from "./rootReducer"

const actionSanitizer = (action: AnyAction) =>
  action.type === "[upload] Reading multiple files has ended" && action.filesToUpload
    ? { ...action, filesToUpload: action.filesToUpload.map(() => "<<LONG_BLOB>>") }
    : action

const stateSanitizer = state =>
  state.upload.filesToUpload.length
    ? {
        ...state,
        files: {
          ...state.upload,
          filesToUpload: state.upload.filesToUpload.map(() => "<<LONG_BLOB>>"),
        },
      }
    : state

const composeEnhancers = composeWithDevTools({
  actionsBlacklist: ["[upload] uploadProgressUpdated"],
  actionSanitizer,
  stateSanitizer,
})

const configuredStore = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)))

export type RootState = ReturnType<typeof configuredStore.getState>

export type AppDispatch = typeof configuredStore.dispatch

export default configuredStore

/*
const composeEnhancers =
  ((window["__REDUX_DEVTOOLS_EXTENSION_COMPOSE__"] &&
    window["__REDUX_DEVTOOLS_EXTENSION_COMPOSE__"]({
      actionsBlacklist: ["[upload] uploadProgressUpdated"],
      actionSanitizer,
      stateSanitizer: state =>
        state.upload.filesToUpload.length
          ? {
              ...state,
              files: {
                ...state.upload,
                filesToUpload: state.upload.filesToUpload.map(() => "<<LONG_BLOB>>"),
              },
            }
          : state,
    })) as typeof compose) || compose

const configuredStore = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)))

export type RootState = ReturnType<typeof configuredStore.getState>

export type AppDispatch = typeof configuredStore.dispatch

export default configuredStore
*/
