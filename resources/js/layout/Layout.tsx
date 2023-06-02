import { useState, useEffect, Fragment, type ReactNode } from "react"
import { NavLink } from "react-router-dom"
import { useLocation } from "react-router-dom"
import { PlusIcon } from "@heroicons/react/solid"
import tw from "twin.macro"

import Header from "./Header"
import YearList from "./YearList"
import Main from "./Main"
import RootFlexWrapper from "./RootFlexWrapper"
import HeaderFlexWrapper from "./HeaderFlexWrapper"
import ContentFlexWrapper from "./ContentFlexWrapper"
import HomePageLink from "./HomePageLink"
import UserWidget from "./UserWidget"

import AuthenticatedRoutes from "../AuthenticatedRoutes"
import HamburgerButton from "./HamburgerButton"

const CollapsibleMenuContent = ({ children }: { children: ReactNode }) => (
  <div tw="fixed bottom-0 right-0 left-0 top-12 min-h-screen w-full bg-white z-50 border-t">
    {children}
  </div>
)

const Layout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const closeOnEsc = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsMenuOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener("keyup", closeOnEsc)
    return () => {
      document.removeEventListener("keyup", closeOnEsc)
    }
  }, [])

  useEffect(() => {
    setIsMenuOpen(false)
  }, [location])

  const NavContentsWrapper = isMenuOpen ? CollapsibleMenuContent : Fragment
  return (
    <RootFlexWrapper>
      <HeaderFlexWrapper>
        <Header>
          <HomePageLink />
          <NavContentsWrapper>
            <YearList isMenuOpen={isMenuOpen} />
            <div
              css={[
                tw`hidden flex-col gap-6 px-4 md:(flex flex-row px-0) `,
                isMenuOpen && tw`flex`,
              ]}
            >
              <NavLink
                to="vytvorit-akci"
                aria-label="vytvořit novou akci"
                tw="px-2 py-1 my-auto text-sm border rounded flex mr-auto items-center text-gray-400"
              >
                <PlusIcon tw="w-4 h-4 mr-1 fill-current" />
                <span tw="font-medium text-gray-500">vytvořit novou akci</span>
              </NavLink>
              <UserWidget />
            </div>
          </NavContentsWrapper>
          <HamburgerButton
            isOpen={isMenuOpen}
            onClick={() => {
              setIsMenuOpen(!isMenuOpen)
            }}
            tw="md:hidden"
          />
        </Header>
      </HeaderFlexWrapper>
      <ContentFlexWrapper>
        <Main>
          <AuthenticatedRoutes />
        </Main>
      </ContentFlexWrapper>
    </RootFlexWrapper>
  )
}

export default Layout
