import React from 'react';
import { PageTab } from '../types';
import { ArrowRight, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { BrandVisualGraphic } from './BrandVisualGraphic';

interface HeroSectionProps {
  onNavigate: (tab: PageTab) => void;
  customHeroImage?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onNavigate,
  customHeroImage,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#F7F4FF]/50 to-white pt-10 sm:pt-16 pb-16 lg:pb-24 border-b border-[#E8E3F0]">
      {/* Subtle lavender aura light in background */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#E9E1FF]/40 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-72 h-72 bg-[#B8A1F7]/15 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 2-Column Split Hero Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
          {/* Left Column: Editorial Headline & Actions (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between z-10">
            <div>
              {/* Small English Label */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F7F4FF] border border-[#B8A1F7]/40 rounded-md text-xs font-mono tracking-wider text-[#514078] mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8B6CF6]" />
                <span>SINNARA PACKAGE / GOODS PACKAGING STUDIO</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-['Outfit',sans-serif] text-4xl sm:text-5xl lg:text-[3.75rem] font-bold text-[#292532] tracking-tight leading-[1.12] mb-6 text-balance">
                굿즈의 설렘까지
                <br />
                <span className="text-[#8B6CF6]">포장하다.</span>
              </h1>

              {/* Sub Message */}
              <p className="text-base sm:text-lg text-[#514078] leading-relaxed max-w-xl font-normal mb-8">
                “포토카드부터 앨범 특전과 다양한 아이돌 굿즈까지.
                신나라패키지가 꼼꼼하고 감각적인 포장 작업을 함께합니다.”
              </p>

              {/* Key Bullet Callouts */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10 pt-2 border-t border-[#E8E3F0]">
                <div className="flex items-center gap-2 text-xs text-[#292532]">
                  <CheckCircle2 className="w-4 h-4 text-[#8B6CF6] shrink-0" />
                  <span>아이돌 굿즈 전담 포장</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#292532]">
                  <CheckCircle2 className="w-4 h-4 text-[#8B6CF6] shrink-0" />
                  <span>투명 OPP · 무손상 핸들링</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#292532]">
                  <CheckCircle2 className="w-4 h-4 text-[#8B6CF6] shrink-0" />
                  <span>대량 발주 맞춤 공정</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate('quote')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#8B6CF6] hover:bg-[#7854f3] active:bg-[#6842e4] text-white font-semibold rounded-lg shadow-sm hover:shadow transition-all text-sm group focus:outline-none focus:ring-2 focus:ring-[#8B6CF6]/40"
              >
                <span>견적 문의하기</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>

              <button
                onClick={() => onNavigate('services')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-[#F7F4FF] text-[#514078] font-semibold border border-[#E8E3F0] hover:border-[#B8A1F7] rounded-lg transition-all text-sm group focus:outline-none"
              >
                <span>포장 서비스 보기</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Right Column: Studio Editorial Visual (5 cols) */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="w-full h-full min-h-[360px] sm:min-h-[440px] rounded-xl overflow-hidden shadow-xl shadow-purple-900/5 relative group">
              <BrandVisualGraphic
                type="hero"
                customSrc={customHeroImage}
                alt="신나라패키지 아이돌 굿즈 포장 스튜디오 작업대"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>

        {/* Target Audience Strip - Clean Editorial Layout */}
        <div className="mt-14 pt-8 border-t border-[#E8E3F0]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="text-xs font-mono tracking-wider text-[#777180] uppercase">
              SPECIALIZED PARTNER FOR
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-[#514078]">
              <span>아이돌 굿즈 판매사</span>
              <span className="text-[#B8A1F7]">/</span>
              <span>포토카드 & 앨범 특전 셀러</span>
              <span className="text-[#B8A1F7]">/</span>
              <span>팬덤 굿즈 제작 스튜디오</span>
              <span className="text-[#B8A1F7]">/</span>
              <span>대량 행사 운영사</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
