import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameProvider, useGame } from './game/state';
import { Button, Card, StatBox, cn } from './ui/components';
import { NegotiationModal } from './ui/NegotiationModal';
import { Talent, Movie, License, StudioUpgrade, CinemaDeal } from './game/types';
import { CAMPAIGN_TYPES } from './game/marketing';
import { CINEMA_CHAINS, MARKET_LICENSES, GENRES } from './game/data';
import { 
  Film, Users, TrendingUp, DollarSign, Plus, 
  Play, Calendar, Settings, Activity, Globe, X,
  ShoppingBag, BarChart, Shield, Zap, Briefcase, Award
} from 'lucide-react';
import { format } from 'date-fns';

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-10 font-mono">
          <div className="max-w-xl border border-white/20 p-8 text-center">
            <h1 className="text-2xl font-serif italic mb-4">CRITICAL SYSTEM FAILURE</h1>
            <p className="text-[10px] opacity-40 uppercase tracking-widest leading-relaxed mb-8">
              An unrecoverable error has occurred in the studio management matrix. 
              The session has been terminated to prevent data corruption.
            </p>
            <Button onClick={() => window.location.reload()} className="bg-white text-black">Reboot System</Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const MarketingModal = ({ movie, onClose }: { movie: Movie, onClose: () => void }) => {
  const { applyMarketing } = useGame();
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card title={`Marketing Campaign: ${movie.title}`} className="w-full max-w-md bg-[#E4E3E0] border-2 border-black">
        <div className="flex justify-between items-start mb-6">
          <div className="font-mono text-[10px] uppercase opacity-50">Boost global awareness</div>
          <button onClick={onClose} className="hover:rotate-90 transition-transform"><X size={16} /></button>
        </div>
        <div className="space-y-3">
          {CAMPAIGN_TYPES.map((c) => (
            <div key={c.type} className="flex justify-between items-center p-4 border border-black/10 hover:border-black transition-all bg-white/50 group">
              <div>
                <div className="font-bold font-serif italic text-lg">{c.type}</div>
                <div className="font-mono text-[9px] opacity-50">Cost: ${(c.baseCost/1000).toFixed(0)}k // Hype: +{c.baseHype}%</div>
              </div>
              <Button onClick={() => {
                applyMarketing(movie.id, c.baseCost, c.baseHype);
                onClose();
              }} className="bg-black text-white group-hover:px-6 transition-all">Deploy</Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

const CinemaDealsModal = ({ movie, onClose, onSelect }: { movie: Movie, onClose: () => void, onSelect: (deal: CinemaDeal) => void }) => {
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[60] p-4">
      <Card title={`Cinema Distribution: ${movie.title}`} className="w-full max-w-2xl bg-[#E4E3E0] border-2 border-black">
        <div className="flex justify-between items-start mb-8">
          <div className="font-mono text-[10px] uppercase opacity-50 tracking-widest leading-relaxed max-w-sm">
            Select a distribution partner. Larger chains offer more marketing power but take a higher cut.
          </div>
          <button onClick={onClose} className="hover:rotate-90 transition-transform"><X size={16} /></button>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {CINEMA_CHAINS.map(chain => (
            <div key={chain.id} className="p-6 border border-black hover:bg-black hover:text-white transition-all group flex justify-between items-center bg-white/50">
              <div className="flex-1">
                <div className="font-serif italic text-2xl font-bold">{chain.name}</div>
                <div className="flex gap-6 mt-4 font-mono text-[10px] uppercase opacity-40 group-hover:opacity-60">
                   <span>Revenue Cut: {((1-chain.cutPercentage)*100).toFixed(0)}%</span>
                   <span>Exclusivity: {chain.exclusivityWeeks} Weeks</span>
                   <span>Boost: x{chain.marketingSupport}</span>
                </div>
              </div>
              <Button onClick={() => { onSelect(chain as unknown as CinemaDeal); onClose(); }} className="bg-black text-white group-hover:bg-white group-hover:text-black hover:px-10 transition-all">Sign Deal</Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

const Dashboard = () => {
  const { state, addMovie, advanceTime, updateMovieStatus, hireTalent, launchStreaming, buyLicense, upgradeStudio, createFranchise, assignTalentToMovie, setCinemaDeal, takeLoan, payLoan } = useGame();
  const [activeTab, setActiveTab] = useState<'slate' | 'talent' | 'rivals' | 'awards' | 'streaming' | 'licenses' | 'upgrades' | 'franchises' | 'finance'>('slate');
  const [negotiatingTalent, setNegotiatingTalent] = useState<Talent | null>(null);
  const [marketingMovie, setMarketingMovie] = useState<Movie | null>(null);
  const [distributionMovie, setDistributionMovie] = useState<Movie | null>(null);
  const [assigningMovieId, setAssigningMovieId] = useState<string | null>(null);
  const [isLaunchingStreaming, setIsLaunchingStreaming] = useState(false);

  const handleNewProject = () => {
    const titles = ['Neon Nights', 'Cyber Souls', 'Desert Wind', 'The Last Echo', 'Glass Heart', 'Void Runner', 'Shattered Sky', 'Silent Protocol'];
    const selectedGenre = GENRES[Math.floor(Math.random() * GENRES.length)];
    addMovie({
      title: titles[Math.floor(Math.random() * titles.length)],
      budget: 50000000 + (Math.random() * 150000000), // Adjusted budget for deeper mechanics
      genre: selectedGenre,
      status: 'In Development'
    });
  };

  return (
    <div className="min-h-screen bg-[#E4E3E0] text-[#141414] font-sans selection:bg-black selection:text-white">
      {/* Sidebar Navigation */}
      <nav className="fixed left-0 top-0 bottom-0 w-20 border-r border-black flex flex-col items-center py-8 gap-8 bg-white/40 backdrop-blur-md z-40">
        <div className="w-12 h-12 bg-black flex items-center justify-center -rotate-12 hover:rotate-0 transition-transform cursor-pointer">
          <Film className="text-white" size={24} />
        </div>
        
        <div className="flex flex-col gap-6 flex-1">
          {[
            { id: 'slate', icon: Film, label: 'Slate' },
            { id: 'talent', icon: Users, label: 'Talent' },
            { id: 'licenses', icon: Shield, label: 'IP' },
            { id: 'franchises', icon: Zap, label: 'Series' },
            { id: 'upgrades', icon: Settings, label: 'Studio' },
            { id: 'streaming', icon: Globe, label: 'Web' },
            { id: 'rivals', icon: Activity, label: 'Rivals' },
            { id: 'awards', icon: Award, label: 'Awards' },
            { id: 'finance', icon: DollarSign, label: 'Finance' },
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={cn(
                "p-3 rounded-none transition-all relative group",
                activeTab === item.id ? "bg-black text-white" : "hover:bg-black/5 opacity-60 hover:opacity-100"
              )}
            >
              <item.icon size={20} />
              <span className="absolute left-full ml-4 px-2 py-1 bg-black text-white text-[8px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {item.label}
              </span>
            </button>
          ))}
        </div>

        <button onClick={advanceTime} className="p-4 bg-black text-white hover:bg-red-600 transition-colors">
          <Play size={20} />
        </button>
      </nav>

      {/* Top Bar */}
      <header className="fixed top-0 left-20 right-0 h-20 border-b border-black bg-white/40 backdrop-blur-md flex items-center justify-between px-10 z-30">
        <div className="flex flex-col">
          <h1 className="text-2xl font-serif italic tracking-tighter leading-none mt-1">
            {state.name} <span className="text-[10px] uppercase font-mono opacity-40 ml-2">// Sector 07-A</span>
          </h1>
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] opacity-40">Global Media Conglomerate</span>
        </div>

        <div className="flex gap-16 items-center">
          <div className="flex flex-col items-end group cursor-help" title={`Market Cap: $${(state.stocks.valuation / 1000000000).toFixed(2)}B`}>
            <span className="font-mono text-[9px] uppercase opacity-40">MKT Price</span>
            <div className="flex items-center gap-2">
              <TrendingUp size={12} className={cn(state.stocks.history[state.stocks.history.length-1] >= state.stocks.history[state.stocks.history.length-2] ? "text-green-500" : "text-red-500")} />
              <span className="text-xl font-mono tracking-tighter">${state.stocks.sharePrice.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-mono text-[9px] uppercase opacity-40">Liquid Assets</span>
            <span className="text-2xl font-mono tracking-tighter">${(state.funds / 1000000).toFixed(1)}M</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-mono text-[9px] uppercase opacity-40">Current Wave</span>
            <span className="text-xl font-mono tracking-tight uppercase">{format(state.currentDate, "MMM yyyy, 'Week' w")}</span>
          </div>
          <div className="h-10 w-[1px] bg-black/10" />
          <div className="flex flex-col items-end">
            <span className="font-mono text-[9px] uppercase opacity-40">Reputation index</span>
            <div className="flex gap-1 mt-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={cn("w-3 h-1", i < state.reputation / 20 ? "bg-black" : "bg-black/10")} />
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="ml-20 mt-20 p-10 max-w-[1500px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Header Content */}
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-5xl font-serif italic tracking-tighter capitalize transition-all">
                  {activeTab === 'slate' ? 'Production Matrix' : activeTab}
                </h2>
                <p className="font-mono text-[10px] uppercase opacity-40 mt-2 tracking-widest">
                  {activeTab === 'slate' ? 'Active developments and global releases' : `Operations and strategic scaling`}
                </p>
              </div>
              {activeTab === 'slate' && (
                <Button onClick={handleNewProject} className="bg-black text-white px-10 py-4 flex gap-2 rounded-none hover:tracking-widest transition-all">
                  <Plus size={16} /> Greenlight Project
                </Button>
              )}
            </div>

            {/* Content Logic */}
            {activeTab === 'slate' && (
              <div className="border border-black bg-white/20">
                <div className="grid grid-cols-[3fr,1.5fr,1.5fr,2fr,0.5fr] p-4 text-[9px] font-mono uppercase opacity-40 border-b border-black">
                  <div>Project Identifier</div>
                  <div>Phase</div>
                  <div>Financial Metrics</div>
                  <div>Market Gravity (Hype)</div>
                  <div className="text-right">Actions</div>
                </div>
                {state.movies.length === 0 ? (
                  <div className="p-20 text-center font-serif italic opacity-30 text-2xl">No active nodes in the production matrix.</div>
                ) : (
                  state.movies.map((movie) => (
                    <div key={movie.id} className="grid grid-cols-[3fr,1.5fr,1.5fr,2fr,0.5fr] p-6 border-b border-black/10 items-center hover:bg-white/40 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-black/5 border border-black/10 flex items-center justify-center font-mono text-[10px]">
                          {movie.title[0]}
                        </div>
                        <div>
                          <div className="font-serif italic text-xl font-bold">{movie.title}</div>
                          <div className="font-mono text-[9px] uppercase opacity-40 mt-0.5">{movie.genre} // Quality: {movie.quality}</div>
                        </div>
                      </div>
                      <div className="font-mono text-[11px] uppercase tracking-wider flex items-center">
                         <div className={cn(
                           "w-2 h-2 rounded-full mr-3", 
                           movie.status === 'Released' ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : 
                           movie.status === 'In Development' ? "bg-white border border-black/20" :
                           "bg-yellow-400"
                         )} />
                         <div className="flex flex-col">
                           <span>{movie.status}</span>
                           {movie.status === 'Released' && (
                             <span className="text-[8px] opacity-40">Critic: {Math.floor(movie.criticScore)} // Fans: {Math.floor(movie.audienceScore)}</span>
                           )}
                         </div>
                      </div>
                      <div className="font-mono text-[11px]">
                        <div className="opacity-40 text-[9px]">BGT: ${(movie.budget/1000000).toFixed(1)}M</div>
                        {movie.status === 'Released' && (
                          <div className={cn("font-bold", movie.revenue > movie.budget ? "text-green-700" : "text-red-700")}>
                            REV: ${(movie.revenue/1000000).toFixed(1)}M
                          </div>
                        )}
                      </div>
                      <div className="px-8">
                        <div className="h-1.5 w-full bg-black/5 relative overflow-hidden ring-1 ring-black/5">
                           <motion.div 
                            className="absolute top-0 left-0 h-full bg-black"
                            initial={{ width: 0 }}
                            animate={{ width: `${movie.hype}%` }}
                           />
                        </div>
                        <div className="flex justify-between font-mono text-[8px] mt-2 opacity-50 uppercase tracking-tighter">
                          <span>Awareness: {movie.hype}%</span>
                          <span>Merch: ${(movie.merchRevenue/1000).toFixed(0)}k</span>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {movie.status === 'In Development' && (
                          <button onClick={() => updateMovieStatus(movie.id, 'Pre-Production')} title="Pre-Production" className="p-2 border border-black hover:bg-black hover:text-white transition-all font-mono text-[8px] uppercase">Plan</button>
                        )}
                        {movie.status === 'Pre-Production' && (
                          <button onClick={() => updateMovieStatus(movie.id, 'Production')} title="Start Filming" className="p-2 border border-black hover:bg-black hover:text-white transition-all font-mono text-[8px] uppercase">Film</button>
                        )}
                        {movie.status === 'Production' && (
                          <button onClick={() => updateMovieStatus(movie.id, 'Post-Production')} title="Edit" className="p-2 border border-black hover:bg-black hover:text-white transition-all font-mono text-[8px] uppercase">Edit</button>
                        )}
                        {movie.status === 'Post-Production' && (
                          <button 
                            onClick={() => {
                              if (!movie.cinemaDeal) {
                                setDistributionMovie(movie);
                              } else {
                                updateMovieStatus(movie.id, 'Released');
                              }
                            }} 
                            className={cn("p-2 border border-black hover:bg-black hover:text-white transition-all", !movie.cinemaDeal && "bg-black text-white")}
                          >
                            <Play size={14} />
                          </button>
                        )}
                        <button onClick={() => setMarketingMovie(movie)} className="p-2 border border-black hover:bg-black hover:text-white transition-all"><ShoppingBag size={14} /></button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'talent' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {state.talentPool.map(talent => {
                  const isHired = state.ownedTalentIds.includes(talent.id);
                  return (
                    <Card key={talent.id} className={cn("p-0 border-black overflow-hidden group hover:shadow-2xl transition-all flex flex-col", isHired && "ring-2 ring-black")}>
                      <div className="h-32 bg-black flex items-center justify-center relative overflow-hidden">
                         <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
                         <Users className="text-white opacity-20" size={64} />
                         <div className="absolute top-4 right-4 bg-white/10 px-2 py-0.5 font-mono text-[8px] uppercase text-white">Lvl A+</div>
                         {isHired && <div className="absolute bottom-2 left-2 bg-white text-black px-2 py-0.5 font-mono text-[8px] uppercase font-bold">In Roster</div>}
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <h4 className="font-serif italic text-2xl font-bold leading-none">{talent.name}</h4>
                            <span className="font-mono text-[9px] uppercase opacity-40">{talent.type} // {talent.skill} XP</span>
                          </div>
                          <div className="text-right">
                             <div className="font-mono text-[10px] opacity-40">Value</div>
                             <div className="font-bold font-mono text-lg">${(talent.salary/1000000).toFixed(1)}M</div>
                          </div>
                        </div>

                        <div className="space-y-3 mb-8">
                           {Object.entries(talent.skills || {}).map(([key, val]) => (
                             <div key={key} className="space-y-1">
                                <div className="flex justify-between font-mono text-[8px] uppercase opacity-40">
                                  <span>{key} index</span>
                                  <span>{val}%</span>
                                </div>
                                <div className="h-0.5 w-full bg-black/5 overflow-hidden">
                                  <motion.div className="h-full bg-black" initial={{ width: 0 }} animate={{ width: `${val}%` }} />
                                </div>
                             </div>
                           ))}
                        </div>

                        <div className="mt-auto pt-6 border-t border-black/5 flex flex-col gap-2">
                           {!isHired ? (
                             <Button onClick={() => setNegotiatingTalent(talent)} className="w-full bg-black text-white hover:tracking-[0.2em] transition-all rounded-none">Negotiate Contract</Button>
                           ) : (
                             <div className="flex flex-col gap-1">
                               <div className="text-center p-2 font-mono text-[10px] uppercase bg-black text-white font-bold">
                                 {state.talentContracts.find(c => c.talentId === talent.id)?.weeksRemaining || 0} Wks Left
                               </div>
                               <button 
                                 onClick={() => setNegotiatingTalent(talent)}
                                 className="text-center p-2 font-mono text-[9px] uppercase hover:bg-black hover:text-white transition-all border border-black"
                               >
                                 Renegotiate
                               </button>
                             </div>
                           )}
                           
                           {isHired && state.movies.filter(m => m.status !== 'Released' && m.status !== 'Archived').length > 0 && (
                             <div className="relative group/assign">
                                <button className="w-full border border-black p-2 font-mono text-[10px] uppercase hover:bg-black hover:text-white transition-all">Assign to Project</button>
                                <div className="absolute bottom-full left-0 right-0 hidden group-hover/assign:flex flex-col bg-white border border-black shadow-2xl z-20">
                                   {state.movies.filter(m => m.status !== 'Released' && m.status !== 'Archived').map(m => (
                                     <button 
                                      key={m.id}
                                      onClick={() => assignTalentToMovie(m.id, talent.id)}
                                      className="p-3 text-left hover:bg-black hover:text-white font-mono text-[9px] border-b border-black/10 last:border-0 flex justify-between items-center"
                                     >
                                       <span>{m.title}</span>
                                       <span className="opacity-40 italic">{m.status}</span>
                                     </button>
                                   ))}
                                </div>
                             </div>
                           )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}

            {activeTab === 'licenses' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {MARKET_LICENSES.map(license => {
                   const isOwned = state.licenses.some(l => l.id === license.id);
                   return (
                     <Card key={license.id} className={cn("p-8 border-black transition-all group", isOwned ? "bg-black text-white hover:bg-black" : "bg-white/40 hover:bg-black hover:text-white")}>
                        <div className="flex justify-between mb-4">
                          <span className="font-mono text-[10px] tracking-widest uppercase opacity-40 group-hover:opacity-60">{license.rarity} IP</span>
                          <Shield size={20} className="group-hover:scale-125 transition-transform" />
                        </div>
                        <h3 className="font-serif italic text-3xl mb-1">{license.name}</h3>
                        <p className="font-mono text-[10px] uppercase opacity-40 group-hover:opacity-60 mb-6 underline underline-offset-4">Primary Genre: {license.genre}</p>
                        
                        <div className="flex justify-between items-center mt-auto pt-6 border-t border-black/10 group-hover:border-white/10">
                           <div>
                              <div className="font-mono text-[9px] opacity-40">Acquisition Fee</div>
                              <div className="text-2xl font-mono">${(license.cost/1000000).toFixed(1)}M</div>
                           </div>
                           <Button 
                            disabled={isOwned || state.funds < license.cost}
                            onClick={() => buyLicense(license)} 
                            className={cn("border-black group-hover:border-white transition-all", isOwned && "opacity-50")}
                           >
                            {isOwned ? 'Acquired' : 'Acquire'}
                           </Button>
                        </div>
                     </Card>
                   );
                 })}
                 <Card className="border-dashed border-black/20 flex flex-col items-center justify-center p-12 opacity-50">
                    <TrendingUp className="mb-4" />
                    <p className="font-mono text-[10px] uppercase">New IP appearing soon</p>
                 </Card>
              </div>
            )}

            {activeTab === 'upgrades' && (
              <div className="space-y-4">
                {state.upgrades.map(upgrade => (
                  <div key={upgrade.id} className="p-8 border border-black flex items-center gap-10 bg-white/40 hover:bg-white transition-all">
                    <div className="w-20 h-20 bg-black text-white flex items-center justify-center">
                       <Settings size={32} className={cn(upgrade.level > 0 && "animate-spin-slow")} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-serif italic text-3xl">{upgrade.name}</h3>
                      <p className="font-mono text-[11px] opacity-60 mt-1 max-w-xl leading-relaxed">{upgrade.description}</p>
                      <div className="flex gap-1 mt-4">
                        {[...Array(upgrade.maxLevel)].map((_, i) => (
                          <div key={i} className={cn("h-1 w-12", i < upgrade.level ? "bg-black" : "bg-black/10")} />
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                       <div className="font-mono text-[10px] opacity-40 uppercase mb-1">Evolution Cost</div>
                       <div className="text-3xl font-mono mb-4 tracking-tighter">${(upgrade.cost/1000000).toFixed(1)}M</div>
                       <Button 
                        disabled={state.funds < upgrade.cost || upgrade.level >= upgrade.maxLevel}
                        onClick={() => upgradeStudio(upgrade.id)}
                        className="bg-black text-white px-10"
                       >Level Up</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'rivals' && (
               <div className="space-y-6">
                 {state.rivals.map(rival => (
                   <div key={rival.id} className="p-8 border border-black flex gap-10 items-center bg-black/5 group">
                      <div className="w-20 h-20 bg-black text-white flex items-center justify-center font-serif italic text-4xl leading-none">
                        {rival.name[0]}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-end mb-4">
                          <div>
                            <h4 className="font-serif italic text-3xl font-bold">{rival.name}</h4>
                            <span className="font-mono text-[10px] uppercase bg-black text-white px-2 py-0.5 tracking-widest">{rival.strategy} Logic</span>
                          </div>
                          <div className="text-right font-mono text-[10px] opacity-40">
                             Market Share: {rival.share.toFixed(1)}% <br/>
                             Presence Rank: #{rival.id === 'r1' ? '1' : '3'}
                          </div>
                        </div>
                        <div className="h-1 bg-black/10 w-full overflow-hidden">
                           <motion.div 
                            className="h-full bg-black/60"
                            animate={{ width: `${rival.share}%` }}
                           />
                        </div>
                      </div>
                      <Button className="border-black opacity-0 group-hover:opacity-100 transition-opacity">Analyze Stats</Button>
                   </div>
                 ))}
               </div>
            )}

            {activeTab === 'streaming' && (
              <div className="space-y-8">
                {!state.streaming ? (
                   <div className="p-24 border-2 border-dashed border-black/20 text-center flex flex-col items-center bg-white/20">
                     <Globe size={64} className="opacity-10 mb-6" />
                     <h3 className="font-serif italic text-4xl mb-4">Direct Distribution Network</h3>
                     <p className="max-w-lg font-mono text-xs opacity-50 uppercase leading-relaxed mb-12 tracking-wide">
                        Initialize a global streaming platform. Bypasses theatrical decay and creates 
                        infinite recurring revenue streams based on catalog depth.
                     </p>
                     
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
                        {[
                          { tier: 'Basic', cost: 100, features: ['Local Hubs', 'VOD Only'] },
                          { tier: 'Premium', cost: 250, features: ['Global CDN', 'Live Sports'] },
                          { tier: 'Enterprise', cost: 600, features: ['Hardware Ecosystem', 'Acquisitions'] },
                        ].map(plan => (
                          <div key={plan.tier} className="p-8 border border-black hover:bg-black hover:text-white transition-all bg-white group flex flex-col">
                             <div className="font-serif italic text-2xl mb-1">{plan.tier}</div>
                             <div className="text-3xl font-mono mb-6">${plan.cost}M</div>
                             <div className="space-y-2 mb-8 flex-1">
                                {plan.features.map(f => (
                                  <div key={f} className="font-mono text-[9px] uppercase opacity-50 group-hover:opacity-60">• {f}</div>
                                ))}
                             </div>
                             <Button 
                              disabled={state.funds < (plan.cost * 1000000)}
                              onClick={() => launchStreaming(plan.tier as any)}
                              className="w-full bg-black text-white group-hover:bg-white group-hover:text-black transition-all"
                             >Initialize {plan.tier}</Button>
                          </div>
                        ))}
                     </div>
                   </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     <Card className="bg-black text-[#E4E3E0] p-10 border-none relative overflow-hidden">
                        <div className="relative z-10">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-mono text-[10px] opacity-50 uppercase tracking-widest">Active Subs // {state.streaming.tier}</span>
                            <div className="text-[9px] font-mono opacity-40 bg-white/20 px-2 uppercase">Churn: {(state.streaming.churnRate * 100).toFixed(1)}%</div>
                          </div>
                          <div className="text-6xl font-serif italic my-4">{(state.streaming.subscribers/1000000).toFixed(2)}M</div>
                          <div className="flex items-center gap-2 font-mono text-[11px] opacity-60">
                             <TrendingUp size={14} className="text-green-400" />
                             +{(state.movies.filter(m => m.status === 'Released').length * 2000 / 1000).toFixed(0)}k organic growth
                          </div>
                        </div>
                        <Globe className="absolute -right-10 -bottom-10 opacity-10" size={200} />
                     </Card>

                     <Card className="p-10 bg-white/60 border-black flex flex-col justify-end">
                        <span className="font-mono text-[10px] opacity-50 uppercase tracking-widest">Net Flow / Week</span>
                        <div className="text-5xl font-serif italic mt-2 tracking-tighter">${(state.streaming.monthlyRevenue / 4 / 1000).toFixed(0)}K</div>
                     </Card>

                     <Card className="p-10 bg-white/60 border-black flex flex-col justify-end">
                        <span className="font-mono text-[10px] opacity-50 uppercase tracking-widest">Catalog Nodes</span>
                        <div className="text-6xl font-serif italic mt-2">{state.streaming.contentCount}</div>
                     </Card>
                  </div>
                )}
              </div>
            )}
            {activeTab === 'rivals' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {state.rivals.map(rival => (
                  <Card key={rival.id} className="p-8 border-black bg-white group flex flex-col hover:bg-black hover:text-white transition-all">
                    <div className="flex justify-between items-start mb-6">
                       <div>
                          <h3 className="font-serif italic text-3xl font-bold tracking-tighter leading-none">{rival.name}</h3>
                          <span className="font-mono text-[9px] uppercase opacity-40 group-hover:opacity-60">{rival.strategy} Strategy</span>
                       </div>
                       <Activity size={24} className="opacity-20 group-hover:opacity-100 transition-opacity" />
                    </div>
                    
                    <div className="space-y-6 flex-1">
                       <div>
                          <div className="flex justify-between font-mono text-[10px] uppercase opacity-40 group-hover:opacity-60 mb-2">
                             <span>Estimated Market Share</span>
                             <span>{rival.share.toFixed(1)}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-black/5 group-hover:bg-white/10 overflow-hidden ring-1 ring-black/10 transition-colors">
                             <motion.div 
                              className="h-full bg-black group-hover:bg-white"
                              animate={{ width: `${rival.share}%` }}
                             />
                          </div>
                       </div>

                       <div className="pt-6 border-t border-black/5 group-hover:border-white/10">
                          <div className="font-mono text-[9px] uppercase opacity-40 mb-3">Active Slated Operations</div>
                          <div className="space-y-3">
                             {rival.activeProjects.map((p, idx) => (
                               <div key={idx} className="flex justify-between items-center group/proj hover:bg-black/5 group-hover:hover:bg-white/5 p-1 transition-colors">
                                  <span className="font-serif italic text-sm">{p.title}</span>
                                  <span className="font-mono text-[9px] opacity-40 text-red-500 font-bold">{p.hype}% HYPE</span>
                               </div>
                             ))}
                          </div>
                       </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === 'finance' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-8">
                  <div className="flex justify-between items-end">
                    <h3 className="font-serif italic text-4xl">Debt Matrix</h3>
                    <div className="font-mono text-[10px] uppercase opacity-40">Credit Rating: AA+</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[10000000, 50000000, 250000000].map(amt => (
                      <Card key={amt} className="p-6 border-black hover:bg-black hover:text-white transition-all group cursor-pointer bg-white">
                        <div className="font-mono text-[9px] uppercase opacity-40 group-hover:opacity-60 mb-2">Capital Injection</div>
                        <div className="text-3xl font-mono mb-4">${(amt/1000000).toFixed(0)}M</div>
                        <Button 
                          onClick={() => takeLoan(amt)}
                          className="w-full border-black group-hover:border-white"
                        >
                          Withdraw
                        </Button>
                      </Card>
                    ))}
                  </div>

                  <div className="mt-12">
                    <h4 className="font-serif italic text-2xl mb-6">Outstanding Liabilities</h4>
                    <div className="space-y-4">
                      {state.loans.length === 0 ? (
                        <div className="p-12 border border-dashed border-black/10 text-center font-mono text-[10px] uppercase opacity-30">No active liabilities found in registry.</div>
                      ) : (
                        state.loans.map(loan => (
                          <div key={loan.id} className="p-6 border border-black bg-white flex justify-between items-center group hover:bg-black hover:text-white transition-colors">
                            <div className="flex-1 mr-8">
                              <div className="flex justify-between mb-1">
                                <span className="font-mono text-[9px] uppercase opacity-40 group-hover:opacity-60">Facility ID: {loan.id.toUpperCase()}</span>
                                <span className="font-mono text-[9px] uppercase opacity-40 group-hover:opacity-60">APR: {(loan.interestRate*100).toFixed(0)}%</span>
                              </div>
                              <div className="text-xl font-mono">${(loan.totalToPay/1000000).toFixed(1)}M Total Debt</div>
                              <div className="h-1 w-full bg-black/5 group-hover:bg-white/10 mt-4 overflow-hidden">
                                <motion.div className="h-full bg-black group-hover:bg-white transition-colors" animate={{ width: `${(loan.paidAmount/loan.totalToPay)*100}%` }} />
                              </div>
                            </div>
                            <Button 
                              onClick={() => payLoan(loan.id, Math.min(state.funds, 10000000))} 
                              className="bg-black text-white group-hover:bg-white group-hover:text-black border-black group-hover:border-white transition-all whitespace-nowrap"
                            >
                              Repay $10M
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="flex justify-between items-end">
                    <h3 className="font-serif italic text-4xl">Market Index</h3>
                    <div className="font-mono text-[10px] uppercase opacity-40">Exchange: TYCN.Q</div>
                  </div>
                  <Card className="p-10 border-black bg-black text-white h-[450px] flex flex-col shadow-2xl">
                    <div className="flex justify-between items-start mb-10">
                      <div>
                        <div className="text-5xl font-mono tracking-tighter leading-none">${state.stocks.sharePrice.toFixed(2)}</div>
                        <div className={cn("font-mono text-[10px] uppercase mt-2 font-bold", state.stocks.history[state.stocks.history.length-1] >= (state.stocks.history[state.stocks.history.length-2] || 0) ? "text-green-400" : "text-red-400")}>
                          {state.stocks.history[state.stocks.history.length-1] >= (state.stocks.history[state.stocks.history.length-2] || 0) ? "▲" : "▼"}
                          {Math.abs(((state.stocks.history[state.stocks.history.length-1] / (state.stocks.history[state.stocks.history.length-2] || 1)) - 1) * 100).toFixed(2)}%
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-[9px] uppercase opacity-40">Studio Valuation</div>
                        <div className="text-3xl font-mono">${(state.stocks.valuation / 1000000000).toFixed(2)}B</div>
                      </div>
                    </div>
                    
                    <div className="flex-1 flex items-end gap-1.5 px-4 mb-4">
                      {state.stocks.history.map((price, i) => (
                        <motion.div 
                          key={i} 
                          initial={{ height: 0 }}
                          animate={{ height: `${(price / Math.max(...state.stocks.history, 1)) * 100}%` }}
                          className="flex-1 bg-white/20 hover:bg-white transition-all cursor-crosshair min-w-[4px]"
                          title={`Value: $${price.toFixed(2)}`}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between font-mono text-[8px] uppercase opacity-40 border-t border-white/20 pt-6">
                      <span>Performance Vector Analysis</span>
                      <span>Vol: {Math.floor(state.stocks.valuation / 5000000)} Shares</span>
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'awards' && (
              <div className="p-24 border-2 border-dashed border-black/10 text-center flex flex-col items-center">
                 <Award size={64} className="opacity-10 mb-6" />
                 <h3 className="font-serif italic text-4xl mb-4">The Academy Archives</h3>
                 <p className="max-w-lg font-mono text-xs opacity-50 uppercase leading-relaxed tracking-wide">
                    Historical record of cinematic excellence. Submissions open during the Q4 Gala event.
                 </p>
              </div>
            )}

            {activeTab === 'franchises' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {state.franchises.length === 0 ? (
                  <div className="col-span-2 p-24 border-2 border-dashed border-black/20 text-center flex flex-col items-center">
                    <Zap size={64} className="opacity-10 mb-6" />
                    <h3 className="font-serif italic text-4xl mb-4">No Active Franchises</h3>
                    <p className="max-w-lg font-mono text-xs opacity-50 uppercase leading-relaxed mb-10 tracking-wide">
                      Establish a franchise from a successful release to enable sequels, spin-offs, and 
                      compound market growth.
                    </p>
                  </div>
                ) : (
                  state.franchises.map(franchise => (
                    <Card key={franchise.id} className="p-8 border-black bg-white group overflow-hidden">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="font-serif italic text-4xl font-bold tracking-tighter">{franchise.name}</h3>
                          <span className="font-mono text-[10px] uppercase opacity-40">Franchise Level {franchise.level} // Synergy: +{(franchise.level * 15)}%</span>
                        </div>
                        <Zap className="text-yellow-500 fill-yellow-500" size={24} />
                      </div>
                      
                      <div className="space-y-2 mb-8">
                        <div className="flex justify-between font-mono text-[10px] opacity-40 uppercase">
                          <span>Growth Progress</span>
                          <span>Next Level: ${(franchise.level * 500).toFixed(0)}M</span>
                        </div>
                        <div className="h-2 w-full bg-black/5 relative overflow-hidden ring-1 ring-black/10">
                           <motion.div 
                            className="absolute top-0 left-0 h-full bg-yellow-400"
                            animate={{ width: `${(franchise.totalRevenue / (franchise.level * 500000000)) * 100}%` }}
                           />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 border-t border-black/5 pt-6">
                         <div>
                            <div className="font-mono text-[9px] opacity-40 uppercase">Lifetime Revenue</div>
                            <div className="text-2xl font-mono">${(franchise.totalRevenue/1000000).toFixed(1)}M</div>
                         </div>
                         <div>
                            <div className="font-mono text-[9px] opacity-40 uppercase">Catalog Size</div>
                            <div className="text-2xl font-mono">{franchise.movies.length} Nodes</div>
                         </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Modals */}
      {distributionMovie && (
        <CinemaDealsModal 
          movie={distributionMovie} 
          onClose={() => setDistributionMovie(null)} 
          onSelect={(deal) => {
            setCinemaDeal(distributionMovie.id, deal);
            updateMovieStatus(distributionMovie.id, 'Released');
          }}
        />
      )}

      {negotiatingTalent && (
        <NegotiationModal 
          talent={negotiatingTalent}
          onClose={() => setNegotiatingTalent(null)}
          onAccept={(talent) => {
            hireTalent(talent);
            setNegotiatingTalent(null);
          }}
        />
      )}

      {marketingMovie && (
        <MarketingModal 
          movie={marketingMovie}
          onClose={() => setMarketingMovie(null)}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <GameProvider>
        <Dashboard />
      </GameProvider>
    </ErrorBoundary>
  );
}
