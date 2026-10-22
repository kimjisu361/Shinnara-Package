import React from 'react';
import { PageTab } from '../types';
import { ArrowUpRight } from 'lucide-react';

interface FinalCtaSectionProps {
  onNavigate: (tab: PageTab) => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({ onNavigate }) => {
  return (
    <section className="relative overflow-hidden bg-[#514078] text-white py-20 lg:py-28">
      {/* Soft lavender gradient orbs for futuristic soft studio atmosphere */}
      <div className="absolute top-0 right-10 w-80 h-80 bg-[#8B6CF6]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-[#B8A1F7]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <span className="text-xs font-mono tracking-widest text-[#E9E1FF] uppercase inline-block mb-4">
          LET'S WORK TOGETHER
        </span>

        <h2 className="font-['Outfit',sans-serif] text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-white text-balance">
          Let's Pack Something Good.
        </h2>

        <p className="text-base sm:text-lg text-[#E9E1FF]/90 max-w-2xl mx-auto leading-relaxed mb-10">
          “포장할 굿즈가 있으신가요? 굿즈 종류와 수량을 알려주시면
          상담을 통해 작업 방향을 함께 확인하겠습니다.”
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('quote')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#8B6CF6] hover:bg-[#9d82f8] active:bg-[#7854f3] text-white font-bold rounded-xl shadow-lg shadow-purple-950/20 transition-all text-base group focus:outline-none focus:ring-2 focus:ring-[#E9E1FF]"
          >
            <span>견적 문의하기</span>
            <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </button>
        </div>

        {/* Small Trust Note */}
        <div className="mt-12 text-xs text-[#E9E1FF]/60 flex items-center justify-center gap-4 flex-wrap">
          <span>SINNARA PACKAGE</span>
          <span>·</span>
          <span>LAVENDER GOODS PACKAGING STUDIO</span>
          <span>·</span>
          <span>아이돌 굿즈 포장 전문</span>
        </div>
      </div>
    </section>
  );
};
