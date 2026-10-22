import React from 'react';
import { BRAND_INFO } from '../data/content';
import { Sparkles, ShieldCheck, Layers, Eye } from 'lucide-react';

export const IntroSection: React.FC = () => {
  return (
    <section className="py-20 lg:py-28 bg-white border-b border-[#E8E3F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header with Generous Whitespace */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs font-mono font-bold tracking-widest text-[#8B6CF6] uppercase block mb-3">
            {BRAND_INFO.intro.kicker}
          </span>
          <h2 className="font-['Outfit',sans-serif] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#292532] tracking-tight leading-tight mb-6 text-balance">
            {BRAND_INFO.intro.title}
          </h2>
          <p className="text-base sm:text-lg text-[#514078] leading-relaxed">
            {BRAND_INFO.intro.description}
          </p>
        </div>

        {/* 3 Editorial Pillars - Not Cliché Cards, Asymmetric Clean Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-[#E8E3F0]">
          {/* Pillar 1 */}
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#F7F4FF] border border-[#B8A1F7]/30 flex items-center justify-center text-[#8B6CF6]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#292532]">
              무손상 정밀 핸들링
            </h3>
            <p className="text-sm text-[#777180] leading-relaxed">
              수집품의 가치를 지키기 위해 정전기 방지 패드와 지문 방지 장갑을 착용하고 미세 스크래치와 모서리 찌그러짐을 철저히 예방합니다.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#F7F4FF] border border-[#B8A1F7]/30 flex items-center justify-center text-[#8B6CF6]">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#292532]">
              일관된 접착 & 수평 정렬
            </h3>
            <p className="text-sm text-[#777180] leading-relaxed">
              OPP 테이핑 각도, 공기층 제거, 슬리브 여백을 균일하게 정돈하여 굿즈를 수령했을 때 단정하고 프리미엄한 첫인상을 제공합니다.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#F7F4FF] border border-[#B8A1F7]/30 flex items-center justify-center text-[#8B6CF6]">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#292532]">
              전수 검수 및 안전 패킹
            </h3>
            <p className="text-sm text-[#777180] leading-relaxed">
              랜덤 특전 혼입이나 수량 오차를 방지하기 위해 단계별 크로스 체크를 진행하며, 안전한 에어캡 완충 후 박스 출고합니다.
            </p>
          </div>
        </div>

        {/* Brand Philosophy Quote Strip */}
        <div className="mt-16 p-6 sm:p-8 rounded-xl bg-[#F7F4FF] border border-[#E8E3F0] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-mono tracking-wider text-[#8B6CF6] uppercase">
              PHILOSOPHY
            </span>
            <p className="text-sm sm:text-base font-semibold text-[#514078]">
              “포토카드 한 장, 특전 봉투 하나에도 팬의 설렘과 아티스트의 브랜드 가치가 담겨 있습니다.”
            </p>
          </div>
          <span className="text-xs font-mono text-[#777180] shrink-0">
            SINNARA PACKAGE STUDIO
          </span>
        </div>
      </div>
    </section>
  );
};
