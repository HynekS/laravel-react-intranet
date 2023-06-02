import { NavLink } from "react-router-dom"

const HomePageLink = () => {
  return (
    <div>
      <NavLink to="/" aria-label="návrat na domovskou stránku">
        <div tw="flex w-8 overflow-hidden h-full items-center opacity-75 md:w-36">
          <img src="/images/logoipsum-237.svg" alt="logo" tw="w-36 h-auto my-auto max-w-none" />
        </div>
      </NavLink>
    </div>
  )
}

export default HomePageLink
