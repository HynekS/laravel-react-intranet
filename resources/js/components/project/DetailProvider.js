import React, { useState, useEffect } from "react"
import { useParams, useLocation } from "react-router-dom"

import client from "../../utils/axiosWithDefaults"
import DetailRoutes from "./DetailRoutes"
import DetailNav from "./DetailNav"
import DetailWrapper from "./DetailWrapper"

const DetailProvider = ({ children }) => {
  const [data, setData] = useState()

  const { state } = useLocation()
  const params = useParams() || {}

  useEffect(() => {
    let source = client.CancelToken.source()
    async function fetchData() {
      try {
        const response = await client.get(`akce/${params.year}/${params.num}`, {
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
    if (state) {
      setData(state)
    } else {
      fetchData()
    }
    return () => {
      source.cancel()
    }
  }, [params])

  return data ? (
    <DetailWrapper>
      <DetailNav detail={data} />
      <DetailRoutes detail={data}></DetailRoutes>
    </DetailWrapper>
  ) : (
    <div>Loading data…</div>
  )
}

export default DetailProvider
