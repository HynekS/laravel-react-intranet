/** @jsx jsx */
import React from "react"
import { jsx } from "@emotion/core"
import tw from "twin.macro"

const DetailWrapper = ({ children }) => <div tw="w-full py-2 px-10 bg-gray-200 shadow-inner">{children}</div>

export default DetailWrapper
