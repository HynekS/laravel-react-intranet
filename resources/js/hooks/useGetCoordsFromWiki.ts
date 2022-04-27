import { useEffect, useReducer, useRef } from "react"

function useGetCoordsFromWiki(locationString: string) {
  const cache = useRef({} as { [locationString: string]: { latitude: number; longitude: number } })
  const cancelRequest = useRef(false)

  const initialState = {
    coordinates: undefined,
    error: undefined,
  }

  const [state, dispatch] = useReducer(reducer, initialState)

  function reducer(state, action) {
    console.log({ state })

    switch (action.type) {
      case "loading":
        return initialState
      case "success":
        return {
          ...state,
          coordinates: {
            latitude: action.coordinates.latitude,
            longitude: action.coordinates.longitude,
          },
        }
      case "error": {
        return {
          ...state,
          error: action.error,
        }
      }
      default:
        return state
    }
  }

  useEffect(() => {
    if (!locationString) return

    const loctaionStringURIEncoded = encodeURI(locationString)

    async function getCoords(locURI: string) {
      if (cache.current[locationString]) {
        dispatch({ type: "success", coordinates: cache.current[locationString] })
        return
      }
      try {
        const response = await fetch(
          `https://cs.wikipedia.org/w/api.php?action=query&titles=${locURI}&prop=coordinates&redirects&format=json&origin=*`,
        )
        const data = await response.json()
        const id = Object.keys(data?.query?.pages)[0]
        const coords = data?.query?.pages[id]?.coordinates[0]

        cache.current[locationString] = {
          latitude: coords.lat,
          longitude: coords.lon,
        }

        if (coords) {
          dispatch({
            type: "success",
            coordinates: {
              latitude: coords.lat,
              longitude: coords.lon,
            },
          })
        } else {
          dispatch({ type: "error", error: "Unable to get location data from Wikipedia" })
        }
      } catch (e) {
        if (cancelRequest.current) return
        dispatch({ type: "error", error: (e as Error).message })
      }
    }
    getCoords(loctaionStringURIEncoded)

    return () => {
      cancelRequest.current = true
    }
  }, [locationString])

  return state
}

export default useGetCoordsFromWiki
