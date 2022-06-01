import { combineReducers } from "redux"

import auth from "./auth"
import projects from "./projects"
import users from "./users"
import table from "./table"
import upload from "./upload"
import updates from "./updates"
import pointgroups from "./pointgroups"

const reducers = combineReducers({ auth, projects, users, table, upload, updates, pointgroups })

export default reducers

export type AppState = ReturnType<typeof reducers>
