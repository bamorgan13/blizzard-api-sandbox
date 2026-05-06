import { dateTimeTooltipFormat } from "../utility";
import { expansionTemplate } from "./defaults";

// Strips the large character and media objects down to data that will be used by the app
export function selectCharInfo(region, charData, media) {
	const assets = {};
	media.assets?.forEach((asset) => {
		assets[asset.key] = asset.value;
	});

	// Account for some older characters having different formatting if they have not logged in recently
	assets.avatar = media.avatar_url || assets.avatar;
	assets.inset = media.bust_url || assets.inset;
	assets["main-raw"] = media.render_url || assets["main-raw"];
	
	return {
		name: charData.name,
		region,
		realm: {
			name: charData.realm.name.en_US || charData.realm.name,
			slug: charData.realm.slug
		},
		level: charData.level,
		faction: charData.faction.name.en_US || charData.faction.name,
		gender: charData.gender.name.en_US || charData.gender.name,
		race: charData.race.name.en_US || charData.race.name,
		spec: charData.active_spec.name.en_US || charData.active_spec.name,
		class: charData.character_class.name.en_US || charData.character_class.name,
		ilvl: charData.equipped_item_level,
		guild: charData.guild ? charData.guild.name : 'No Guild',
		lastLogin: new Date(charData.last_login_timestamp).toLocaleString(),
		assets
	};
};

// Returns an array of simplified character data for each item in charHistory
// The simplified data is used to make history buttons in CharacterHistory component
export function selectIndexData(characterKeys, characterData) {
	return characterKeys.map((charKey) => {
		const iteratingChar = characterData[charKey];
		return {
			charKey: charKey,
			name: iteratingChar.name,
			avatarHref: iteratingChar.assets.avatar,
			realm: iteratingChar.realm.name,
			region: iteratingChar.region,
			class: iteratingChar.class
		};
	});
};

// Strips the large object of gear data to only that which will be used by the app
export function selectGearData(body) {
	const gearData = {};
	body.equipped_items.forEach((item) => {
		gearData[item.slot.name] = {
			id: item.item.id,
			ilvl: item.level.value,
			name: item.name,
			quality: item.quality.name
		};
	});
	return gearData;
};

// Strips the large object of mount data to only that which will be used by the app
export function selectCharMountData(body) {
	return body.mounts.map(({ mount, is_useable }) => ({
		id: mount.id,
		name: mount.name,
		is_useable
	}));
};

//  Strips, reformats, and combines mount details and media to relevent data
export function selectMountDetails(mountData, mediaData) {
	return {
		id: mountData.id,
		name: mountData.name,
		description: mountData.description,
		faction: mountData.faction ? mountData.faction.name : 'NoFaction',
		media: {
			id: mountData.creature_displays[0].id,
			href: mediaData.assets[0].value
		}
	};
};

// Strips the large object of pet data to only that which will be used by the app
export function selectCharPetData(body) {
	return body.pets.map((pet) => ({
		id: pet.id,
		speciesId: pet.species.id,
		creatureDisplayId: pet.creature_display ? pet.creature_display.id : null,
		speciesName: pet.species.name,
		nickname: pet.name,
		level: pet.level,
		quality: pet.quality.name,
		isFavorite: pet.is_favorite
	}));
};

// Strips, reformats, and combines pet details and media to relevent data
// A defaultPet is created due to some requests for character pets results in 404s
// from Blizzard API. If that data doesn't exist we still want to have the keys
// present in our returned object.
export function selectPetDetails(petData, mediaData) {
	let selected = { ...defaultPet };
	if (petData) {
		selected = {
			...selected,
			id: petData.id,
			name: petData.name,
			type: {
				id: petData.battle_pet_type.id,
				name: petData.battle_pet_type.name
			},
			description: petData.description,
			media: {
				id: petData.media.id,
				icon: petData.icon
			}
		};
	}
	if (mediaData) {
		selected.media.href = mediaData.assets[0].value;
	}

	return selected;
};

const defaultPet = {
	id: null,
	name: null,
	type: {
		id: null,
		name: null
	},
	description: null,
	media: {
		id: null,
		icon: null
	}
};

// Strips realm data object to dev-friendly array of objects representing the name and slug
export function selectAvailableRealms(realmData) {
	const availableRealms = realmData.realms.map((realm) => {
		return { name: realm.name, slug: realm.slug };
	});
	// Add default unselected state
	availableRealms.push({ name: '--Select Realm--', slug: '' });
	// Sort realms alphabetically by name instead of the default id
	return availableRealms.sort((a, b) => (a.name < b.name ? -1 : 1));
};

// Mappings of naming convention exceptions for Wowhead pages
// Wowhead uses /zone={zone-id}/{instance-name} for their instance articles
// Wowhead post-Shadowlands instances no longer redirect from /{instance-name} to the appropriate article
// Blizzard API does not provide the zone id with the instance data calls, so post-Shadowlands instances are currently hard-coded
// Constructing a link programmatically to match Wowhead conventions is only possible if either Wowhead implements redirects for 
// the more recent expansions, or if Blizzard returns zone data with their instances.
const instanceNameFormatExceptions = {
	'The Battle for Mount Hyjal': 'hyjal-summit',
	'Deadmines': 'the-deadmines',
	'Eye of Azshara': 'eye-of-azshara-dungeon',
	'Assault on Violet Hold': 'violet-hold',
	'Seat of the Triumvirate': 'the-seat-of-the-triumvirate',
	
	// Dungeons post-Shadowlands
	// Dragonflight
	'Algeth\'ar Academy': 'zone=14032/algethar-academy',
	'Brackenhide Hollow': 'zone=13991/brackenhide-hollow',
	'Halls of Infusion': 'zone=14082/halls-of-infusion',
	'Neltharus': 'zone=14011/neltharus',
	'Ruby Life Pools': 'zone=14063/ruby-life-pools',
	'The Azure Vault': 'zone=13954/the-azure-vault',
	'The Nokhud Offensive': 'zone=13982/the-nokhud-offensive',
	'Uldaman: Legacy of Tyr': 'zone=13968/uldaman',
	// The War Within
	'Darkflame Cleft': 'zone=14882/darkflame-cleft',
	'Priory of the Sacred Flame': 'zone=14954/priory-of-the-sacred-flame',
	'The Rookery': 'zone=14938/the-rookery',
	'The Stonevault': 'zone=14883/the-stonevault',
	'The Dawnbreaker': 'zone=14971/the-dawnbreaker',
	'Ara-Kara, City of Echoes': 'zone=15093/ara-kara-city-of-echoes',
	'Cinderbrew Meadery': 'zone=15103/cinderbrew-meadery',
	'City of Threads': 'zone=14979/city-of-threads',
	'Operation: Floodgate': 'zone=15452/operation-floodgate',
	'Eco-Dome Al\'dani': 'zone=16104/eco-dome-aldani',
	// Midnight
	'Den of Nalorakk': 'zone=16368/den-of-nalorakk',
	'Magisters\' Terrace': 'zone=15829/magisters-terrace',
	'Maisara Caverns': 'zone=16395/maisara-caverns',
	'Murder Row': 'zone=16091/murder-row',
	'Nexus-Point Xenas': 'zone=16573/nexus-point-xenas',
	'The Blinding Vale': 'zone=16359/the-blinding-vale',
	'Voidscar Arena': 'zone=16425/voidscar-arena',
	'Windrunner Spire': 'zone=15808/windrunner-spire',

	// Raids post-Shadowlands
	// Dragonflight
	'Vault of the Incarnates': 'zone=14030/vault-of-the-incarnates',
	'Aberrus, the Shadowed Crucible': 'zone=14663/aberrus-the-shadowed-crucible',
	'Amirdrassil, the Dream\'s Hope': 'zone=14643/amirdrassil-the-dreams-hope',
	// The War Within
	'Nerub-ar Palace': 'zone=14980/nerub-ar-palace',
	'Liberation of Undermine': 'zone=15522/liberation-of-undermine',
	'Manaforge Omega': 'zone=16178/manaforge-omega',
	// Midnight
	'The Dreamrift': 'zone=16531/the-dreamrift',
	'The Voidspire': 'zone=16340/the-voidspire',
	'March on Quel\'Danas': 'zone=16342/isle-of-queldanas'

}

function formatWowheadInstanceTitle(instanceName) {
	// If the instance name has a Wowhead article naming convention exception, 
	// return the correct article title immediately for it, otherwise convert with 
	// standard process, stripping apostrophes('), exclamation points(!), 
	// colons(:), and commas(,) and replacing spaces( ) with dashes(-)
	if (instanceName in instanceNameFormatExceptions) return instanceNameFormatExceptions[instanceName];
	
	return instanceName.toLowerCase().replaceAll(' ', '-').replaceAll(/'|,|!|:/g, '');
}

// Strips raid or dungeon data (the 'type' provided) to relevent data, including 
// the name, id, expansion, modes and their progress, and the number/latest kill
export function selectCharInstanceData(body, type) {
	const charInstanceData = {...expansionTemplate};
	
	// If a character has no raid data, Blizzard API still returns a successful 
	// response of an object with basic character data instead of raid data.
	// If this occurs, return the empty raidData object we created before trying 
	// to unpack the non-existent raid data from the response.
	if (!body.expansions) return charInstanceData;

	body.expansions.forEach((expansion) => {
		// Current Season is often incorrect and returning more dungeons Blizzard's API than are current and are skipped
		if (expansion.expansion.name === "Current Season") return;

		const expansionData = {
			name : expansion.expansion.name,
			id: expansion.expansion.id,
			instances : {}
		};
		
		expansion.instances.forEach((instance) => {
			const instanceData = {
				name: instance.instance.name,
				id: instance.instance.id,
				modes: {}
			}

			instance.modes.forEach((mode) => {
				// Follower dungeons do not have full details returned from Blizzard's API and are skipped
				if (!mode.difficulty.name) return;
				
				const modeData = {
					name: mode.difficulty.name,
					status: mode.status.type[0] + mode.status.type.slice(1).toLowerCase(),
				};
				if (type === 'raid'){
					modeData.progress = {
						completed: mode.progress.completed_count,
						total: mode.progress.total_count
					}
				} else if (type === 'dungeon') {
					modeData.completedCount = mode.progress.encounters[0].completed_count;
					modeData.lastKill = dateTimeTooltipFormat(mode.progress.encounters[0].last_kill_timestamp);
				}

				instanceData.modes[mode.difficulty.name] = modeData;
			})

			expansionData.instances[instance.instance.name] = instanceData;
		})

		charInstanceData[expansion.expansion.name] =  expansionData;
	});
	return charInstanceData;
};

//  Strips, reformats, and combines dungeon details and media to relevent data
export function selectInstanceDetails(instanceData, mediaData) {
	return {
		id: instanceData.id,
		name: instanceData.name,
		description: instanceData.description,
		wowheadTitle: formatWowheadInstanceTitle(instanceData.name),
		media: {
			id: instanceData.media.id,
			href: mediaData.assets[0].value
		}
	};
};
