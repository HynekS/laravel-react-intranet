import { NavLink } from "react-router-dom"

const HomePageLink = () => {
  return (
    <div>
      <NavLink to="/" aria-label="návrat na domovskou stránku">
        <div tw="flex h-full items-center opacity-75">
          <img src="/images/logoipsum-237.svg" alt="logo" tw="w-36 h-auto my-auto" />
        </div>
      </NavLink>
    </div>
  )
}

export default HomePageLink
