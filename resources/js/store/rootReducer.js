import { combineReducers } from "redux"

import auth from "./auth"
import projects from "./projects"
import meta from "./meta"

export default combineReducers({ app, auth, projects, meta })
