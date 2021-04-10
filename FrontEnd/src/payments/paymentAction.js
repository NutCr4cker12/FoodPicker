export const setData = (data) => {
	return { type: "SET_DATA", data }
}

export const setDeleteId = (id) => {
	return { type: "SET_DELETE_ID", id}
} 

export const setDistinctNotes = (notes) => {
    return { type: "SET_DISTINCT_NOTES", notes}
}