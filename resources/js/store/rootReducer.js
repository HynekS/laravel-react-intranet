// @ts-check
import { combineReducers } from "redux"

import auth from "./auth"
import projects from "./projects"
import meta from "./meta"
import table from "./table"
import upload from "./upload"

export default combineReducers({ auth, projects, meta, table, upload })
