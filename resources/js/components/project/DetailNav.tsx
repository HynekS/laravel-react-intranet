import { NavLink } from "react-router-dom"
import styled from "@emotion/styled"
import tw from "twin.macro"

import SvgClipboardList from "../../vendor/heroicons/outline/ClipboardList"
import SvgCurrencyDollar from "../../vendor/heroicons/outline/CurrencyDollar"
import SvgAcademicCap from "../../vendor/heroicons/outline/AcademicCap"
import SvgPaperClip from "../../vendor/heroicons/outline/PaperClip"
import { Detail, InvoiceView, ApprovalSheet, Files, GeoFeatures } from "./lazyImports"

import type { akce as Akce } from "../../types/model"

const activeClassName = "active"

const StyledNav = styled("nav")`
  ${tw`pt-4`}
  & ul {
    ${tw`flex`}
    position: relative;
    &::after {
      content: "";
      ${tw`bg-white`}
      height: 25px;
      left: 0;
      right: 10px;
      bottom: -25px;
      position: absolute;
      z-index: 10;
    }
  }
  & li {
    ${tw`mr-1`}
    display: inline-block;
    position: relative;
    transition: all 0.25s ease;
  }
`

const StyledNavLink = styled(NavLink)`
  ${tw`relative flex bg-gray-200 rounded-t py-2 pl-4 pr-6 font-semibold text-gray-600 hover:(text-blue-600 bg-blue-100 bg-opacity-50 transition duration-300) shadow-lg `}
  & svg {
    ${tw`opacity-25`}
  }
  &.${activeClassName} {
    padding-top: calc(0.5rem + 2px);
    margin-top: -2px;
    transition all 0s;
    ${tw`z-10 text-gray-700 bg-white rounded-t`}
    & svg {
      ${tw`opacity-50`}
    }
  }
`

type DetailNavProps = { detail: Akce & { user: { id: number; full_name: string } } }

const DetailNav = ({ detail }: DetailNavProps) => {
  return (
    <StyledNav>
      <ul>
        <li>
          <StyledNavLink
            to=""
            state={detail}
            end
            activeClassName={activeClassName}
            // className={({ isActive }) => (isActive ? 'active' : 'not-active')}
            onMouseOver={() => Detail.preload()}
          >
            <SvgClipboardList tw="flex w-6 mr-2" />
            <span>Údaje o akci</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink
            to="faktury"
            state={detail}
            activeClassName={activeClassName}
            onMouseOver={() => InvoiceView.preload()}
          >
            <SvgCurrencyDollar tw="flex w-6 mr-2" />
            <span>Faktury</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink
            to="expertni-list"
            state={detail}
            activeClassName={activeClassName}
            onMouseOver={() => ApprovalSheet.preload()}
          >
            <SvgAcademicCap tw="flex w-6 mr-2" />
            <span>Expertní list</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink
            to="lokalizace"
            state={detail}
            activeClassName={activeClassName}
            onMouseOver={() => GeoFeatures.preload()}
          >
            <SvgAcademicCap tw="flex w-6 mr-2" />
            <span>Lokalizace</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink
            to="nahrane-soubory"
            state={detail}
            activeClassName={activeClassName}
            onMouseOver={() => Files.preload()}
          >
            <SvgPaperClip tw="flex w-6 mr-2" />
            <span>Nahrané soubory</span>
          </StyledNavLink>
        </li>
      </ul>
    </StyledNav>
  )
}

export default DetailNav