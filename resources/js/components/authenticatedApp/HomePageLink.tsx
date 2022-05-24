import { NavLink } from "react-router-dom"

import LogoThumb from "../common/LogoThumb"

const HomePageLink = () => {
  return (
    <div>
      <NavLink to="/" aria-label="návrat na domovskou stránku">
        <LogoThumb />
      </NavLink>
    </div>
  )
}

export default HomePageLink
