import React from 'react';
import { CORE_SERVICES } from '../data/content';
import { PageTab } from '../types';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { BrandVisualGraphic } from './BrandVisualGraphic';

interface ServiceSectionProps {
  onNavigate: (tab: PageTab) => void;
}

export const ServiceSection: React.FC<ServiceSectionProps> = ({ onNavigate }) => {
  const visualTypes: Record<string, 'photocard' | 'sleeve' | 'benefits' | 'set'> = {
    'photocard-packing': 'photocard',
    'opp-and-sleeve': 'sleeve',
    'special-benefits': 'benefits',
    'goods-set-packing': 'set',
  };

  return (
    <section className="py-20 lg:py-28 bg-[#F7F4FF]/40 border-b border-[#E8E3F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <span className="text-xs font-mono font-bold tracking-widest text-[#8B6CF6] uppercase block mb-3">
              WHAT WE PACKAGE
            </span>
            <h2 className="font-['Outfit',sans-serif] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#292532] tracking-tight">
              Made for Your Goods.
            </h2>
          </div>
          <button
            onClick={() => onNavigate('services')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#514078] hover:text-[#8B6CF6] transition-colors group self-start md:self-auto"
          >
            <span>전체 포장 서비스 상세 보기</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* 4 Core Services - Asymmetric 2x2 Grid with Studio Visuals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {CORE_SERVICES.map((service, index) => {
            const visualType = visualTypes[service.id] || 'photocard';
            return (
              <div
                key={service.id}
                className="group bg-white border border-[#E8E3F0] hover:border-[#B8A1F7] rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-purple-950/5 flex flex-col justify-between"
              >
                {/* Visual Area */}
                <div className="h-56 sm:h-64 w-full overflow-hidden bg-[#F7F4FF] border-b border-[#E8E3F0] relative">
                  <BrandVisualGraphic
                    type={visualType}
                    className="w-full h-full"
                    alt={service.krTitle}
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded text-[11px] font-mono text-[#514078] border border-[#E8E3F0]">
                    0{index + 1}
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-mono tracking-wider text-[#8B6CF6] uppercase mb-1">
                      {service.enTitle}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#292532] mb-3 group-hover:text-[#514078] transition-colors">
                      {service.krTitle}
                    </h3>
                    <p className="text-sm text-[#777180] leading-relaxed mb-6">
                      {service.description}
                    </p>
                  </div>

                  {/* Materials / Tags (Clean unboxed inline metadata) */}
                  <div className="pt-4 border-t border-[#E8E3F0] flex items-center justify-between">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#514078]">
                      {service.materials?.map((mat, i) => (
                        <React.Fragment key={mat}>
                          <span>{mat}</span>
                          {i < (service.materials?.length || 0) - 1 && (
                            <span className="text-[#B8A1F7]" aria-hidden="true">·</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                    <button
                      onClick={() => onNavigate('quote')}
                      className="text-xs font-semibold text-[#8B6CF6] hover:text-[#514078] inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>문의</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Scope Assurance */}
        <div className="mt-12 text-center text-xs text-[#777180]">
          * 규격 외 특수 사이즈나 맞춤 부자재 적용 여부는 사전 상담 시 유연하게 조율 가능합니다.
        </div>
      </div>
    </section>
  );
};
