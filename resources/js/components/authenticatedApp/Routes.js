/*
import React from "react"
import { Routes, Route } from "react-router-dom"

const AuthenticatedRoutes = props => {
  return (
    <Routes>
      <Route path="/" element={<Layout />} />  
    </Routes>

    /*

    <Route path="/akce" element={<Layout />} />
    <Route path="/akce/:year" element={<Layout />} />


    <Router>
      <Switch>
        <PublicRoute exact path="/" component={Login} />
        <PrivateRoute path="/dashboard" auth={props.auth} user={props.user} component={Dashboard} />
        <PrivateRoute
          path="/akce/rok/:year/:id"
          auth={props.auth}
          user={props.user}
          component={ProjectNav}
        />
        <PrivateRoute
          path="/akce/rok/:year"
          auth={props.auth}
          user={props.user}
          component={ProjectTableContainer}
        />
        <PrivateRoute
          path="/akce"
          auth={props.auth}
          user={props.user}
          component={ProjectTableContainer}
        />
        <Redirect to="/dashboard" />
      </Switch>
    </Router>

  )
}

export default AuthenticatedRoutes
*/