export interface ExtractionTier {
	min: number;
	title: string;
	description: string;
}

export const VICTORY_TIERS: ExtractionTier[] = [
	{
		min: 0,
		title: 'Lucky Survivor',
		description: 'You made it out — barely. The vault gates close behind you, empty pockets and all.'
	},
	{
		min: 500,
		title: 'Scrap Runner',
		description: 'A modest haul. The fence will trade pleasantries, but not much else.'
	},
	{
		min: 1500,
		title: 'Seasoned Raider',
		description: 'Solid extraction. The crew nods when you walk into the bunker.'
	},
	{
		min: 3000,
		title: 'Pit Boss',
		description: "Now that's a raid. Word travels fast across the Wastes."
	},
	{
		min: 6000,
		title: 'Vault Walker',
		description: 'Legendary extraction. Other raiders will retell this run for seasons.'
	},
	{
		min: 10000,
		title: 'Wasteland Myth',
		description: 'The Wastes whisper your name. Even the Arc went quiet when you left.'
	}
];

export const DEFEAT_TIERS: ExtractionTier[] = [
	{
		min: 0,
		title: 'Bones in the Dust',
		description: "The Wastes took it all. There's nothing left to identify the body."
	},
	{
		min: 500,
		title: 'Failed Run',
		description: 'A few credits to your name and a long walk back to the bunker — if you make it.'
	},
	{
		min: 1500,
		title: 'Half-Extraction',
		description: 'You held a decent stash. The Arc held it longer.'
	},
	{
		min: 3000,
		title: 'Lost the Vault',
		description: 'A fortune in the bag, swallowed by the dark. Some raiders never recover from this.'
	},
	{
		min: 6000,
		title: 'The One That Got Away',
		description: 'A king’s ransom left in the dust. They will speak of this loss for years.'
	}
];

export function getExtractionTier(extract: number, victory: boolean): ExtractionTier {
	const tiers = victory ? VICTORY_TIERS : DEFEAT_TIERS;
	let match = tiers[0];
	for (const tier of tiers) {
		if (extract >= tier.min) match = tier;
		else break;
	}
	return match;
}
