import React, { useEffect, useRef } from "react"
import useScript from "../../utils/useScript"
import styled from "@emotion/styled"
import tw from "twin.macro"

const MapContainer = styled.div`
  ${tw`bg-white border-r border-l border-b py-4 px-8 rounded-md rounded-tl-none`}
  position: relative;
  & img {
    max-width: initial;
  }
`

const ExpertSheet = ({ detail }) => {
  const mapRef = useRef()
  const [loaded, error] = useScript("https://api.mapy.cz/loader.js")

  useEffect(() => {
    console.log("map loader loaded", loaded)
    if (loaded) {
      window.Loader.async = true
      window.Loader.load(null, null, createMap)
    }
    return () => {}
  }, [loaded])

  const createMap = () => {
    console.log("creating map")
    let { SMap, JAK } = window

    let center = SMap.Coords.fromWGS84(14.4179, 50.12655)
    let map = new SMap(mapRef.current, center, 13)

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

    let layer = new SMap.Layer.Marker()
    map.addLayer(layer)
    layer.enable()

    const addMarker = e => {
      let coords = SMap.Coords.fromEvent(e.data.event, map)
      let marker = new SMap.Marker(coords)
      marker.decorate(SMap.Marker.Feature.Draggable)
      layer.addMarker(marker)
      /*
      setState(prevState => ({
        markersList: [...prevState.markersList, { id: marker._id, coords }],
      }))*/
    }

    const dragMarker = e => {
      let marker = e.target
      let coords = marker.getCoords()
      /*
      this.setState(prevState => ({
        markersList: prevState.markersList.map(item =>
          item.id === e.target._id ? Object.assign({}, item, { coords }) : item,
        ),
      }))
      */
    }

    const removeMarker = e => {
      var marker = e.target
      var targetId = marker.getId()
      layer.removeMarker(marker)
      /*
      this.setState(prevState => ({
        markersList: prevState.markersList.filter(item => item.id !== targetId),
      }))*/
    }

    map.getSignals().addListener(window, "map-click", addMarker)
    map.getSignals().addListener(window, "marker-drag-stop", dragMarker)
    map.getSignals().addListener(window, "marker-click", removeMarker)
  }

  return (
    <MapContainer>
      <div ref={mapRef} style={{ height: 600 }} />
    </MapContainer>
  )
}

export default ExpertSheet
