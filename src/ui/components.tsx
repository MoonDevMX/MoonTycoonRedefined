import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center font-mono text-[10px] uppercase tracking-widest px-4 py-2 border border-black/20 hover:bg-black hover:text-[#E4E3E0] transition-colors disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
);

export const Card = ({ children, className, title }: { children: React.ReactNode; className?: string; title?: string }) => (
  <div className={cn("border border-black p-6 bg-white/40 backdrop-blur-sm relative", className)}>
    <div className="absolute top-0 right-0 p-1 opacity-10 pointer-events-none">
       <div className="w-1 h-1 bg-black mb-1" />
       <div className="w-1 h-1 bg-black" />
    </div>
    {title && <h3 className="font-serif italic text-lg mb-4 border-b border-black pb-4 tracking-tighter">{title}</h3>}
    {children}
  </div>
);

export const StatBox = ({ label, value, subtext }: { label: string; value: string; subtext?: string }) => (
  <div className="border border-black p-4 bg-white/60 hover:bg-black hover:text-white transition-all group">
    <div className="font-mono text-[8px] uppercase tracking-[0.2em] opacity-40 group-hover:opacity-60 mb-2">{label}</div>
    <div className="text-3xl font-serif italic tracking-tighter leading-none">{value}</div>
    {subtext && <div className="font-mono text-[9px] opacity-30 mt-2 group-hover:opacity-50">{subtext}</div>}
  </div>
);
