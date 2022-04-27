import { useEffect } from "react"
import { useDispatch } from "react-redux"

import Layout from "./Layout"

import { fetchLatestUpdateId } from "../../store/updates"

function usePoll(func: (...args: any) => any, deps: any[], interval = 5000) {
  return useEffect(() => {
    let killed = false

    async function poll() {
      if (killed) return
      await func()
      setTimeout(poll, interval)
    }

    poll()

    return () => {
      killed = true
    }
  }, deps)
}

const ServerSyncProvider = () => {
  const dispatch = useDispatch()

  usePoll(() => dispatch(fetchLatestUpdateId()), [], 60000)

  return <Layout />
}

export default ServerSyncProvider
