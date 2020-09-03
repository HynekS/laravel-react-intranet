/** @jsx jsx */
import React from "react"
import { NavLink } from "react-router-dom"
import styled from "@emotion/styled"
import { jsx } from "@emotion/core"
import tw from "twin.macro"

import SvgClipboardList from "../../vendor/heroicons/outline/ClipboardList"
import SvgCurrencyDollar from "../../vendor/heroicons/outline/CurrencyDollar"
import SvgAcademicCap from "../../vendor/heroicons/outline/AcademicCap"
import SvgPaperClip from "../../vendor/heroicons/outline/PaperClip"

const activeClassName = "active"

const StyledNavLink = styled(NavLink)`
  ${tw`flex bg-white border-b-0 py-2 px-4 font-semibold text-gray-600 hover:text-blue-600`}
  & svg {
    ${tw`opacity-50`}
  }
  &.${activeClassName} {
    ${tw`-mb-px border-l border-t border-r rounded-t text-gray-700`}
    & svg {
      ${tw`opacity-100`}
    }
  }
`

const DetailNav = ({ detail }) => {
  return (
    <nav tw="pt-4">
      <ul tw="flex border-b">
        <li tw="mr-1">
          <StyledNavLink to="" state={detail} activeClassName={activeClassName}>
            <SvgClipboardList tw="flex w-4 mr-2" />
            <span>Údaje o akci</span>
          </StyledNavLink>
        </li>
        <li tw="mr-1">
          <StyledNavLink to="faktury" state={detail} activeClassName={activeClassName}>
            <SvgCurrencyDollar tw="flex w-4 mr-2" />
            <span>Faktury</span>
          </StyledNavLink>
        </li>
        <li tw="mr-1">
          <StyledNavLink to="expertni-list" state={detail} activeClassName={activeClassName}>
            <SvgAcademicCap tw="flex w-4 mr-2" />
            <span>Expertní list</span>
          </StyledNavLink>
        </li>
        <li tw="mr-1">
          <StyledNavLink to="nahrane-soubory" state={detail} activeClassName={activeClassName}>
            <SvgPaperClip tw="flex w-4 mr-2" />
            <span>Nahrané soubory</span>
          </StyledNavLink>
        </li>
      </ul>
    </nav>
  )
}

export default DetailNav
