const dayMs = 24 * 60 * 60 * 1000

const getShortTime = (date, short) => {
	const d = date.getDate()
	const m = date.getMonth() + 1
	if (short) return `${d}.${m}`
	const year = date.getFullYear().toString().substr(2)
	return `${d}.${m}.${year}`
}

const getDateText = (start, end) => {
	const numDays = Math.floor((end - start) / dayMs)
	const days = numDays < 2 ? "day" : "days"
	const today = new Date()
	const diff = Math.round((today - end) / dayMs)
	var ago;
	if (diff > 356) {
		ago = "Over a Year ago"
	} else if (diff > 30) {
		const m = Math.round(diff / 30)
		ago = `${m} month${m > 1 ? "s" : ""} ago`
	} else if (diff > 7) {
		const w = Math.round(diff / 7)
		ago = `${w} week${w > 1 ? "s" : ""} ago`
	} else if (diff > 0) {
		ago = `${diff} day${diff > 1 ? "s" : ""} ago`
	} else if (diff === 0) {
		ago = "today"
	} else if (diff === -1) {
		ago = "tomorrow"
	} else if (diff < -1) {
		ago = `in ${diff * (-1)} days`
	}
	return `${ago} - ${getShortTime(start, true)}-${getShortTime(end)} (${numDays} ${days} food)`
}

/**
 * dates = Array of date objects
 * return Array of strings
 * @param {Array} dates 
 */
export default (dates, maxLength = 10) => {
	if (!dates.length) return []
	dates = dates.sort((a, b) => b - a)
	const arr = []
	var firstDate = dates[0]
	var latestDate = dates[0]
	dates.forEach((date, i) => {
		if (arr.length >= maxLength) return arr
		// start of new date clamp
		if (latestDate - date > 2 * dayMs ) {
			arr.push(getDateText(firstDate, latestDate))
			firstDate = date;
			latestDate = date;
			return
		}
		firstDate = date
		if (i === dates.length - 1) {
			arr.push(getDateText(firstDate, latestDate))
		}
	});
	return arr
}