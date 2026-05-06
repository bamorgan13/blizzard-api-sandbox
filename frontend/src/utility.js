export function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// fetchRetry attempts a refetch after a delay if we receive a 'Too Many Requests'
// response, otherwise throw the error
export async function fetchRetry({url, headers = {}, timeout = 3000, retries = 5}) {
	const res = await fetch(url, {headers});
	if (res.ok) return res.json();
	if (res.status === 429 && retries > 0) {
		await sleep(timeout);
		return fetchRetry(url, timeout, retries - 1);
	}
}

export function dateTimeTooltipFormat(datetime){
	const date = new Date(datetime);
	return date.toLocaleDateString() + ', ' + date.toLocaleTimeString();
}
