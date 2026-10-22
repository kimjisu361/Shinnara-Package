import React from 'react';
import { PROCESS_STEPS } from '../data/content';
import { PageTab } from '../types';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { BrandVisualGraphic } from './BrandVisualGraphic';

interface ProcessSectionProps {
  onNavigate: (tab: PageTab) => void;
}

export const ProcessSection: React.FC<ProcessSectionProps> = ({ onNavigate }) => {
  return (
    <section className="py-20 lg:py-28 bg-[#F7F4FF]/50 border-b border-[#E8E3F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Block */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs font-mono font-bold tracking-widest text-[#8B6CF6] uppercase block mb-3">
            HOW IT WORKS
          </span>
          <h2 className="font-['Outfit',sans-serif] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#292532] tracking-tight mb-4">
            Simple. Clear. Carefully Packed.
          </h2>
          <p className="text-base text-[#514078]">
            포장 문의부터 견적 협의, 실제 포장 작업까지 명확하고 안전하게 진행됩니다.
          </p>
        </div>

        {/* 4 Process Steps Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {PROCESS_STEPS.map((step) => (
            <div
              key={step.num}
              className="bg-white border border-[#E8E3F0] rounded-xl p-6 flex flex-col justify-between hover:border-[#B8A1F7] transition-all hover:shadow-md hover:shadow-purple-950/5 relative group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-2xl font-['Outfit',sans-serif] font-bold text-[#8B6CF6]">
                    {step.num}
                  </span>
                  <span className="text-[11px] font-mono tracking-wider text-[#777180] uppercase">
                    {step.enTitle}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#292532] mb-3 group-hover:text-[#514078] transition-colors">
                  {step.krTitle}
                </h3>

                <p className="text-sm font-medium text-[#514078] mb-3 leading-snug">
                  {step.description}
                </p>

                <p className="text-xs text-[#777180] leading-relaxed">
                  {step.detailText}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-[#E8E3F0] flex items-center gap-1.5 text-xs text-[#8B6CF6] font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>표준 검수 프로세스</span>
              </div>
            </div>
          ))}
        </div>

        {/* Studio Quality Workbench Callout Banner */}
        <div className="bg-white rounded-2xl border border-[#E8E3F0] p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4 h-48 rounded-xl overflow-hidden">
            <BrandVisualGraphic
              type="workbench"
              className="w-full h-full"
              alt="신나라패키지 포장 작업 환경"
            />
          </div>
          <div className="lg:col-span-8 flex flex-col justify-between">
            <div className="space-y-2 mb-4">
              <span className="text-xs font-mono text-[#8B6CF6] uppercase font-semibold">
                PACKING ENVIRONMENT & ETHICS
              </span>
              <h4 className="text-xl font-bold text-[#292532]">
                투명하고 정돈된 스튜디오 작업 환경
              </h4>
              <p className="text-sm text-[#777180] leading-relaxed">
                모든 굿즈는 먼지 유입을 차단한 클린 작업대에서 1:1 무손상 핸들링 원칙을 준수하여 작업합니다.
                확인되지 않은 임의의 최소 수량이나 가격 대신, 고객님의 실제 굿즈 구성에 맞춰 정직하고 합리적인 견적을 안내해 드립니다.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('quote')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#8B6CF6] text-white rounded-lg text-xs sm:text-sm font-semibold hover:bg-[#7854f3] transition-colors"
              >
                <span>견적 문의 작성하기</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('process')}
                className="text-xs sm:text-sm font-semibold text-[#514078] hover:text-[#8B6CF6] transition-colors"
              >
                작업 안내 자세히 보기 ↗
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
