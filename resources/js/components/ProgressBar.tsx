type Props = {
  progress: number
}

export const ProgressBar = ({ progress }: Props) => (
  <div tw="h-2 rounded">
    <Filler progress={progress} />
  </div>
)

export const Filler = ({ progress }: Props) => (
  <div
    tw="h-full bg-blue-400"
    style={{
      borderRadius: "inherit",
      transform: `scaleX(${progress / 100})`,
      transformOrigin: "left",
      transition: "transform 0.2s ease-in",
    }}
  />
)
