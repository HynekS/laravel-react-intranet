import React from "react"

const Logo = ({ src = "/images/logo.png", alt = "logo společnosti Pueblo" }) => {
  return <img src={src} alt={alt} width={227} height={135} />
}

export default Logo
