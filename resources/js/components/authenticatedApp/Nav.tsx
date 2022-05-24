import { NavLink } from "react-router-dom"

import { css } from "@emotion/react"
import tw from "twin.macro"

const style = css`
  ${tw`p-2 font-semibold text-blue-500 hover:text-blue-700`}
  &.active {
    ${tw`bg-blue-100`}
  }
`
const Nav = () => {
  const currentYear = new Date().getFullYear()
  return (
    <nav tw="flex flex-wrap px-4 py-2">
      <NavLink css={style} to={`/akce`} end>
        vše
      </NavLink>
      {Array.from({ length: currentYear - 2013 }, (_, i) => currentYear - i).map((year, i) => (
        <NavLink
          css={style}
          to={`/akce/${year}`}
          key={year}
          aria-label={`akce proběhlé v roce ${year}`}
        >
          {year}
        </NavLink>
      ))}
    </nav>
  )
}

export default Nav
