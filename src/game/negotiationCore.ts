import { Talent } from './types';

export interface NegotiationState {
  talent: Talent;
  offeredSalary: number;
  patience: number; // 0 to 100
  history: { type: 'offer' | 'rejection' | 'acceptance', amount: number, message: string }[];
  isClosed: boolean;
  isAccepted: boolean;
}

export function startNegotiation(talent: Talent): NegotiationState {
  return {
    talent,
    offeredSalary: talent.salary * 0.8,
    patience: 100,
    history: [],
    isClosed: false,
    isAccepted: false,
  };
}

export function makeOffer(state: NegotiationState, amount: number): NegotiationState {
  const diff = amount - state.talent.salary;
  const patienceDrop = diff < 0 ? Math.abs(diff / state.talent.salary) * 50 : 5;
  
  const newState = { ...state, patience: Math.max(0, state.patience - patienceDrop) };
  
  if (amount >= state.talent.salary * 0.95) {
    return {
      ...newState,
      isAccepted: true,
      isClosed: true,
      history: [...state.history, { type: 'acceptance', amount, message: "I'm in. Let's make a masterpiece." }]
    };
  }
  
  if (newState.patience <= 0) {
    return {
      ...newState,
      isClosed: true,
      history: [...state.history, { type: 'rejection', amount, message: "This is insulting. I'm leaving." }]
    };
  }

  return {
    ...newState,
    history: [...state.history, { type: 'rejection', amount, message: "You'll need to do better than that." }]
  };
}
