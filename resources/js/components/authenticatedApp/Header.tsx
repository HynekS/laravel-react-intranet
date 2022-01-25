type Props = {
  children: React.ReactNode
}

const Header = ({ children }: Props) => {
  return <header id="header">{children}</header>
}

export default Header
