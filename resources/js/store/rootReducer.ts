import { combineReducers } from "redux"

import auth from "./auth"
import projects from "./projects"
import meta from "./meta"
import table from "./table"
import upload from "./upload"
import updates from "./updates"

const reducers = combineReducers({ auth, projects, meta, table, upload, updates })

export default reducers

export type AppState = ReturnType<typeof reducers>
