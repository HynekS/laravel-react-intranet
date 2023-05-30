import { useEffect, useRef } from "react"
import { css } from "@emotion/react"
import { PlusIcon } from "@heroicons/react/outline"

import { useAppSelector, useAppDispatch } from "@hooks/useRedux"
import useScript from "@hooks/useScript"
import useGetCoordsFromWiki from "@hooks/useGetCoordsFromWiki"
import findCenter from "@services/geometry/findCenterOfCoords"
import { createPointgroup } from "@store/pointgroups"
import { createPoint, updatePoint, deletePoint } from "@store/points"
import store from "@store/configuredStore"

import GeoFeaturesPointgroup from "./GeoFeaturesPointgroup"
import DetailWrapper from "./DetailWrapper"

import type { akce as Akce, pointgroups as Pointgroup, points as Point } from "@codegen"

declare global {
  interface Window {
    Loader?: {
      async: boolean
      load: (first: unknown, second: unknown, third: () => void) => void
    }
    SMap: any
  }
}

type Props = { detail: Akce & { pointgroups: Array<Pointgroup & { points: Point[] }> } }

const GeoFeatures = ({ detail }: Props) => {
  const dispatch = useAppDispatch()
  const { id: userId } = useAppSelector(store => store.auth.user)
  const { id_akce: projectId } = detail

  const { coordinates: wikiCoordinates, error: wikiError } = useGetCoordsFromWiki(
    String(detail.katastr),
  )

  const mapRef = useRef<any>()
  const mapContainerRef = useRef() as React.MutableRefObject<HTMLDivElement>
  const markerLayerRef = useRef<any>()
  const geometryLayerRef = useRef<any>()

  const { loaded, error } = useScript("https://api.mapy.cz/loader.js")
  const isLoaderLoaded = useRef(false)

  // load map
  useEffect(() => {
    // This is ugly, but we need to try our best to get the center before we show the map
    if (loaded && (findCenter(allPoints) || wikiCoordinates || wikiError)) {
      if (isLoaderLoaded.current) return
      // @ts-ignore
      window.Loader.async = true
      // @ts-ignore
      window.Loader.load(null, null, bootstrapMap)
      isLoaderLoaded.current = true
    }
    return () => {}
  }, [loaded, wikiCoordinates, wikiError])

  useEffect(() => {
    if (markerLayerRef.current && geometryLayerRef.current) {
      renderMarkersToMap(detail.pointgroups)
    }
  }, [detail.pointgroups])

  const allPoints = detail.pointgroups
    .map(pointgroup =>
      pointgroup.points.map(point => [point.latitude, point.longitude] as [number, number]),
    )
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

      renderMarkersToMap(detail.pointgroups)
    }
  }

  const renderMarkersToMap = (pointgroups: Array<Pointgroup & { points: Point[] }>) => {
    let { SMap } = window
    console.log("rendering markers")

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

  const addMarker = (e: any) => {
    let { SMap } = window

    let coords = SMap.Coords.fromEvent(e.data.event, mapRef.current)
    let marker = new SMap.Marker(coords)
    marker.decorate(SMap.Marker.Feature.Draggable)

    const [longitude, latitude] = marker.getCoords().toWGS84()

    const activeIndex = store.getState().projects.byId[projectId].activePointgroupIndex

    dispatch(
      createPoint({
        pointgroupId:
          activeIndex == undefined
            ? undefined
            : store.getState().projects.byId[projectId].pointgroups[activeIndex]?.id,
        latitude,
        longitude,
        projectId,
        userId,
      }),
    )
  }

  const dragMarker = (e: any) => {
    const __id = e.target.__id
    const [longitude, latitude] = e.target.getCoords().toWGS84()

    dispatch(updatePoint({ pointId: __id, longitude, latitude, projectId, userId }))
  }

  const removeMarker = (e: any) => {
    const marker = e.target
    const __id = marker.__id

    markerLayerRef.current.removeMarker(marker)

    dispatch(deletePoint({ pointId: __id, projectId, userId }))
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
      <div tw="flex gap-4 flex-wrap">
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
        <div tw="w-full md:w-1/6">
          <div tw="relative z-10 flex items-center justify-between mb-2 flex-wrap gap-2">
            <h3 tw="font-bold">Dokumentační jednotky</h3>
            <button
              tw="flex items-center bg-blue-600 hover:bg-blue-700 transition-colors duration-300 text-white font-medium py-1 pl-2 pr-3 text-sm rounded focus:(outline-none ring)"
              onClick={() => {
                dispatch(createPointgroup({ projectId }))
              }}
            >
              <PlusIcon tw="w-4 mr-1" />
              Přidat
            </button>
          </div>
          {detail.pointgroups.length
            ? detail.pointgroups.map(({ feature_type, id, points = [] }, i) => (
                <GeoFeaturesPointgroup
                  feature_type={feature_type}
                  id={id}
                  projectId={projectId}
                  points={points}
                  i={i}
                  key={id}
                  activeIndex={store.getState().projects.byId[projectId].activePointgroupIndex}
                />
              ))
            : null}
        </div>
      </div>
    </DetailWrapper>
  )
}

export default GeoFeatures
