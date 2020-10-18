import { combineReducers } from "redux"

import auth from "./auth"
import projects from "./projects"
import meta from "./meta"
import table from "./table"
import invoice from "./invoices"

export default combineReducers({ app, auth, projects, meta, table })
