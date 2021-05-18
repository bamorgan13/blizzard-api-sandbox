export function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// fetchRetry attempts a refetch after a delay if we do not receive an ok response
export async function fetchRetry(url, timeout = 500) {
	const res = await fetch(url);
	if (res.ok) return res;
	await sleep(timeout);
	return fetchRetry(url, timeout);
}
