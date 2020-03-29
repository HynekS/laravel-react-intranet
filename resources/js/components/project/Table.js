import React, { useState, useEffect } from "react"
import { useLocation, useParams } from "react-router-dom"

import client from "../../utils/axiosWithDefaults"

const Table = props => {
  const [data, setData] = useState()
  let location = useLocation()
  let params = useParams() || {}

  console.log({ location, params })
  console.log({ ...props })

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await client.get(`akce/${params.year}`)
        setData(response)
      } catch (e) {
        console.log(e)
      }
    }
    fetchData()
    return () => {}
  }, [params])

  return (
    <div>
      <h1>Table</h1>
      {data && JSON.stringify(data)}
    </div>
  )
}

export default Table
