import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Talent } from '../game/types';
import { startNegotiation, makeOffer, NegotiationState } from '../game/negotiationCore';
import { Button, Card, cn } from './components';
import { X } from 'lucide-react';

interface Props {
  talent: Talent;
  onClose: () => void;
  onAccept: (talent: Talent) => void;
}

export const NegotiationModal: React.FC<Props> = ({ talent, onClose, onAccept }) => {
  const [negState, setNegState] = useState<NegotiationState>(startNegotiation(talent));
  const [offerInput, setOfferInput] = useState(talent.salary.toString());

  const handleOffer = () => {
    const amount = parseInt(offerInput);
    if (isNaN(amount)) return;
    
    const next = makeOffer(negState, amount);
    setNegState(next);
    
    if (next.isAccepted) {
      setTimeout(() => onAccept(talent), 1500);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card title={`Negotiating: ${talent.name}`} className="w-full max-w-lg bg-[#E4E3E0] border-2 border-black rounded-none">
        <div className="flex justify-between items-start mb-6">
          <div className="font-mono text-[10px] uppercase opacity-50 tracking-widest leading-relaxed">
            {talent.type} // Skill: {talent.skill} // Initial Asking: ${talent.salary.toLocaleString()}
          </div>
          <button onClick={onClose} className="hover:rotate-90 transition-transform"><X size={16} /></button>
        </div>

        <div className="h-48 overflow-y-auto mb-6 space-y-3 font-mono text-[10px] border-black pb-4 border-b">
          {negState.history.length === 0 && <div className="opacity-40 italic">Waiting for secure connection...</div>}
          {negState.history.map((h, i) => (
            <div key={i} className={cn("p-2 border", h.type === 'offer' ? "bg-black text-white ml-12" : "border-black/10 mr-12")}>
              <span className={cn(h.type === 'acceptance' ? "text-green-500 font-bold" : h.type === 'rejection' ? "text-red-500 font-bold" : "")}>
                {h.type === 'offer' ? `SENDER: $${h.amount.toLocaleString()}` : `${talent.name.toUpperCase()}: ${h.message}`}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-6">
          <div className="space-y-2">
            <div className="flex justify-between font-mono text-[9px] uppercase opacity-40 tracking-wider">
               <span>Patience Level</span>
               <span>{negState.patience}%</span>
            </div>
            <div className="h-1 w-full bg-black/5 ring-1 ring-black/10 overflow-hidden">
              <motion.div 
                className="h-full bg-black" 
                initial={{ width: '100%' }}
                animate={{ width: `${negState.patience}%` }} 
              />
            </div>
          </div>
          
          {!negState.isClosed ? (
            <div className="flex gap-2">
              <input 
                type="number" 
                value={offerInput}
                onChange={(e) => setOfferInput(e.target.value)}
                className="flex-1 bg-white/50 border-2 border-black p-4 font-mono text-sm focus:outline-none focus:bg-white transition-all rounded-none"
                placeholder="PROPOSED SALARY..."
              />
              <Button onClick={handleOffer} className="bg-black text-white px-8 rounded-none hover:tracking-widest transition-all">Submit</Button>
            </div>
          ) : (
            <div className={cn(
               "p-6 text-center font-bold font-mono uppercase tracking-[0.3em] text-lg", 
               negState.isAccepted ? 'bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)]' : 'bg-red-500 text-white'
            )}>
              {negState.isAccepted ? 'CONNECTED' : 'DISCONNECT'}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
