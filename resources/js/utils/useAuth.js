import React, { useEffect } from "react"

import { useSelector, useDispatch } from "react-redux"

import { fetchUser } from "../store/auth"

export default function useAuth() {
  const dispatch = useDispatch()

  // Saved token, however we don't know if it is valid.
  // We will find out as soon as we'll try to fetch user and got interceptor error callback.
  // The callback will delete the token, so we'll start over. If no token is present,
  // then it is pointless to do fetching and therefore the default case – loading form – is used.
  const token = localStorage.getItem("oauth_token")
  const user = useSelector(store => store.auth.user)
  const loading = useSelector(store => store.auth.isUserBeingFetched)

  useEffect(() => {
    if (token && !user) dispatch(fetchUser())
    console.log("fetching user")
  }, [])

  return { user, loading }
}
