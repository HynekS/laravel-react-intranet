export const getFileExtension = (filename: string) =>
  filename.substring(filename.lastIndexOf(".") + 1, filename.length) || filename

export default getFileExtension
