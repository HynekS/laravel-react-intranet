import { useState, useEffect, memo } from "react"

import client from "@services/http/client"

type SecuredImageProps = {
  path: string
} & JSX.IntrinsicElements["img"]

const SecuredImage = memo(({ path, ...props }: SecuredImageProps) => {
  const [imageDataUrl, setImageDataUrl] = useState<string | ArrayBuffer | null>()
  useEffect(() => {
    client
      .get(`/securedimage/${path}`, {
        responseType: "blob",
      })
      .then(response => {
        const reader = new window.FileReader()
        reader.readAsDataURL(response.data)
        reader.onload = function () {
          setImageDataUrl(reader.result)
        }
      })
  }, [path])
  return imageDataUrl ? <img src={String(imageDataUrl)} {...props} /> : null
})

export default SecuredImage
