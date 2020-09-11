/** @jsx jsx */
import React from 'react'
import { jsx } from "@emotion/core"
import tw from "twin.macro"

const HeaderFlexWrapper = ({ children }) => (
  <div tw="flex-initial">
    {children}
  </div>
)

export default HeaderFlexWrapper