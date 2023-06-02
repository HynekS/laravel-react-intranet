type Props = {
  children: React.ReactNode
}

const Header = ({ children }: Props) => {
  return (
    <header id="header">
      <nav
        tw="flex flex-wrap justify-between px-4 py-2 border-b"
        role="navigation"
        aria-label="main navigation"
      >
        {children}
      </nav>
    </header>
  )
}

export default Header
