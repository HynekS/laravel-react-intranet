import { NavLink } from "react-router-dom"
import { css } from "@emotion/react"
import tw from "twin.macro"

import {
  ClipboardListIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  LocationMarkerIcon,
  PaperClipIcon,
} from "@heroicons/react/outline"
import { Detail, InvoiceView, ApprovalSheet, Files, GeoFeatures } from "./lazyImports"

import type { akce as Akce } from "@codegen"

type DetailNavProps = { detail: Akce & { user: { id: number; full_name: string } } }

const DetailNav = ({ detail }: DetailNavProps) => {
  return (
    <nav
      css={css`
        ${tw`pt-4`}
        & ul {
          ${tw`relative inline-flex flex-wrap`}
          &::after {
            content: "";
            ${tw`absolute z-10 bg-white`}
            height: 24px;
            left: 1px;
            right: -2px;
            top: calc(100% + 1px);
          }
        }
        & li {
          ${tw`relative flex mr-1 flex-[1 0 30%] md:flex-auto`}
          transition: all 0.25s ease;
        }
        & a {
          ${tw`relative w-full flex bg-white rounded-t border border-gray-300 border-b-transparent font-semibold text-gray-500 py-2 pl-2 pr-3 justify-center text-sm shadow-[0 -2px 15px -3px rgba(0, 0, 0, 0.075), 0 -4px 6px -2px rgba(0, 0, 0, 0.05)] md:(pl-4 pr-6 text-base w-auto shadow-lg) hover:(text-blue-500 bg-blue-100 border-opacity-75 border-blue-200 border-b-transparent bg-opacity-50 transition duration-300)`}
          & svg {
            ${tw`opacity-25 mb-auto md:mb-[unset]`}
          }
          &.active {
            padding-top: calc(0.5rem + 3px);
            margin-top: -3px;
            transition-duration: 0s;

            ${tw`relative z-10 text-gray-700 bg-white border-t-2 border-gray-200 rounded-t border-b-transparent border-t-blue-500 md:(top-px)`}
            & svg {
              ${tw`opacity-50`}
            }
          }
        }
      `}
    >
      <ul>
        <li>
          <NavLink
            to=""
            state={detail}
            end
            className={({ isActive }) => (isActive ? "active" : "")}
            onMouseOver={() => Detail.preload()}
          >
            <ClipboardListIcon tw="flex w-5 mr-1.5 md:(w-6 mr-2)" />
            <span>Údaje o akci</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="faktury"
            state={detail}
            className={({ isActive }) => (isActive ? "active" : "")}
            onMouseOver={() => InvoiceView.preload()}
          >
            <CurrencyDollarIcon tw="flex w-5 mr-1.5 md:(w-6 mr-2)" />
            <span>Faktury</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="expertni-list"
            state={detail}
            className={({ isActive }) => (isActive ? "active" : "")}
            onMouseOver={() => ApprovalSheet.preload()}
          >
            <DocumentTextIcon tw="flex w-5 mr-1.5 md:(w-6 mr-2)" />
            <span>Expertní list</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="lokalizace"
            state={detail}
            className={({ isActive }) => (isActive ? "active" : "")}
            onMouseOver={() => GeoFeatures.preload()}
          >
            <LocationMarkerIcon tw="flex w-5 mr-1.5 md:(w-6 mr-2)" />
            <span>Lokalizace</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="nahrane-soubory"
            state={detail}
            className={({ isActive }) => (isActive ? "active" : "")}
            onMouseOver={() => Files.preload()}
          >
            <PaperClipIcon tw="flex w-5 mr-1.5 md:(w-6 mr-2)" />
            <span>Nahrané soubory</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}

export default DetailNav
