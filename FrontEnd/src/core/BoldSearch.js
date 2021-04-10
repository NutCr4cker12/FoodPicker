import React from 'react'

export const boldSearch = (text, search) => {
	if (!text || !search) return text;
	search = search.toLowerCase()
	text = text.toLowerCase()
	const split = text.split(search);
	const bolded = split.map((x, i) => {
		if (i === split.length - 1) return x;
		return (<span key={i}>{x}<b>{search}</b></span>)
	})
	return (
		<span>
			{bolded.map(x => x)}
		</span>
	)
}