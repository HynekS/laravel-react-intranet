import { useEffect, Fragment } from "react"
import { useAppDispatch } from "@hooks/useRedux"

import { fetchLatestUpdateId } from "@store/updates"

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

type Props = {
  children: React.ReactNode
}

const ServerSyncProvider = ({ children }: Props) => {
  const dispatch = useAppDispatch()

  usePoll(() => dispatch(fetchLatestUpdateId()), [], 60000)

  return <Fragment>{children}</Fragment>
}

export default ServerSyncProvider
