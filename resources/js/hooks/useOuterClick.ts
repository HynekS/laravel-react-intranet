import { useEffect, useRef } from "react"

function useOuterClick<T extends HTMLElement>(callback: Function) {
  const innerRef = useRef<T>(null)
  const callbackRef = useRef<Function>()

  useEffect(() => {
    callbackRef.current = callback
  })

  useEffect(() => {
    document.getElementById("app")?.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)

    function handleClick(e: MouseEvent) {
      if (innerRef.current && callbackRef.current && !innerRef.current.contains(e.target as Node)) {
        callbackRef.current(e)
      }
    }
  }, [])

  return innerRef
}

export default useOuterClick
