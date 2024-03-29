function rad2degr(rad: number) {
  return (rad * 180) / Math.PI
}
function degr2rad(degr: number) {
  return (degr * Math.PI) / 180
}
export default function getLatLngCenter(latLngInDegr: [number, number][]) {
  if (!latLngInDegr.length) return undefined

  var LATIDX = 0
  var LNGIDX = 1
  var sumX = 0
  var sumY = 0
  var sumZ = 0

  for (var i = 0; i < latLngInDegr.length; i++) {
    var lat = degr2rad(latLngInDegr[i][LATIDX])
    var lng = degr2rad(latLngInDegr[i][LNGIDX])
    // sum of cartesian coordinates
    sumX += Math.cos(lat) * Math.cos(lng)
    sumY += Math.cos(lat) * Math.sin(lng)
    sumZ += Math.sin(lat)
  }

  var avgX = sumX / latLngInDegr.length
  var avgY = sumY / latLngInDegr.length
  var avgZ = sumZ / latLngInDegr.length

  // convert average x, y, z coordinate to latitude and longtitude
  var lng = Math.atan2(avgY, avgX)
  var hyp = Math.sqrt(avgX * avgX + avgY * avgY)
  var lat = Math.atan2(avgZ, hyp)

  return { latitude: rad2degr(lat), longitude: rad2degr(lng) }
}
