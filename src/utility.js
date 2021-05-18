export function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// fetchRetry attempts a refetch after a delay if we receive a 'Too Many Requests'
// response, otherwise throw the error
export async function fetchRetry(url, timeout = 500) {
	const res = await fetch(url);
	if (res.ok) return res;
	if (res.status === 429) {
		await sleep(timeout);
		return fetchRetry(url, timeout);
	} else {
		throw new Error(res);
	}
}
