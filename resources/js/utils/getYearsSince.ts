const getYearsSince = (year: number) =>
  Array.from({ length: new Date().getFullYear() - year + 1 }, (_, i) => i + year)

export default getYearsSince
