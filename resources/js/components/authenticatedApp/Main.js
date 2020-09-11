/** @jsx jsx */
import React from "react"
import { jsx } from "@emotion/core"
import tw from "twin.macro"

const Main = ({ children }) => {
  return <main tw="flex flex-auto">{children}</main>
}

export default Main
