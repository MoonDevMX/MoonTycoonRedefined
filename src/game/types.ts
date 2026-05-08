export type MovieStatus = 'In Development' | 'Pre-Production' | 'Production' | 'Post-Production' | 'Released' | 'Archived';

export interface TerritoryPerformance {
  id: string;
  name: string;
  marketShare: number; // 0 to 1
  revenue: number;
}

export interface MovieReview {
  outlet: string;
  score: number;
  comment: string;
}

export interface Talent {
  id: string;
  name: string;
  type: 'Director' | 'Actor' | 'Writer' | 'Composer' | 'Producer' | 'VFX Artist';
  skill: number; // 0 to 100
  skills: {
    creative: number;
    technical: number;
    commercial: number;
    visionary: number;
  };
  fame: number; // 0 to 100
  salary: number;
  image?: string;
}

export interface MarketingCampaign {
  id: string;
  movieId: string;
  type: 'Social Media' | 'TV Spots' | 'Global Tour' | 'Viral';
  cost: number;
  hypeGain: number;
}

export interface Movie {
  id: string;
  title: string;
  genre: string;
  status: MovieStatus;
  budget: number;
  totalSpent: number;
  talentIds: string[];
  quality: number; // 0 to 100
  technicalQuality: number;
  commercialAppeal: number;
  hype: number; // 0 to 100
  releaseDate?: Date;
  revenue: number;
  merchRevenue: number;
  streamingRevenue: number;
  boxOfficeRevenue: number;
  territories: TerritoryPerformance[];
  reviews: MovieReview[];
  criticScore: number;
  audienceScore: number;
  weekOnRelease: number;
  ownerStudioId: string;
  franchiseId?: string;
  licenseId?: string;
  cinemaDeal?: CinemaDeal;
}

export interface CinemaDeal {
  id: string;
  chainName: string;
  cutPercentage: number; // e.g. 0.55 for user
  exclusivityWeeks: number;
  marketingSupport: number;
}

export interface License {
  id: string;
  name: string;
  cost: number;
  genre: string;
  rarity: 'Common' | 'Rare' | 'Legendary';
  bonusHype: number;
}

export interface StudioUpgrade {
  id: string;
  name: string;
  level: number;
  maxLevel: number;
  cost: number;
  description: string;
}

export interface Franchise {
  id: string;
  name: string;
  movies: string[];
  totalRevenue: number;
  level: number;
  growth: number;
}

export interface AwardSubmission {
  id: string;
  movieId: string;
  category: string;
  won: boolean;
}

export interface FestivalSubmission {
  id: string;
  movieId: string;
  festivalName: string;
  verdict: 'Accepted' | 'Rejected' | 'Awarded';
  prestigeGain: number;
}

export interface StreamingStats {
  subscribers: number;
  monthlyRevenue: number;
  contentCount: number;
  tier: 'Basic' | 'Premium' | 'Enterprise';
  churnRate: number;
}

export interface IPDeal {
  id: string;
  name: string;
  type: 'Crossover' | 'Reboot' | 'SpinOff';
  involvedMovies: string[];
  hypeBonus: number;
}

export interface TalentContract {
  talentId: string;
  weeksRemaining: number;
  bonusMultiplier: number;
}

export interface RivalStudio {
  id: string;
  name: string;
  reputation: number;
  prestige: number;
  share: number;
  strategy: 'Aggressive' | 'Quality' | 'Blockbuster' | 'Independent';
  activeProjects: {
    title: string;
    hype: number;
    genre: string;
  }[];
}

export interface Loan {
  id: string;
  amount: number;
  interestRate: number;
  totalToPay: number;
  paidAmount: number;
}

export interface StockMarket {
  valuation: number;
  sharePrice: number;
  history: number[];
}

export interface StudioState {
  id: string;
  name: string;
  funds: number;
  reputation: number;
  prestige: number;
  movies: Movie[];
  franchises: Franchise[];
  licenses: License[];
  upgrades: StudioUpgrade[];
  awards: AwardSubmission[];
  festivals: FestivalSubmission[];
  ipDeals: IPDeal[];
  streaming?: StreamingStats;
  talentPool: Talent[]; // Available talent in market
  ownedTalentIds: string[]; // Hired talent roster
  talentContracts: TalentContract[];
  loans: Loan[];
  stocks: StockMarket;
  currentDate: Date;
  rivals: RivalStudio[];
}
