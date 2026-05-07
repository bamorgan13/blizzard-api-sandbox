import { selectMountDetails } from "./store/selectors";
import { receiveMountDetails } from "./store/mounts";
import { selectPetDetails } from "./store/selectors";
import { receivePetDetails } from "./store/pets";

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

export async function batchFetchUrls({urls, batchAmount = 50, headers = {}, timeout = 3000}) {
	const numBatches = Math.ceil(urls.length / batchAmount);
	const results = [];
	for (let i = 0; i < numBatches; i++) {
		const batchUrls = urls.slice(i * batchAmount, (i + 1) * batchAmount);
		const batchResults = await Promise.all(batchUrls.map(url => fetchRetry({url, headers, timeout})));
		results.push(...batchResults);
	}
	return results;
}

export async function batchFetchMounts({mounts, batchAmount = 50, headers = {}, timeout = 1200, dispatch}) {
	const numBatches = Math.ceil(mounts.length / batchAmount);
	for (let i = 0; i < numBatches; i++) {
		const batchMounts = mounts.slice(i * batchAmount, (i + 1) * batchAmount);
		await Promise.all(batchMounts.map(async mount => {
			let mountData = await fetch(`https://us.api.blizzard.com/data/wow/mount/${mount.id}?namespace=static-us&locale=en_US`,{
				headers
			});
			mountData = await mountData.json();
		
			let mediaData = await fetch(`https://us.api.blizzard.com/data/wow/media/creature-display/${mountData.creature_displays[0].id}?namespace=static-us&locale=en_US`, {
				headers
			});
			mediaData = await mediaData.json();
			
			// selectMountDetails extracts only the relevant data from the Blizzard API response to be stored in our Redux store
			const selectedData = selectMountDetails(mountData, mediaData);
			// Dispatching each mount's details as they are fetched to allow for progressive loading of media in the UI
			dispatch(receiveMountDetails(selectedData));
		}));
		//  Delay between batches to prevent 'Too Many Requests' responses from Blizzard API
		await sleep(timeout);
	}
}

export async function batchFetchPets({pets, batchAmount = 50, headers = {}, timeout = 1200, dispatch}) {
	const numBatches = Math.ceil(pets.length / batchAmount);
	for (let i = 0; i < numBatches; i++) {
		const batchPets = pets.slice(i * batchAmount, (i + 1) * batchAmount);
		await Promise.all(batchPets.map(async pet => {
			let petData = await fetch(`https://us.api.blizzard.com/data/wow/pet/${pet.speciesId}?namespace=static-us&locale=en_US`,{
				headers
			});
			petData = await petData.json();
		
			let mediaData = await fetch(petData.media.key.href, {
				headers
			});
			mediaData = await mediaData.json();
			
			// selectPetDetails extracts only the relevant data from the Blizzard API response to be stored in our Redux store
			const selectedData = selectPetDetails(petData, mediaData);
			// Dispatching each pet's details as they are fetched to allow for progressive loading of media in the UI
			dispatch(receivePetDetails(selectedData));
		}));
		//  Delay between batches to prevent 'Too Many Requests' responses from Blizzard API
		await sleep(timeout);
	}
}

export function dateTimeTooltipFormat(datetime){
	const date = new Date(datetime);
	return date.toLocaleDateString() + ', ' + date.toLocaleTimeString();
}
