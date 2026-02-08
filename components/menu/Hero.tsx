'use client';

import { Leaf } from 'lucide-react';
import { useCartStore } from '@/lib/store';

export default function Hero() {
  const { language } = useCartStore();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-cameron-800 via-cameron-700 to-cameron-900 text-white">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-matcha/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-matcha-light/15 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-yellow-400/10 rounded-full blur-2xl" />
        {/* Floating leaves */}
        <Leaf className="absolute top-8 right-16 w-8 h-8 text-matcha-light/20 animate-float" />
        <Leaf
          className="absolute bottom-12 left-20 w-6 h-6 text-matcha-light/15 animate-float"
          style={{ animationDelay: '1s' }}
        />
        <Leaf
          className="absolute top-16 left-1/2 w-5 h-5 text-matcha-light/10 animate-float"
          style={{ animationDelay: '2s' }}
        />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 py-12 sm:py-16 text-center">
        {/* Logo mark */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm mb-4 ring-2 ring-matcha-light/30">
          <Leaf className="w-8 h-8 text-matcha-light" />
        </div>

        <h2 className="font-display text-3xl sm:text-4xl font-bold mb-2 tracking-tight">
          {language === 'th' ? 'ชาคาเมรอน' : 'Cameron Natural'}
        </h2>
        <p className="text-matcha-light/90 text-sm sm:text-base uppercase tracking-[0.3em] mb-4">
          Premium Natural Tea
        </p>
        <p className="text-white/70 text-sm max-w-md mx-auto leading-relaxed">
          {language === 'th'
            ? 'ชานมไข่มุก กาแฟ มัทฉะ และเครื่องดื่มสดใหม่ สั่งออนไลน์ได้เลย!'
            : 'Bubble tea, coffee, matcha & fresh drinks. Order online now!'}
        </p>

        {/* Pattaya location badge */}
        <div className="mt-5 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-xs text-white/80">
          <span className="w-1.5 h-1.5 rounded-full bg-matcha-light animate-pulse" />
          {language === 'th' ? 'สาขา พัทยา' : 'Pattaya Branch'}
          <span className="mx-1 text-white/30">|</span>
          063-296-9062
        </div>
      </div>
    </section>
  );
}
