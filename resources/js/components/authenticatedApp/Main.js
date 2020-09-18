/** @jsx jsx */
import React from "react"
import { jsx } from "@emotion/core"
import tw from "twin.macro"

const Main = ({ children }) => {
  return <main tw="flex flex-auto bg-gray-400 shadow-inner">{children}</main>
}

export default Main
