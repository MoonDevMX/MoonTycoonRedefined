import { MarketingCampaign, Movie } from './types';

export const CAMPAIGN_TYPES = [
  { type: 'Social Media', baseCost: 500000, baseHype: 10 },
  { type: 'TV Spots', baseCost: 2000000, baseHype: 25 },
  { type: 'Viral Stunt', baseCost: 100000, baseHype: 40 }, // High risk/reward
  { type: 'Global Tour', baseCost: 10000000, baseHype: 60 },
] as const;

export function runCampaign(movie: Movie, campaignType: string): { cost: number, hypeGain: number } {
  const config = CAMPAIGN_TYPES.find(c => c.type === campaignType);
  if (!config) return { cost: 0, hypeGain: 0 };
  
  // Random variance
  const variance = 0.8 + Math.random() * 0.4;
  return {
    cost: config.baseCost,
    hypeGain: Math.floor(config.baseHype * variance)
  };
}
