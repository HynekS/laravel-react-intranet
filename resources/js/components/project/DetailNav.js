import React from "react"
import { NavLink } from "react-router-dom"

const DetailNav = ({ detail }) => {
  return (
    <nav>
      <NavLink to="" state={detail}>Údaje o akci</NavLink>
      <NavLink to="faktury" state={detail}>Faktury</NavLink>
      <NavLink to="expertni-list" state={detail}>Expertní list</NavLink>
      <NavLink to="nahrane-soubory" state={detail}>Nahrané soubory</NavLink>
    </nav>
  )
}

export default DetailNav
