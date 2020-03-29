import React from "react"

const Logo = ({ src = "/images/logo.png", alt = "logo společnosti Pueblo" }) => {
  return <img src={src} alt={alt} />
}

export default Logo
