import { NavLink } from "react-router-dom"

import { css } from "@emotion/react"
import tw from "twin.macro"

const style = css`
  ${tw`p-2 font-semibold text-blue-500 hover:text-blue-700`}
  &.active {
    ${tw`bg-blue-100`}
  }
`
const YearList = ({ isMenuOpen }: { isMenuOpen: boolean }) => {
  const currentYear = new Date().getFullYear()
  return (
    <section
      css={[tw`hidden flex-wrap px-4 py-2 flex-col md:(flex flex-row)`, isMenuOpen && tw`flex`]}
    >
      <NavLink css={style} to={`/akce`} end>
        vše
      </NavLink>
      {Array.from({ length: currentYear - 2013 }, (_, i) => currentYear - i).map((year, i) => (
        <NavLink
          css={style}
          to={`/akce/${year}`}
          key={year}
          aria-label={`akce registrované v roce ${year}`}
        >
          {year}
        </NavLink>
      ))}
    </section>
  )
}

export default YearList
