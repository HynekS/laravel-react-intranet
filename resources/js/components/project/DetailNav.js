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
import { Detail, Invoices, ExpertSheet, Files } from "./lazyImports"

const activeClassName = "active"

const StyledNavLink = styled(NavLink)`
  ${tw`flex bg-gray-100 border-b-0 py-2 pl-4 pr-6 font-semibold text-gray-600 hover:text-blue-600 shadow-lg`}
  & svg {
    ${tw`opacity-25`}
  }
  &.${activeClassName} {
    ${tw`-mb-px bg-white border-l border-t border-r rounded-t text-gray-700`}
    & svg {
      ${tw`opacity-50`}
    }
  }
`

const DetailNav = ({ detail }) => {
  return (
    <nav tw="pt-4">
      <ul tw="flex border-b">
        <li tw="mr-1">
          <StyledNavLink to="" state={detail} activeClassName={activeClassName} onMouseOver={Detail.preload()}>
            <SvgClipboardList tw="flex w-6 mr-2" />
            <span>Údaje o akci</span>
          </StyledNavLink>
        </li>
        <li tw="mr-1">
          <StyledNavLink to="faktury" state={detail} activeClassName={activeClassName} onMouseOver={Invoices.preload()}>
            <SvgCurrencyDollar tw="flex w-6 mr-2" />
            <span>Faktury</span>
          </StyledNavLink>
        </li>
        <li tw="mr-1">
          <StyledNavLink to="expertni-list" state={detail} activeClassName={activeClassName} onMouseOver={ExpertSheet.preload()}>
            <SvgAcademicCap tw="flex w-6 mr-2" />
            <span>Expertní list</span>
          </StyledNavLink>
        </li>
        <li tw="mr-1">
          <StyledNavLink to="nahrane-soubory" state={detail} activeClassName={activeClassName} onMouseOver={Files.preload()}>
            <SvgPaperClip tw="flex w-6 mr-2" />
            <span>Nahrané soubory</span>
          </StyledNavLink>
        </li>
      </ul>
    </nav>
  )
}

export default DetailNav
