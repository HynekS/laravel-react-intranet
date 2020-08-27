import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"

import client from "../../utils/axiosWithDefaults"
import Table from "./Table"

import { loadProgressBar } from "axios-progress-bar"
import "axios-progress-bar/dist/nprogress.css"

const TableDataProvider = props => {
  const [data, setData] = useState(null)
  let { year } = useParams() || {}

  useEffect(() => {
    let source = client.CancelToken.source()
    async function fetchData() {
      try {
        loadProgressBar({}, client)
        const response = await client.get(`akce/${year == undefined ? `` : year}`, {
          cancelToken: source.token,
        })
        setData(response.data)
      } catch (err) {
        if (client.isCancel(err)) {
          console.log("api request cancelled")
        } else {
          console.log(err)
        }
      }
    }
    fetchData()
    return () => {
      source.cancel()
      loadProgressBar({ progress: false })
    }
  }, [year])

  return data ? <Table rawData={data} {...props} /> : "Loading…"
}

export default TableDataProvider
