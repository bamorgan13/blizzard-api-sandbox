export const defaultGear = { bryce_morgan: {} };
[
	'Head',
	'Neck',
	'Shoulders',
	'Shirt',
	'Chest',
	'Waist',
	'Legs',
	'Feet',
	'Wrist',
	'Hands',
	'Ring 1',
	'Ring 2',
	'Trinket 1',
	'Trinket 2',
	'Back',
	'Main Hand',
	'Off Hand',
	'Tabard'
].forEach(
	(slot) =>
		(defaultGear.bryce_morgan[slot] = {
			id: 19019,
			ilvl: 9000,
			name: 'Thunderfury, Blessed Blade of the Windseeker',
			quality: 'Legendary'
		})
);

export const defaultChar = {
	bryce_morgan: {
		name: 'Bryce Morgan',
		level: 60,
		faction: 'Sylvanas',
		gender: 'Male',
		race: 'Human',
		spec: 'Web Development',
		class: 'Programmer',
		ilvl: 240,
		guild: 'Currently looking...',
		lastLogin: 'Available Now!',
		realm: {
			name: 'California',
			slug: 'california'
		},
		region: 'us',
		assets: {
			avatar: '/static/images/profile-square.jpg',
			main: '/static/images/bryce_ryon_sunset.jpg'
		}
	}
};

export const defaultMounts = {
	bryce_morgan: [
		{
			id: 1039,
			name: 'Mighty Caravan Brutosaur',
			is_useable: true
		},
		{
			id: 1442,
			name: 'Corridor Creeper',
			is_useable: true
		}
	]
};

export const defaultPets = {
	bryce_morgan: [
		{
			id: 157950595,
			speciesId: 156,
			creatureDisplayId: 21362,
			speciesName: 'Bananas',
			level: 25,
			quality: 'Rare',
			isFavorite: true
		},
		{
			id: 159018284,
			speciesId: 2780,
			creatureDisplayId: 93437,
			speciesName: 'Daisy',
			level: 25,
			quality: 'Rare'
		}
	]
};

export const expansionTemplate = {
	"Classic": {},
	"Burning Crusade": {},
	"Wrath of the Lich King": {},
	"Cataclysm": {},
	"Mists of Pandaria": {},
	"Warlords of Draenor": {},
	"Legion": {},
	"Battle for Azeroth": {},
	"Shadowlands": {}
}

export const defaultRaids = {
	bryce_morgan: {...expansionTemplate}
}

export const defaultSession = {
	charHistory: [],
	currentChar: null,
	oAuth: null,
	authorizedChars: [],
	scope: null,
	idToken: null,
	authorized: false,
	accountName: null
}

export const defaultStore = { 
	characters: defaultChar, 
	gear: defaultGear, 
	mounts: defaultMounts, 
	pets: defaultPets ,
	raids: defaultRaids,
	session: defaultSession
};
