module.exports = {
  theme: {
    stroke: theme => ({
      current: "currentColor",
      "red-400": theme("colors.red.400"),
      "green-400": theme("colors.green.400"),
    }),
    fill: theme => ({
      current: "currentColor",
      "red-100": theme("colors.red.100"),
      "green-100": theme("colors.green.100"),
    }),
    extend: {},
  },
}
