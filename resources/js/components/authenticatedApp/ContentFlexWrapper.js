/** @jsx jsx */
import React from "react"
import { jsx } from "@emotion/core"
import tw from "twin.macro"

const ContentFlexWrapper = ({ children }) => (
  <div tw="flex flex-col flex-auto overflow-y-auto">{children}</div>
)

export default ContentFlexWrapper
