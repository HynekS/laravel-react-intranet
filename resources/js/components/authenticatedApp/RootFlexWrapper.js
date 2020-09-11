/** @jsx jsx */
import React from 'react'
import { jsx } from "@emotion/core"
import tw from "twin.macro"

const RootFlexWrapper = ({ children }) => (
  <div tw="flex flex-col h-full">
    {children}
  </div>
)

export default RootFlexWrapper