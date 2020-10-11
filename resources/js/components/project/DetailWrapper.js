/** @jsx jsx */
import React from "react"
import { jsx } from "@emotion/core"
import tw from "twin.macro"

const DetailWrapper = ({ children }) => (
  <div
    tw="bg-white relative pt-6 pb-8 px-4 rounded-md rounded-tl-none lg:(px-8)"
    style={{ boxShadow: "0 10px 15px rgba(0,0,0,0.1), 0 0 6px rgba(0,0,0,0.05)" }}
  >
    {children}
  </div>
)

export default DetailWrapper
