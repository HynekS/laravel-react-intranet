import { useState, forwardRef } from "react"
import { useDispatch } from "react-redux"
import tw from "twin.macro"

import useOuterClick from "../../hooks/useOuterClick"

import { deletePointgroup, updatePointgroup } from "../../store/pointgroups"

import SvgLine from "../icons/SvgLine"
import SvgPoint from "../icons/SvgPoint"
import SvgPolygon from "../icons/SvgPolygon"
import { DotsHorizontalIcon } from "@heroicons/react/solid"
import { TrashIcon } from "@heroicons/react/solid"

type FeatureType = "point" | "line" | "polygon"

const GeoFeaturesPointgroup = ({
  feature_type,
  id,
  points,
  projectId,
  i,
  setData,
  activeIndexRef,
  activeIndex,
  setActiveIndex,
}) => {
  const dispatch = useDispatch()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const innerRef = useOuterClick<HTMLDivElement>(() => {
    setIsMenuOpen(false)
  })

  const switchType = (feature_type: FeatureType, id: number, i) => {
    setData(prevState =>
      prevState.map((pointgroup, idx) =>
        i === idx ? { ...pointgroup, feature_type } : pointgroup,
      ),
    )
    dispatch(updatePointgroup({ pointgroupId: id, feature_type, projectId }))
  }

  return (
    <div
      css={[
        tw`relative p-4 pt-2 pr-3 mb-4 border rounded opacity-75`,
        activeIndex === i &&
          tw` opacity-100 shadow before:(absolute top-0 left-0 right-0 block h-0.5 bg-blue-400)`,
      ]}
      onClick={() => {
        // This is sadly neccessary to sync the map markers with the state
        activeIndexRef.current = i
        setActiveIndex(i)
      }}
    >
      <div tw="flex justify-between mb-2">
        <h4 tw="font-medium">
          {i + 1}: {feature_type}
        </h4>
        <div>
          <button
            title="změnit typ na bod"
            css={[
              tw`border`,
              feature_type === "point" && tw`text-blue-800 bg-blue-200 border-blue-300`,
            ]}
            onClick={() => switchType("point", id, i)}
          >
            <SvgPoint tw="w-6 h-6 p-0.5 fill-current" />
          </button>
          <button
            title="změnit typ na linii"
            css={[
              tw`border`,
              feature_type === "line" && tw`text-blue-800 bg-blue-200 border-blue-300`,
            ]}
            onClick={() => switchType("line", id, i)}
          >
            <SvgLine tw="w-6 h-6 p-0.5 fill-current" />
          </button>
          <button
            title="změnit typ na polygon"
            css={[
              tw`border`,
              feature_type === "polygon" && tw`text-blue-800 bg-blue-200 border-blue-300`,
            ]}
            onClick={() => switchType("polygon", id, i)}
          >
            <SvgPolygon tw="w-6 h-6 p-1 fill-current" />
          </button>
          <div ref={innerRef} tw="relative inline-block">
            <button tw="flex items-center pl-2" onClick={() => setIsMenuOpen(true)}>
              <DotsHorizontalIcon tw="flex w-5 h-6 opacity-50" />
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
                  dispatch(deletePointgroup({ pointgroupId: id, projectId }))
                }}
              >
                <TrashIcon tw="flex w-5 mr-2 opacity-50" />
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
