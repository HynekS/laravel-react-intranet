// @ts-check
/** @jsx jsx */
import React from "react"
import { jsx } from "@emotion/core"
import tw from "twin.macro"

// Todo move DetailPage out of project (it is a layout stuff)
import DetailPage from "../project/DetailPage"

const Dashboard = () => {
  return (
    <DetailPage>
      <div tw="p-4 bg-white rounded-lg lg:(p-8)">
        <h1 tw="text-xl">Dashboard</h1>
        <section tw="pb-8">
          <form action="">
            <label htmlFor="quicksearch" tw="block text-gray-700 text-sm font-bold mb-2">
              rychlé hledání
            </label>
            <input
              type="text"
              name="quicksearch"
              tw="bg-gray-200 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:transition-shadow focus:duration-300"
            />
          </form>
        </section>
        <section tw="pb-8">
          <h2 tw="text-lg">Statistiky</h2>
        </section>
      </div>
    </DetailPage>
  )
}

export default Dashboard
