import { useState, useRef, memo, Dispatch, SetStateAction, ChangeEvent } from "react"

import { useAppSelector } from "@hooks/useRedux"
import { createColorRange, colorFactory } from "@utils/createColorRange"
import getYearsSince from "@utils/getYearsSince"
import districtPaths from "./districtsPaths"

import type { StatsByYearsAndDistricts } from "@store/stats"

const MapWithTooltip = ({ ...props }) => {
  const [isInfoVisible, setIsInfoVisible] = useState(false)
  const [infoPosition, setInfoPosition] = useState({ x: 0, y: 0 })
  const [targetId, setTargetId] = useState<string | null>(null)
  const [selectedYear, setSelectedYear] = useState(() => new Date().getFullYear())

  const statsByYearAndDistrict = useAppSelector(store => store.stats.statsByYearsAndDistricts)
  const statsByYears = useAppSelector(store => store.stats.statsByYears)
  const currentStateSummary = useAppSelector(store => store.stats.currentStateSummary)

  const getAllTimeMaximum = () => {
    if (!statsByYearAndDistrict) return undefined

    let currentMaximum = 0

    Object.values(statsByYearAndDistrict).forEach(year => {
      Object.values(year).forEach(district => {
        if (district.all > currentMaximum) {
          currentMaximum = district.all
        }
      })
    })
    return currentMaximum
  }

  const allTimeMaximum = getAllTimeMaximum()

  const yearsSince2013reversed = getYearsSince(2014).reverse()

  const handleChange = (e: ChangeEvent) => {
    setSelectedYear(Number((e.target as HTMLInputElement).value))
  }

  return (
    <div>
      <div tw="h-[6.25rem]">
        {currentStateSummary ? (
          <div tw="mb-8">
            <h3 tw="font-bold">Současný stav akcí</h3>
            <dl tw="flex justify-between">
              <div tw="border-r px-4 w-1/4 gap-2">
                <dt tw="text-sm font-semibold text-gray-500">právě běží</dt>
                <dd tw="font-bold">
                  <span tw="text-xs">⛏️</span> {currentStateSummary[2]}
                </dd>
              </div>
              <div tw="border-r px-4  w-1/4">
                <dt tw="text-sm font-semibold text-gray-500">čeká na zahájení</dt>
                <dd tw="font-bold">
                  <span tw="text-xs">⏰</span> {currentStateSummary[1]}
                </dd>
              </div>
              <div tw="border-r px-4  w-1/4">
                <dt tw="text-sm font-semibold text-gray-500">zpracovává se</dt>
                <dd tw="font-bold">
                  <span tw="text-xs">💻</span> {currentStateSummary[3]}
                </dd>
              </div>
              <div tw="px-4  w-1/4">
                <dt tw="text-sm font-semibold text-gray-500">je ukončeno</dt>
                <dd tw="font-bold">
                  <span tw="text-xs">✔️</span> {currentStateSummary[4]}
                </dd>
              </div>
            </dl>
          </div>
        ) : null}
      </div>
      <Tooltip
        isVisible={isInfoVisible}
        position={infoPosition}
        id={targetId as string}
        stats={statsByYearAndDistrict}
        selectedYear={selectedYear}
      />
      <DistrictMap
        setIsVisible={setIsInfoVisible}
        setPosition={setInfoPosition}
        setId={setTargetId}
        stats={statsByYearAndDistrict}
        selectedYear={selectedYear}
        maximum={allTimeMaximum}
        {...props}
      ></DistrictMap>
      <div tw="mb-6 mt-1 flex justify-center">
        {yearsSince2013reversed.map(year => (
          <div tw="inline-block" key={year}>
            <input
              tw="appearance-none checked:sibling:(font-bold text-gray-600)"
              type="radio"
              value={String(year)}
              id={String(year)}
              name={String(year)}
              checked={selectedYear === year}
              onChange={handleChange}
            />
            <label htmlFor={String(year)} tw="text-sm text-gray-400 cursor-pointer px-2 py-1">
              {year}
            </label>
          </div>
        ))}
      </div>
      {statsByYears ? (
        <div tw="mb-4 text-sm text-gray-500">
          <h3 tw="font-bold text-center text-lg text-gray-300 pb-1">{selectedYear}</h3>
          <dl tw="flex justify-between">
            <div>
              <dt>celkem</dt>
              <dd tw="font-bold">{statsByYears[selectedYear].all}</dd>
            </div>
            <div>
              <dt>pozitivní</dt>
              <dd tw="font-bold">{statsByYears[selectedYear].positive}</dd>
            </div>
            <div tw="border-r pr-4">
              <dt>negativní</dt>
              <dd tw="font-bold">{statsByYears[selectedYear].negative}</dd>
            </div>
            <div>
              <dt>právě běží</dt>
              <dd tw="font-bold">{statsByYears[selectedYear][2]}</dd>
            </div>
            <div>
              <dt>čeká na zahájení</dt>
              <dd tw="font-bold">{statsByYears[selectedYear][1]}</dd>
            </div>
            <div>
              <dt>zpracovává se</dt>
              <dd tw="font-bold">{statsByYears[selectedYear][3]}</dd>
            </div>
            <div>
              <dt>je ukončeno</dt>
              <dd tw="font-bold">{statsByYears[selectedYear][4]}</dd>
            </div>
          </dl>
        </div>
      ) : null}
    </div>
  )
}

type TooltipProps = {
  isVisible: boolean
  position: { x: number; y: number }
  id: string | null
  stats: StatsByYearsAndDistricts | null
  selectedYear: number
} & React.HTMLProps<HTMLDivElement>

const Tooltip = ({ isVisible, position, id, stats, selectedYear, ...props }: TooltipProps) => {
  return id ? (
    <div
      tw="absolute p-2 pr-3 font-semibold text-white bg-gray-800 rounded pointer-events-none bg-opacity-80"
      style={{ display: isVisible ? "block" : "none", left: position.x + 10, top: position.y + 10 }}
    >
      <div tw="flex justify-between items-baseline">
        <span>{id}</span>
        {stats && stats[selectedYear][id] ? (
          <span tw="text-xs font-bold text-gray-400 ml-auto px-1">({selectedYear})</span>
        ) : null}
      </div>
      {stats && stats[selectedYear][id] ? (
        <ul tw="pt-1 pb-1.5 pr-2">
          <li tw="text-xs pb-0.5">
            <span tw="text-xs">⛏️ </span>
            <span {...(!stats[selectedYear][id][2] && { style: { opacity: 0.5 } })}>
              právě běží: {stats[selectedYear][id][2]}
            </span>
          </li>
          <li tw="text-xs pb-0.5">
            <span tw="text-xs">⏰ </span>
            <span {...(!stats[selectedYear][id][1] && { style: { opacity: 0.5 } })}>
              čeká na zahájení: {stats[selectedYear][id][1]}
            </span>
          </li>
          <li tw="text-xs pb-0.5">
            <span tw="text-xs">💻 </span>
            <span {...(!stats[selectedYear][id][3] && { style: { opacity: 0.5 } })}>
              zpracovává se: {stats[selectedYear][id][3]}
            </span>
          </li>
          <li tw="text-xs pb-0.5">
            <span tw="text-xs">✔️ </span>
            <span {...(!stats[selectedYear][id][4] && { style: { opacity: 0.5 } })}>
              je ukončeno: {stats[selectedYear][id][4]}
            </span>
          </li>
          <hr tw="my-1.5 opacity-50" />
          <li tw="text-xs pb-0.5">
            <span tw="w-2 h-2 rounded-full bg-orange-300 inline-block mr-1" />
            <span {...(!stats[selectedYear][id].negative && { style: { opacity: 0.5 } })}>
              negativní: {stats[selectedYear][id].negative}
            </span>
          </li>
          <li tw="text-xs pb-0.5">
            <span tw="w-2 h-2 rounded-full bg-green-300 inline-block mr-1" />
            <span {...(!stats[selectedYear][id].positive && { style: { opacity: 0.5 } })}>
              pozitivní: {stats[selectedYear][id].positive}
            </span>
          </li>
        </ul>
      ) : null}
    </div>
  ) : null
}

type DistrictMapProps = {
  setIsVisible: Dispatch<SetStateAction<boolean>>
  setPosition: Dispatch<SetStateAction<{ x: number; y: number }>>
  setId: Dispatch<SetStateAction<string | null>>
  stats: StatsByYearsAndDistricts | null
  selectedYear: number
  maximum: number | undefined
} & React.SVGProps<SVGSVGElement>

const DistrictMap = memo(
  ({
    fill,
    setIsVisible,
    setPosition,
    setId,
    stats,
    selectedYear,
    maximum = 200,
    ...props
  }: DistrictMapProps) => {
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
      e.persist()
      const target: EventTarget & React.SVGProps<SVGSVGElement> = e.target
      const { pageX: x, pageY: y } = e
      if (!target.id) {
        setIsVisible(false)
        setId(null)
      }
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        if (target.id) {
          setIsVisible(true)
          setId(target.id)
          setPosition({ x, y })
        }

        clearTimeout(timeoutRef.current as ReturnType<typeof setTimeout>)
        timeoutRef.current = null
      }, 100)
    }

    const defaultFill = "#e2e8f0"
    const colorRangeStep = 16
    const minColor = colorFactory(147, 197, 253)
    const maxColor = colorFactory(30, 64, 175)
    const colorRange = createColorRange(minColor, maxColor)

    return stats ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        x={0}
        y={0}
        width={605.13}
        height={373.53}
        viewBox="-2 236.44 605.13 373.53"
        xmlSpace="preserve"
        tw="text-blue-400 all-child:hover:(saturate-150	brightness-75) transition-colors duration-100"
        onMouseMove={handleMouseMove}
        {...props}
      >
        {districtPaths.map(({ id, d }) => (
          <path
            d={d}
            id={id}
            fill={
              stats[selectedYear][id]
                ? colorRange[
                    Math.floor((stats[selectedYear][id].all / maximum) * (colorRangeStep - 1))
                  ]
                : defaultFill
            }
            key={id}
          />
        ))}
      </svg>
    ) : null
  },
)

export default MapWithTooltip
