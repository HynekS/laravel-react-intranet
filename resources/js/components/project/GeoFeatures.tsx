import { useState, useEffect, useRef } from "react"
import { css } from "@emotion/react"
import { useSelector, useDispatch } from "react-redux"

import useScript from "../../hooks/useScript"
import findCenter from "../../services/geometry/findCenterOfCoords"
import useGetCoordsFromWiki from "../../hooks/useGetCoordsFromWiki"

import GeoFeaturesPointgroup from "./GeoFeaturesPointgroup"
import DetailWrapper from "./DetailWrapper"

import { createPointgroup } from "../../store/pointgroups"
import { createPoint, updatePoint, deletePoint } from "../../store/points"

import { PlusIcon } from "@heroicons/react/outline"

import type { AppState } from "../../store/rootReducer"

import type { akce as Akce, pointgroups as Pointgroup, points as Point } from "@/types/model"

declare global {
  interface Window {
    Loader?: {
      async: boolean
      load: (first: unknown, second: unknown, third: () => void) => void
    }
    SMap: any
  }
}

type Props = { detail: Akce & { pointgroups: Pointgroup & { points: Point[] }[] } }

const GeoFeatures = ({ detail }: Props) => {
  const dispatch = useDispatch()
  const { id: userId } = useSelector((store: AppState) => store.auth.user)
  const { id_akce: projectId } = detail

  // redraw on new props
  useEffect(() => {
    setGeometryData((detail || {}).pointgroups || [])
  }, [detail])

  const { coordinates: wikiCoordinates, error: wikiError } = useGetCoordsFromWiki(
    String(detail.katastr),
  )

  const mapRef = useRef<any>()
  const mapContainerRef = useRef() as React.MutableRefObject<HTMLDivElement>
  const markerLayerRef = useRef<any>()
  const geometryLayerRef = useRef<any>()

  const { loaded, error } = useScript("https://api.mapy.cz/loader.js")

  const [geometryData, setGeometryData] = useState(() => (detail || {}).pointgroups || [])

  // Stale state hack!
  const activeGroupIndexRef = useRef<number | undefined>(
    geometryData.length ? geometryData.length - 1 : undefined,
  )
  const [activeGroupIndex, setActiveGroupIndex] = useState(
    geometryData.length ? geometryData.length - 1 : undefined,
  )
  console.log("activeGroupIndexRef ", activeGroupIndexRef.current, "run component")

  // load map
  useEffect(() => {
    // This is ugly, but we need to try our best to get the center before we show the map
    if (loaded && (findCenter(allPoints) || wikiCoordinates || wikiError)) {
      window.Loader.async = true
      window.Loader.load(null, null, bootstrapMap)
    }
    return () => {}
  }, [loaded, wikiCoordinates, wikiError])

  // Rerender map contents on state change
  useEffect(() => {
    if (markerLayerRef.current && geometryLayerRef.current) {
      renderMarkersToMap(geometryData)
    }
  }, [geometryData])

  const allPoints = geometryData
    .map(pointgroup => pointgroup.points.map(point => [point.latitude, point.longitude]))
    .flat()

  const getCenter = () => {
    const { latitude, longitude } = findCenter(allPoints) ||
      wikiCoordinates || { longitude: 14.5495308, latitude: 50.0013525 }

    return { latitude, longitude }
  }

  // Expose map variables
  const bootstrapMap = () => {
    if (loaded && mapContainerRef.current) {
      let { SMap } = window

      let center = SMap.Coords.fromWGS84(getCenter().longitude, getCenter().latitude)
      let map = new SMap(mapContainerRef.current, center, 16)

      map.addDefaultLayer(SMap.DEF_BASE)
      map.addDefaultLayer(SMap.DEF_OPHOTO)
      map.addDefaultLayer(SMap.DEF_TURIST).enable()

      map.addControl(new SMap.Control.Sync())
      let mouse = new SMap.Control.Mouse(SMap.MOUSE_PAN | SMap.MOUSE_WHEEL | SMap.MOUSE_ZOOM)
      map.addControl(mouse)

      let layerSwitch = new SMap.Control.Layer()
      layerSwitch.addDefaultLayer(SMap.DEF_BASE)
      layerSwitch.addDefaultLayer(SMap.DEF_OPHOTO)
      layerSwitch.addDefaultLayer(SMap.DEF_TURIST)
      map.addControl(layerSwitch, { left: "10px", top: "8px" })

      let markersLayer = new SMap.Layer.Marker()
      map.addLayer(markersLayer)
      markersLayer.enable()

      var geometryLayer = new SMap.Layer.Geometry()
      map.addLayer(geometryLayer)
      geometryLayer.enable()

      mapRef.current = map
      markerLayerRef.current = markersLayer
      geometryLayerRef.current = geometryLayer

      setupEventListeners()

      renderMarkersToMap(geometryData)
    }
  }

  const renderMarkersToMap = (pointgroups = [] as any[]) => {
    let { SMap } = window

    markerLayerRef.current.removeAll()
    geometryLayerRef.current.removeAll()

    pointgroups.forEach(({ points = [], feature_type }) => {
      points.forEach(({ latitude, longitude, id }: Point) => {
        let coords = SMap.Coords.fromWGS84(longitude, latitude)
        let marker = new SMap.Marker(coords)
        marker.decorate(SMap.Marker.Feature.Draggable)
        marker.__id = id

        markerLayerRef.current.addMarker(marker)
      })

      renderGeometry(points, feature_type)
    })
  }

  const renderGeometry = (coordinates: Point[], feature_type: Pointgroup["feature_type"]) => {
    let { SMap } = window

    const types = {
      line: "GEOMETRY_POLYLINE",
      polygon: "GEOMETRY_POLYGON",
      point: "GEOMETRY_POINT",
    }

    const options = {
      color: "#f00",
      width: 3,
    }

    let geometry = new SMap.Geometry(
      SMap[types[feature_type]],
      null,
      coordinates.map(({ latitude, longitude }) => SMap.Coords.fromWGS84(longitude, latitude)),
      options,
    )
    geometryLayerRef.current.addGeometry(geometry)
  }

  const addMarker = e => {
    /*
    const doOptimisticAddition = stateUpdater => {
      stateUpdater(prevState => {
        if (!prevState.length) return prevState
        const uiOnlyPoint = {
          __id: marker.getId(),
          id: marker.getId(), // needed for key prop
          pointgroup_id: prevState[activeGroupIndexRef.current || 0]?.id,
          latitude,
          longitude,
        }

        return prevState.map((pointgroup, i) =>
          i === activeGroupIndexRef.current
            ? { ...pointgroup, points: pointgroup.points.concat(uiOnlyPoint) }
            : pointgroup,
        )
      })
    }
    */
    let { SMap } = window

    let coords = SMap.Coords.fromEvent(e.data.event, mapRef.current)
    let marker = new SMap.Marker(coords)
    marker.decorate(SMap.Marker.Feature.Draggable)
    // markerLayerRef.current.addMarker(marker)
    const [longitude, latitude] = marker.getCoords().toWGS84()

    setGeometryData(prevState => {
      if (!prevState.length) {
        activeGroupIndexRef.current = prevState.length
        setActiveGroupIndex(prevState.length)
      }

      dispatch(
        createPoint({
          pointgroupId: prevState[activeGroupIndexRef.current || 0]?.id,
          latitude,
          longitude,
          projectId,
          userId,
        }),
      )
      return prevState
    })

    /*
    Allow for optimistic updates?
    setGeometryData(prevState => {
      const newPoint = {
        __id: marker.getId(),
        id: marker.getId(),
        pointgroup_id: prevState[activeGroupIndexRef.current || 0]?.id,
        latitude,
        longitude,
      }
      if (prevState.length) {
        return prevState.map((pointgroup, i) =>
          i === activeGroupIndexRef.current
            ? { ...pointgroup, points: pointgroup.points.concat(newPoint) }
            : pointgroup,
        )
      } else {
        // We don't have any pointgroup, so we need to create one
        activeGroupIndexRef.current = 0
        setActiveGroupIndex(prevState.length)

        return [
          {
            akce_id: projectId,
            type: "line",
            id: uuidv4(),
            points: [newPoint],
          },
        ]
      }
    })*/
  }

  const dragMarker = e => {
    const __id = e.target.__id
    const [longitude, latitude] = e.target.getCoords().toWGS84()

    setGeometryData(prevState => {
      dispatch(updatePoint({ pointId: __id, longitude, latitude, projectId, userId }))
      return prevState
    })

    /*
    Allow for optimistic updates?
    setGeometryData(prevState => {
      const pointgoupIndex = prevState.findIndex(pointgroup =>
        pointgroup.points.some(point => point.id === __id),
      )

      return prevState.map((pointgroup, i) =>
        i === pointgoupIndex
          ? {
              ...pointgroup,
              points: pointgroup.points.map(point =>
                point.id !== __id ? point : { ...point, latitude, longitude },
              ),
            }
          : pointgroup,
      )
    })*/
  }

  const removeMarker = e => {
    const marker = e.target
    const __id = marker.__id

    markerLayerRef.current.removeMarker(marker)

    setGeometryData(prevState => {
      dispatch(deletePoint({ pointId: __id, projectId, userId }))
      return prevState
    })

    /*
     Allow for optimistic updates?
    setGeometryData(prevState => {
      const pointgoupIndex = prevState.findIndex(pointgroup =>
        pointgroup.points.some(point => point.id === __id),
      )

      return prevState.map((pointgroup, i) =>
        i === pointgoupIndex
          ? { ...pointgroup, points: pointgroup.points.filter(point => point.id !== __id) }
          : pointgroup,
      )
    })*/
  }

  const setupEventListeners = () => {
    if (mapRef.current) {
      mapRef.current.getSignals().addListener(window, "map-click", addMarker)
      mapRef.current.getSignals().addListener(window, "marker-drag-stop", dragMarker)
      mapRef.current.getSignals().addListener(window, "marker-click", removeMarker)
    }
  }

  return (
    <DetailWrapper>
      <div tw="flex gap-4">
        <div
          tw="relative flex-1"
          css={css`
            & img {
              max-width: initial;
            }
          `}
        >
          <div ref={mapContainerRef} style={{ height: 600, backgroundColor: "#f1f0e5" }} />
        </div>
        <div tw="w-1/6">
          <div tw="relative z-10 flex items-center justify-between mb-2">
            <h3 tw="font-bold">Dokumentační jednotky</h3>
            <button
              tw="flex items-center bg-blue-600 hover:bg-blue-700 transition-colors duration-300 text-white font-medium py-1 pl-2 pr-3 text-sm rounded focus:(outline-none ring)"
              onClick={() => {
                /* Update current index */
                setGeometryData(prevState => {
                  activeGroupIndexRef.current = prevState.length
                  setActiveGroupIndex(prevState.length)
                  return prevState
                })

                activeGroupIndexRef.current
                dispatch(createPointgroup({ projectId }))
              }}
            >
              <PlusIcon tw="w-4 mr-1" />
              Přidat
            </button>
          </div>
          {geometryData.length
            ? geometryData.map(({ feature_type, id, points = [] }, i) => (
                <GeoFeaturesPointgroup
                  feature_type={feature_type}
                  id={id}
                  projectId={projectId}
                  points={points}
                  i={i}
                  setData={setGeometryData}
                  activeIndexRef={activeGroupIndexRef}
                  activeIndex={activeGroupIndex}
                  setActiveIndex={setActiveGroupIndex}
                  key={id}
                />
              ))
            : null}
        </div>
      </div>
    </DetailWrapper>
  )
}

export default GeoFeatures
