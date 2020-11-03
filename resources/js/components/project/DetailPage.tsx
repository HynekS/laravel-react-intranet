/** @jsx jsx */
import React from "react"
import { jsx } from "@emotion/core"
import tw from "twin.macro"

const DetailPage = ({ children }) => (
  <div tw="w-full py-2 px-2 bg-gray-400 shadow-inner lg:(px-10)">{children}</div>
)

export default DetailPage
