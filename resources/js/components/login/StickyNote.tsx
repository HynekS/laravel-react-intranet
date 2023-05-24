const StickyNote = ({ onClick }: { onClick: React.MouseEventHandler<HTMLButtonElement> }) => {
  return (
    <div tw="relative w-48 overflow-hidden bg-yellow-100 shadow-2xl py-2 px-4 rounded rounded-tr-3xl border border-l-white border-t-white border-b-gray-300 border-r-gray-300 top-5 -left-1 transform -skew-x-3 font-family[cursive] text-sm rotate-[-2deg] after:(absolute top-0 right-0 bg-white w-4 h-4 shadow-lg border-b border-b-gray-300)">
      <p>jméno: test</p>
      <p>heslo: password</p>
      <button
        tw="rounded-t-lg border-b-4 border-b-red-400 py-1 mt-1 flex gap-1 text-orange-900 hocus:(gap-4 border-b-red-500) transition-all"
        onClick={onClick}
      >
        <span tw="bg-orange-300 bg-opacity-75 px-1">Vyplnit a přihlásit</span>
        <span>➟</span>
      </button>
    </div>
  )
}

export default StickyNote
