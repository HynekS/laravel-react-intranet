import { useState } from "react"
import { useDispatch } from "react-redux"
import tw from "twin.macro"

import useOuterClick from "../../hooks/useOuterClick"

import { deletePointgroup, updatePointgroup } from "../../store/pointgroups"

import SvgLine from "../icons/SvgLine"
import SvgPoint from "../icons/SvgPoint"
import SvgPolygon from "../icons/SvgPolygon"
import SvgDotsHorizontalSolid from "../../vendor/heroicons/solid/DotsHorizontal"
import SvgTrashSolid from "../../vendor/heroicons/solid/Trash.js"

type FeatureType = "point" | "line" | "polygon"

const GeoFeaturesPointgroup = ({
  type,
  id,
  points,
  projectId,
  i,
  setData,
  activeIndexRef,
  activeIndex,
  rerenderOnActiveIndexChange,
}) => {
  const dispatch = useDispatch()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const innerRef = useOuterClick(() => {
    setIsMenuOpen(false)
  })

  const switchType = (type: FeatureType, id: number) => {
    setData(prevState =>
      prevState.map((pointgroup, i) =>
        i === activeIndexRef.current ? { ...pointgroup, type: type } : pointgroup,
      ),
    )
    dispatch(updatePointgroup({ pointgroupId: id, type, projectId }))
  }

  return (
    <div
      css={[
        tw`rounded border p-4 pt-2 pr-3 mb-4 relative opacity-75`,
        activeIndex === i &&
          tw` opacity-100 shadow before:(absolute top-0 left-0 right-0 block h-0.5 bg-blue-400)`,
      ]}
      onClick={() => {
        activeIndexRef.current = i
        rerenderOnActiveIndexChange(i)
      }}
    >
      <div tw="flex justify-between mb-2">
        <h4 tw="font-medium">
          {i + 1}: {type}
        </h4>
        <div>
          <button
            title="změnit typ na bod"
            css={[tw`border`, type === "point" && tw`bg-blue-200 text-blue-800 border-blue-300`]}
            onClick={() => switchType("point", id)}
          >
            <SvgPoint tw="w-6 h-6 p-0.5 fill-current" />
          </button>
          <button
            title="změnit typ na linii"
            css={[tw`border`, type === "line" && tw`bg-blue-200 text-blue-800 border-blue-300`]}
            onClick={() => switchType("line", id)}
          >
            <SvgLine tw="w-6 h-6 p-0.5 fill-current" />
          </button>
          <button
            title="změnit typ na polygon"
            css={[tw`border`, type === "polygon" && tw`bg-blue-200 text-blue-800 border-blue-300`]}
            onClick={() => switchType("polygon", id)}
          >
            <SvgPolygon tw="w-6 h-6 p-1 fill-current" />
          </button>
          <div ref={innerRef} tw="relative inline-block">
            <button tw="flex items-center pl-2" onClick={() => setIsMenuOpen(true)}>
              <SvgDotsHorizontalSolid tw="flex w-5 h-6 opacity-50" />
            </button>
            <div
              css={[
                tw`absolute right-0 z-10 invisible text-sm bg-white rounded shadow top-full`,
                isMenuOpen && tw`visible`,
              ]}
            >
              <button
                tw="flex items-center w-full p-2 pr-4 rounded rounded-b-none focus:(outline-none) hocus:(bg-gray-200) transition-colors duration-300"
                onClick={() => {
                  // Does not work, sadly.
                  //activeIndexRef.current = Math.max(i - 1, 0)
                  // rerenderOnActiveIndexChange(Math.max(i - 1, 0))

                  /*
                  setData(prevState => {
                    const index = prevState.findIndex(pointgroup => pointgroup.id === id)
                    return prevState.filter((_, i) => i !== index)
                  })*/

                  dispatch(deletePointgroup({ pointgroupId: id, projectId }))
                }}
              >
                <SvgTrashSolid tw="flex w-5 mr-2 opacity-50" />
                Odstranit
              </button>
            </div>
          </div>
        </div>
      </div>
      <ul tw="text-xs">
        {points.map(({ id, latitude, longitude }, i) => {
          return (
            <li key={id} tw="pb-2">
              <span tw="inline-block w-1/5">{i + 1}</span>
              <span tw="inline-block w-2/5">{Number(latitude).toFixed(7)}</span>
              <span tw="inline-block w-2/5">{Number(longitude).toFixed(7)}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default GeoFeaturesPointgroup
