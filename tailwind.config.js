module.exports = {
  theme: {
    extend: {
      stroke: theme => ({
        "red-400": theme("colors.red.400"),
        "green-400": theme("colors.green.400"),
      }),
      fill: theme => ({
        "red-100": theme("colors.red.100"),
        "green-100": theme("colors.green.100"),
      }),
      inset: {
        "2": "0.5rem",
      },
      zIndex: {
        "-10": "-10",
      },
    },
  },
}
