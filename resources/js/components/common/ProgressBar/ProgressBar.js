// @ts-check
/** @jsx jsx */
import React from "react"
// import "./ProgressBar.css";
import { jsx } from "@emotion/core"
import tw from "twin.macro"

export const ProgressBar = ({ progress }) => (
  <div tw="h-2 rounded">
    <Filler progress={progress} />
  </div>
)

export const Filler = ({ progress }) => (
  <div
    tw="bg-blue-400 h-full"
    style={{
      // width: `${progress}%`
      borderRadius: "inherit",
      transform: `scaleX(${progress / 100})`,
      transformOrigin: "left",
      transition: "transform 0.2s ease-in",
    }}
  />
)
