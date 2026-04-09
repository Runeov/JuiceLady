'use client';

import { Store } from 'lucide-react';
import { shopConfig } from '@/lib/config';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-800 via-brand-700 to-brand-900 text-white">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-accent-light/15 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-yellow-400/10 rounded-full blur-2xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 py-12 sm:py-16 text-center">
        {/* Logo mark */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm mb-4 ring-2 ring-white/20">
          <Store className="w-8 h-8 text-white" />
        </div>

        <h2 className="font-display text-3xl sm:text-4xl font-bold mb-2 tracking-tight">
          {shopConfig.name}
        </h2>
        <p className="text-white/80 text-sm sm:text-base uppercase tracking-[0.3em] mb-4">
          {shopConfig.tagline}
        </p>
        <p className="text-white/70 text-sm max-w-md mx-auto leading-relaxed">
          {shopConfig.description}
        </p>

        {shopConfig.phone && (
          <div className="mt-5 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-xs text-white/80">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-light animate-pulse" />
            {shopConfig.phone}
          </div>
        )}
      </div>
    </section>
  );
}
