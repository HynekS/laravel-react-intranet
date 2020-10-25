export const getFileExtension = filename =>
  filename.substring(filename.lastIndexOf(".") + 1, filename.length) || filename

export default getFileExtension
