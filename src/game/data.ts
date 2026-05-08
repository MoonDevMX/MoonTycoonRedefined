import { Talent, License } from './types';

export const MARKET_LICENSES: License[] = [
  { id: 'ml1', name: 'Classic Mythology', cost: 5000000, genre: 'Action', rarity: 'Common', bonusHype: 10 },
  { id: 'ml2', name: 'Cyberpunk Anthology', cost: 12000000, genre: 'Sci-Fi', rarity: 'Rare', bonusHype: 25 },
  { id: 'ml3', name: 'Grimm Fairy Tales', cost: 3000000, genre: 'Horror', rarity: 'Common', bonusHype: 8 },
  { id: 'ml4', name: 'Steampunk Odyssey', cost: 20000000, genre: 'Adventure', rarity: 'Legendary', bonusHype: 45 },
  { id: 'ml5', name: 'Whodunnit Mansion', cost: 8000000, genre: 'Mystery', rarity: 'Rare', bonusHype: 15 },
];

export const INITIAL_TALENT: Talent[] = [
  { 
    id: 't1', name: 'James Cameron', type: 'Director', skill: 95, fame: 98, salary: 15000000,
    skills: { creative: 98, technical: 99, commercial: 95, visionary: 100 }
  },
  { 
    id: 't2', name: 'Meryl Streep', type: 'Actor', skill: 99, fame: 95, salary: 12000000,
    skills: { creative: 100, technical: 80, commercial: 90, visionary: 85 }
  },
  { 
    id: 't3', name: 'Christopher Nolan', type: 'Director', skill: 92, fame: 90, salary: 10000000,
    skills: { creative: 95, technical: 98, commercial: 85, visionary: 95 }
  },
  { 
    id: 't4', name: 'Hans Zimmer', type: 'Composer', skill: 98, fame: 85, salary: 5000000,
    skills: { creative: 96, technical: 92, commercial: 88, visionary: 90 }
  },
  { 
    id: 't5', name: 'Greta Gerwig', type: 'Director', skill: 88, fame: 82, salary: 7000000,
    skills: { creative: 92, technical: 75, commercial: 94, visionary: 88 }
  },
  { 
    id: 't6', name: 'Timothée Chalamet', type: 'Actor', skill: 85, fame: 92, salary: 8000000,
    skills: { creative: 88, technical: 60, commercial: 96, visionary: 80 }
  },
  {
    id: 't7', name: 'Roger Deakins', type: 'VFX Artist', skill: 96, fame: 70, salary: 4000000,
    skills: { creative: 90, technical: 100, commercial: 60, visionary: 95 }
  },
  {
    id: 't8', name: 'Margot Robbie', type: 'Actor', skill: 89, fame: 94, salary: 11000000,
    skills: { creative: 85, technical: 50, commercial: 98, visionary: 82 }
  }
];

export const CINEMA_CHAINS = [
  { id: 'cc1', name: 'Global Cineplex', cutPercentage: 0.45, exclusivityWeeks: 4, marketingSupport: 1.2 },
  { id: 'cc2', name: 'Indie Aurora', cutPercentage: 0.60, exclusivityWeeks: 2, marketingSupport: 0.8 },
  { id: 'cc3', name: 'Regal Zenith', cutPercentage: 0.50, exclusivityWeeks: 6, marketingSupport: 1.5 },
];

export const STUDIO_UPGRADES = [
  { id: 'u1', name: 'Global Marketing', level: 0, maxLevel: 10, cost: 5000000, description: 'Increases all marketing efficiency by 15% per level and boosts global hype.' },
  { id: 'u2', name: 'VFX Super-Node', level: 0, maxLevel: 10, cost: 12000000, description: 'Increases technical quality and visual fidelity by 10 per level.' },
  { id: 'u3', name: 'International Distrib', level: 0, maxLevel: 5, cost: 30000000, description: 'Unlocks deeper cuts from international territories.' },
  { id: 'u4', name: 'Director Labs', level: 0, maxLevel: 5, cost: 50000000, description: 'Boosts Creative and Visionary stats of all assigned talent.' },
  { id: 'u5', name: 'Data Analytics', level: 0, maxLevel: 5, cost: 150000000, description: 'Precisely target demographics to increase commercial appeal by 25%.' },
];

export const TERRITORIES = [
  { id: 't-us', name: 'North America', marketShare: 0.40 },
  { id: 't-eu', name: 'Europe', marketShare: 0.25 },
  { id: 't-cn', name: 'China', marketShare: 0.20 },
  { id: 't-row', name: 'Rest of World', marketShare: 0.15 },
];

export const GENRES = [
  'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Thriller', 'Animation'
];
