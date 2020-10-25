// @ts-check
import { createStore, applyMiddleware, compose } from "redux"
import thunk from "redux-thunk"

import rootReducer from "./rootReducer"

const actionSanitizer = action =>
  action.type === "[upload] Reading multiple files has ended" && action.filesToUpload
    ? { ...action, filesToUpload: action.filesToUpload.map(() => "<<LONG_BLOB>>") }
    : action

const composeEnhancers =
  (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
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
    })) ||
  compose
const configuredStore = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)))

export default configuredStore
