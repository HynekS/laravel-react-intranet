let regex = /(\d+)\/(\d+)/

function replacer(_, g1, g2) {
	return g2 + g1.padStart(4, 0)
}

export function sortIdSlashYear(list, key) {
  return list.sort((a, b) => String(a[key]).replace(regex, replacer) - String(b[key]).replace(regex, replacer))
	
}

export default sortIdSlashYear