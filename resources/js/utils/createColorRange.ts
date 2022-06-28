type Ran<T extends number> = number extends T ? number : _Range<T, []>
type _Range<T extends number, R extends unknown[]> = R["length"] extends T
  ? R[number]
  : _Range<T, [R["length"], ...R]>
type RGB = Ran<256>

type RGBColor = ReturnType<typeof colorFactory>

export const colorFactory = (r: RGB = 0, g: RGB = 0, b: RGB = 0) => {
  return { red: r, green: g, blue: b }
}

export const createColorRange = function (c1: RGBColor, c2: RGBColor, step = 16) {
  const colorList = []

  for (let i = 0; i < 255; i += step) {
    let tmpColor = colorFactory()
    tmpColor.red = (c1.red + Math.round((i * (c2.red - c1.red)) / 255)) as RGB
    tmpColor.green = (c1.green + Math.round((i * (c2.green - c1.green)) / 255)) as RGB
    tmpColor.blue = (c1.blue + Math.round((i * (c2.blue - c1.blue)) / 255)) as RGB

    colorList.push(`rgb(${tmpColor.red}, ${tmpColor.green}, ${tmpColor.blue})`)
  }
  return colorList
}
