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
          display: flex;
          position: relative;
          transition: all 0.25s ease;
        }
        & a {
          ${tw`relative flex bg-gray-200 rounded-t py-2 pl-4 pr-6 font-semibold text-gray-600 hover:(text-blue-600 bg-blue-100 bg-opacity-50 transition duration-300) shadow-lg `}
          & svg {
            ${tw`opacity-25`}
          }
          &.active {
            padding-top: calc(0.5rem + 2px);
            margin-top: -2px;
            transition all 0s;
            ${tw`z-10 text-gray-700 bg-white rounded-t`}
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
            <ClipboardListIcon tw="flex w-6 mr-2" />
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
            <CurrencyDollarIcon tw="flex w-6 mr-2" />
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
            <DocumentTextIcon tw="flex w-6 mr-2" />
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
            <LocationMarkerIcon tw="flex w-6 mr-2" />
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
            <PaperClipIcon tw="flex w-6 mr-2" />
            <span>Nahrané soubory</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}

export default DetailNav
