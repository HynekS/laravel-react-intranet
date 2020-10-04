/** @jsx jsx */
import React from 'react'
import { jsx } from "@emotion/core"
import tw from "twin.macro"

import SvgX from "../../vendor/heroicons/outline/X"

const ModalCloseButton = ({ handleClick }) => {
  return (
    <button onClick={handleClick}>
    <SvgX tw="w-6" />
  </button>
  )
}

export default ModalCloseButton