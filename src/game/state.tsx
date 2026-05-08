import React, { createContext, useContext, useState, useCallback } from 'react';
import { StudioState, Movie, Talent, MovieStatus, License, StudioUpgrade, Franchise, CinemaDeal, IPDeal, TerritoryPerformance, MovieReview, Loan, TalentContract } from './types';
import { INITIAL_TALENT, STUDIO_UPGRADES, TERRITORIES } from './data';

interface GameContextType {
  state: StudioState;
  addMovie: (movie: Partial<Movie>) => void;
  updateMovieStatus: (id: string, status: MovieStatus) => void;
  hireTalent: (talent: Talent) => void;
  assignTalentToMovie: (movieId: string, talentId: string) => void;
  applyMarketing: (movieId: string, cost: number, hypeGain: number) => void;
  launchStreaming: (tier: 'Basic' | 'Premium' | 'Enterprise') => void;
  buyLicense: (license: License) => void;
  upgradeStudio: (upgradeId: string) => void;
  createFranchise: (name: string, movieId: string) => void;
  setCinemaDeal: (movieId: string, deal: CinemaDeal) => void;
  takeLoan: (amount: number) => void;
  payLoan: (loanId: string, amount: number) => void;
  advanceTime: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<StudioState>({
    id: 'studio-1',
    name: 'MoonDev Studios',
    funds: 100000000,
    reputation: 30,
    prestige: 10,
    movies: [],
    franchises: [],
    licenses: [],
    upgrades: STUDIO_UPGRADES,
    awards: [],
    festivals: [],
    ipDeals: [],
    talentPool: INITIAL_TALENT,
    ownedTalentIds: [],
    talentContracts: [],
    loans: [],
    stocks: {
      valuation: 500000000,
      sharePrice: 25.0,
      history: [25.0]
    },
    currentDate: new Date(2026, 0, 1),
    rivals: [
      { id: 'r1', name: 'Apex Cinematic', reputation: 90, prestige: 85, share: 45, strategy: 'Blockbuster', activeProjects: [{ title: 'Interstellar Drift', hype: 80, genre: 'Sci-Fi' }] },
      { id: 'r2', name: 'Indie Void', reputation: 65, prestige: 92, share: 15, strategy: 'Quality', activeProjects: [{ title: 'Solace in Silence', hype: 45, genre: 'Drama' }] },
      { id: 'r3', name: 'Global Box', reputation: 75, prestige: 40, share: 25, strategy: 'Aggressive', activeProjects: [{ title: 'Speed Demon 9', hype: 95, genre: 'Action' }] },
    ]
  });

  const takeLoan = useCallback((amount: number) => {
    const newLoan: Loan = {
      id: Math.random().toString(36).substr(2, 9),
      amount,
      interestRate: 0.15, // 15% interest
      totalToPay: amount * 1.15,
      paidAmount: 0
    };
    setState(prev => ({
      ...prev,
      funds: prev.funds + amount,
      loans: [...prev.loans, newLoan]
    }));
  }, []);

  const payLoan = useCallback((loanId: string, amount: number) => {
    setState(prev => {
      const loan = prev.loans.find(l => l.id === loanId);
      if (!loan || prev.funds < amount) return prev;
      
      const updatedPaidAmount = loan.paidAmount + amount;
      if (updatedPaidAmount >= loan.totalToPay) {
        return {
          ...prev,
          funds: prev.funds - amount,
          loans: prev.loans.filter(l => l.id !== loanId)
        };
      }
      
      return {
        ...prev,
        funds: prev.funds - amount,
        loans: prev.loans.map(l => l.id === loanId ? { ...l, paidAmount: updatedPaidAmount } : l)
      };
    });
  }, []);

  const addMovie = useCallback((movieData: Partial<Movie>) => {
    const newMovie: Movie = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'Untitled Project',
      genre: 'Action',
      status: 'In Development',
      budget: 0,
      totalSpent: 0,
      talentIds: [],
      quality: Math.floor(Math.random() * 20) + 10,
      technicalQuality: 20,
      commercialAppeal: 20,
      hype: Math.floor(Math.random() * 15),
      revenue: 0,
      merchRevenue: 0,
      boxOfficeRevenue: 0,
      streamingRevenue: 0,
      territories: TERRITORIES.map(t => ({ ...t, revenue: 0 })),
      reviews: [],
      criticScore: 0,
      audienceScore: 0,
      weekOnRelease: 0,
      ownerStudioId: state.id,
      ...movieData,
    };
    setState(prev => ({ ...prev, movies: [...prev.movies, newMovie] }));
  }, [state.id]);

  const assignTalentToMovie = useCallback((movieId: string, talentId: string) => {
    setState(prev => {
      const talent = prev.talentPool.find(t => t.id === talentId);
      if (!talent) return prev;
      
      return {
        ...prev,
        movies: prev.movies.map(m => {
          if (m.id === movieId) {
            // Recalculate physical quality based on talent skills
            const combinedQuality = m.quality + (talent.skill / 10);
            return { ...m, talentIds: [...new Set([...m.talentIds, talentId])], quality: Math.min(100, combinedQuality) };
          }
          return m;
        })
      };
    });
  }, []);

  const generateReviews = (movie: Movie): { reviews: MovieReview[], critic: number, audience: number } => {
    const base = movie.quality;
    const technical = movie.technicalQuality;
    const commercial = movie.commercialAppeal;

    const critic = Math.min(100, Math.max(0, (base * 0.5 + technical * 0.4) + (Math.random() * 20 - 10)));
    const audience = Math.min(100, Math.max(0, (base * 0.3 + commercial * 0.6) + (Math.random() * 25 - 12.5)));

    const reviews: MovieReview[] = [
      { outlet: 'The Daily Reel', score: critic, comment: critic > 85 ? "A landmark achievement." : critic > 70 ? "Strong technical prowess." : critic > 50 ? "Mostly derivative." : "An absolute mess." },
      { outlet: 'FanPulse', score: audience, comment: audience > 85 ? "I've seen it five times already!" : audience > 70 ? "Great popcorn flick." : audience > 40 ? "It was okay I guess." : "Waste of time." }
    ];

    return { reviews, critic, audience };
  };

  const updateMovieStatus = useCallback((id: string, status: MovieStatus) => {
    setState(prev => ({
      ...prev,
      movies: prev.movies.map(m => {
        if (m.id === id) {
          if (status === 'Released' && m.status !== 'Released') {
             const results = generateReviews(m);
             return { ...m, status, reviews: results.reviews, criticScore: results.critic, audienceScore: results.audience, releaseDate: new Date(prev.currentDate) };
          }
          return { ...m, status, releaseDate: status === 'Released' ? new Date(prev.currentDate) : m.releaseDate };
        }
        return m;
      })
    }));
  }, []);

  const setCinemaDeal = useCallback((movieId: string, deal: CinemaDeal) => {
    setState(prev => ({
      ...prev,
      movies: prev.movies.map(m => m.id === movieId ? { ...m, cinemaDeal: deal } : m)
    }));
  }, []);

  const hireTalent = useCallback((talent: Talent) => {
    setState(prev => {
      if (prev.ownedTalentIds.includes(talent.id)) return prev;
      if (prev.funds < talent.salary) return prev;
      
      const newContract: TalentContract = {
        talentId: talent.id,
        weeksRemaining: 52, // 1 year contract
        bonusMultiplier: 1.0 + (talent.skill / 200)
      };

      return {
        ...prev,
        funds: prev.funds - talent.salary,
        ownedTalentIds: [...prev.ownedTalentIds, talent.id],
        talentContracts: [...prev.talentContracts, newContract],
        reputation: prev.reputation + 2,
        prestige: prev.prestige + talent.fame / 20
      };
    });
  }, []);

  const applyMarketing = useCallback((movieId: string, cost: number, hypeGain: number) => {
    setState(prev => {
      const marketingLevel = prev.upgrades.find(u => u.id === 'u1')?.level || 0;
      const effectiveGain = hypeGain * (1 + (marketingLevel * 0.15));
      return {
        ...prev,
        funds: prev.funds - cost,
        movies: prev.movies.map(m => m.id === movieId ? { ...m, hype: Math.min(100, m.hype + effectiveGain) } : m)
      };
    });
  }, []);

  const buyLicense = useCallback((license: License) => {
    setState(prev => {
      if (prev.licenses.find(l => l.id === license.id)) return prev;
      return {
        ...prev,
        funds: prev.funds - license.cost,
        licenses: [...prev.licenses, license]
      };
    });
  }, []);

  const upgradeStudio = useCallback((upgradeId: string) => {
    setState(prev => {
      const upgrade = prev.upgrades.find(u => u.id === upgradeId);
      if (!upgrade || upgrade.level >= upgrade.maxLevel || prev.funds < upgrade.cost) return prev;
      return {
        ...prev,
        funds: prev.funds - upgrade.cost,
        upgrades: prev.upgrades.map(u => u.id === upgradeId ? { ...u, level: u.level + 1, cost: Math.floor(u.cost * 1.5) } : u)
      };
    });
  }, []);

  const createFranchise = useCallback((name: string, movieId: string) => {
    const newFranchise: Franchise = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      movies: [movieId],
      totalRevenue: 0,
      level: 1,
      growth: 0
    };
    setState(prev => ({
      ...prev,
      franchises: [...prev.franchises, newFranchise],
      movies: prev.movies.map(m => m.id === movieId ? { ...m, franchiseId: newFranchise.id } : m)
    }));
  }, []);

  const advanceTime = useCallback(() => {
    setState(prev => {
      const nextDate = new Date(prev.currentDate);
      const isNewYear = nextDate.getMonth() === 11 && nextDate.getDate() >= 24;
      nextDate.setDate(nextDate.getDate() + 7);
      
      let newFunds = prev.funds;
      let newReputation = prev.reputation;
      let newPrestige = prev.prestige;

      // 1. Talent Contracts & Expirations
      const updatedContracts = prev.talentContracts.map(c => ({
        ...c,
        weeksRemaining: c.weeksRemaining - 1
      })).filter(c => c.weeksRemaining > 0);

      const expiredTalentIds = prev.talentContracts.filter(c => c.weeksRemaining <= 1).map(c => c.talentId);
      const updatedOwnedTalentIds = prev.ownedTalentIds.filter(id => !expiredTalentIds.includes(id));

      // 2. Rivals Simulation
      const updatedRivals = prev.rivals.map(rival => {
        const drift = rival.strategy === 'Aggressive' ? 0.35 : rival.strategy === 'Blockbuster' ? 0.25 : 0.15;
        const growth = (Math.random() - (0.5 - drift)) * 1.5;
        
        // Randomly "release" a rival movie occasionally
        const newActiveProjects = [...rival.activeProjects];
        if (Math.random() > 0.95) {
          newActiveProjects.push({
            title: `Rival Project ${Math.floor(Math.random() * 1000)}`,
            hype: 40 + Math.random() * 50,
            genre: 'Action'
          });
        }
        
        return { 
          ...rival, 
          share: Math.max(1, Math.min(60, rival.share + growth)),
          activeProjects: newActiveProjects.slice(-2)
        };
      });

      // 3. Yearly Awards Check
      let updatedAwards = [...prev.awards];
      if (isNewYear) {
         const eligibleMovies = prev.movies.filter(m => m.status === 'Released' && m.releaseDate && m.releaseDate.getFullYear() === prev.currentDate.getFullYear());
         eligibleMovies.sort((a, b) => b.criticScore - a.criticScore);
         
         if (eligibleMovies.length > 0) {
            const winner = eligibleMovies[0];
            updatedAwards.push({
              id: Math.random().toString(36).substr(2, 9),
              movieId: winner.id,
              category: 'Best Picture',
              won: true
            });
            newPrestige += 10;
            newFunds += 25000000;
         }
      }

      // 4. Stock Market Update
      const totalRevenue = prev.movies.reduce((acc, m) => acc + m.revenue, 0);
      const newValuation = prev.funds + (newReputation * 1000000) + (newPrestige * 5000000) + (totalRevenue * 0.5);
      const newSharePrice = Math.max(1, newValuation / 20000000);
      const updatedStocks = {
        valuation: newValuation,
        sharePrice: newSharePrice,
        history: [...prev.stocks.history.slice(-19), newSharePrice]
      };

      // 5. Movies & Complex Revenue logic
      const updatedMovies = prev.movies.map(movie => {
        // Handle In-Progress Production Costs
        if (movie.status === 'Pre-Production' || movie.status === 'Production' || movie.status === 'Post-Production') {
           const burnRate = (movie.budget || 50000000) / 10; // 10 weeks of prod cost allocation
           newFunds -= burnRate;
           
           // Boost quality during prod based on studio tech
           const techBoost = prev.upgrades.find(u => u.id === 'u2')?.level || 0;
           const commBoost = prev.upgrades.find(u => u.id === 'u5')?.level || 0;
           
           return {
             ...movie,
             totalSpent: movie.totalSpent + burnRate,
             quality: Math.min(100, movie.quality + 0.3),
             technicalQuality: Math.min(100, movie.technicalQuality + 0.5 + (techBoost * 0.3)),
             commercialAppeal: Math.min(100, movie.commercialAppeal + 0.2 + (commBoost * 0.4))
           };
        }

        if (movie.status === 'Released') {
          // Theatrical Window Logic
          const isTheatrical = movie.weekOnRelease <= (movie.cinemaDeal?.exclusivityWeeks || 4);
          const decay = Math.pow(isTheatrical ? 0.70 : 0.50, movie.weekOnRelease);
          const qualityBonus = 0.5 + (movie.quality / 45) + (movie.criticScore / 150);
          
          let totalWeeklyRevenue = 0;
          const updatedTerritories = movie.territories.map(t => {
             const territoryModifier = prev.upgrades.find(u => u.id === 'u3')?.level ? 1.25 : 1.0;
             let territoryRevenue = (movie.hype * 2000000 + movie.commercialAppeal * 1200000) * decay * qualityBonus * t.marketShare * territoryModifier;
             
             if (isTheatrical && movie.cinemaDeal) {
               territoryRevenue *= movie.cinemaDeal.cutPercentage * (movie.cinemaDeal.marketingSupport || 1);
             } else if (!isTheatrical) {
               territoryRevenue *= 0.35;
             }
             
             totalWeeklyRevenue += territoryRevenue;
             return { ...t, revenue: t.revenue + territoryRevenue };
          });

          const weeklyMerch = totalWeeklyRevenue * (0.18 + (prev.upgrades.find(u => u.id === 'u5')?.level || 0) * 0.04);
          const weeklyBoxOffice = isTheatrical ? totalWeeklyRevenue : 0;
          const weeklyStreaming = !isTheatrical ? totalWeeklyRevenue : (prev.streaming ? totalWeeklyRevenue * 0.12 : 0);

          newFunds += totalWeeklyRevenue + weeklyMerch;
          newReputation += totalWeeklyRevenue > 150000000 ? 1.5 : 0.2;
          newPrestige += movie.criticScore > 85 ? 1 : 0;

          return { 
            ...movie, 
            revenue: movie.revenue + totalWeeklyRevenue,
            boxOfficeRevenue: movie.boxOfficeRevenue + weeklyBoxOffice,
            streamingRevenue: movie.streamingRevenue + weeklyStreaming,
            merchRevenue: movie.merchRevenue + weeklyMerch,
            territories: updatedTerritories,
            weekOnRelease: movie.weekOnRelease + 1,
            hype: Math.max(0, movie.hype - 15)
          };
        }
        return movie;
      });

      // 3. Streaming Deep Cycle
      let updatedStreaming = prev.streaming;
      if (updatedStreaming) {
        const catalogValue = prev.movies.filter(m => m.status === 'Released').length;
        const qualityAvg = prev.movies.filter(m => m.status === 'Released').reduce((acc, m) => acc + m.quality, 0) / (catalogValue || 1);
        
        const churnBase = updatedStreaming.tier === 'Basic' ? 0.05 : updatedStreaming.tier === 'Premium' ? 0.03 : 0.01;
        const churnAdjustment = (50 - qualityAvg) / 1000;
        const currentChurn = Math.max(0.01, churnBase + churnAdjustment);
        
        const growthFactor = (catalogValue * 8000) + (qualityAvg * 500);
        const newSubs = Math.floor(updatedStreaming.subscribers * (1 - currentChurn) + growthFactor);
        
        const arpu = updatedStreaming.tier === 'Basic' ? 0.6 : updatedStreaming.tier === 'Premium' ? 1.2 : 2.5;
        const weeklyStreamingRev = (newSubs * arpu);
        newFunds += weeklyStreamingRev;

        updatedStreaming = {
          ...updatedStreaming,
          subscribers: newSubs,
          monthlyRevenue: newSubs * arpu * 4,
          contentCount: catalogValue,
          churnRate: currentChurn
        };
      }

      return { 
        ...prev, 
        currentDate: nextDate, 
        movies: updatedMovies,
        rivals: updatedRivals,
        awards: updatedAwards,
        ownedTalentIds: updatedOwnedTalentIds,
        talentContracts: updatedContracts,
        funds: newFunds,
        reputation: Math.min(100, newReputation),
        prestige: Math.min(100, newPrestige),
        stocks: updatedStocks,
        streaming: updatedStreaming
      };
    });
  }, []);

  const launchStreaming = useCallback((tier: 'Basic' | 'Premium' | 'Enterprise') => {
    const costs = { Basic: 100000000, Premium: 250000000, Enterprise: 600000000 };
    setState(prev => ({
      ...prev,
      funds: prev.funds - costs[tier],
      streaming: {
        subscribers: 500000,
        monthlyRevenue: 1000000,
        contentCount: prev.movies.filter(m => m.status === 'Released').length,
        tier,
        churnRate: 0.05
      }
    }));
  }, []);

  return (
    <GameContext.Provider value={{ 
      state, 
      addMovie, 
      updateMovieStatus, 
      hireTalent, 
      assignTalentToMovie,
      applyMarketing, 
      advanceTime, 
      launchStreaming,
      buyLicense,
      upgradeStudio,
      createFranchise,
      setCinemaDeal,
      takeLoan,
      payLoan
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
};
