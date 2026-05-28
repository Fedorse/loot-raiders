export type ExtractionGrade = 'F' | 'D' | 'C' | 'B' | 'A' | 'S';
export type ExtractionTone = 'good' | 'neutral' | 'bad';

export interface ExtractionTier {
	min: number;
	grade: ExtractionGrade;
	tone: ExtractionTone;
	title: string;
	description: string;
}

export const EXTRACTION_TIERS: ExtractionTier[] = [
	{
		min: 0,
		grade: 'F',
		tone: 'bad',
		title: 'Lucky Survivor',
		description: 'You made it out — barely. The vault gates close behind you, empty pockets and all.'
	},
	{
		min: 500,
		grade: 'D',
		tone: 'bad',
		title: 'Scrap Runner',
		description: 'A modest haul. The fence will trade pleasantries, but not much else.'
	},
	{
		min: 1500,
		grade: 'C',
		tone: 'neutral',
		title: 'Seasoned Raider',
		description: 'Solid extraction. The crew nods when you walk into the bunker.'
	},
	{
		min: 3000,
		grade: 'B',
		tone: 'good',
		title: 'Pit Boss',
		description: "Now that's a raid. Word travels fast across the Wastes."
	},
	{
		min: 6000,
		grade: 'A',
		tone: 'good',
		title: 'Vault Walker',
		description: 'Legendary extraction. Other raiders will retell this run for seasons.'
	},
	{
		min: 10000,
		grade: 'S',
		tone: 'good',
		title: 'Wasteland Myth',
		description: 'The Wastes whisper your name. Even the Arc went quiet when you left.'
	}
];

export function getExtractionTier(extract: number): ExtractionTier {
	return EXTRACTION_TIERS.findLast((t) => extract >= t.min) ?? EXTRACTION_TIERS[0];
}
