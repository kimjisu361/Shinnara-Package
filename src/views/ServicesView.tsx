import React, { useState } from 'react';
import { DETAILED_SERVICES } from '../data/content';
import { PageTab, ServiceItem } from '../types';
import { ArrowUpRight, CheckCircle2, AlertCircle, Trash2, RotateCcw } from 'lucide-react';
import { BrandVisualGraphic } from '../components/BrandVisualGraphic';

interface ServicesViewProps {
  onNavigate: (tab: PageTab) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({ onNavigate }) => {
  const [services, setServices] = useState<ServiceItem[]>(DETAILED_SERVICES);

  const handleDeleteService = (id: string) => {
    setServices(prev => prev.filter(item => item.id !== id));
  };

  const handleResetServices = () => {
    setServices(DETAILED_SERVICES);
  };

  const getVisualType = (cat: string): 'photocard' | 'sleeve' | 'benefits' | 'set' => {
    switch (cat) {
      case 'photocard': return 'photocard';
      case 'opp': return 'sleeve';
      case 'benefits': return 'benefits';
      case 'set': return 'set';
      default: return 'photocard';
    }
  };

  return (
    <div className="py-12 sm:py-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F7F4FF] border border-[#B8A1F7]/40 rounded-md text-xs font-mono tracking-wider text-[#514078] mb-4">
            PACKAGING SERVICES
          </div>
          <h1 className="font-['Outfit',sans-serif] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#292532] tracking-tight mb-4">
            아이돌 굿즈 포장 서비스
          </h1>
          <p className="text-base sm:text-lg text-[#514078] leading-relaxed">
            “굿즈의 종류와 구성, 포장 목적에 맞춰 필요한 작업을 상담합니다.”
          </p>
        </div>

        {/* Notice Banner */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#F7F4FF] border border-[#E8E3F0] mb-12 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#8B6CF6] shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-[#514078] leading-relaxed">
            <span className="font-bold text-[#292532]">작업 가능 안내:</span> 굿즈의 실제 규격, 세부 구성품, 수량, 고객사 포장재 제공 여부 및 납품 희망 일정에 따라 공정 설계와 작업 가능 여부가 상이할 수 있습니다. 상담 폼을 남겨주시면 적합한 진행 방식을 안내해 드립니다.
          </div>
        </div>

        {/* Action strip to toggle/customize list if service is not offered */}
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#E8E3F0] text-xs text-[#777180]">
          <span>등록된 서비스 항목: {services.length}개</span>
          {services.length < DETAILED_SERVICES.length && (
            <button
              onClick={handleResetServices}
              className="text-[#8B6CF6] hover:underline flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>전체 기본 항목 복원하기</span>
            </button>
          )}
        </div>

        {/* Services List - Large Image, Service Name, Brief Description */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((item) => (
            <div
              key={item.id}
              className="group bg-white border border-[#E8E3F0] hover:border-[#B8A1F7] rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md flex flex-col justify-between"
            >
              <div>
                {/* Image Container */}
                <div className="h-56 w-full relative bg-[#F7F4FF] overflow-hidden border-b border-[#E8E3F0]">
                  <BrandVisualGraphic
                    type={getVisualType(item.category)}
                    className="w-full h-full"
                    alt={item.krTitle}
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-0.5 rounded text-[10px] font-mono text-[#514078] border border-[#E8E3F0]">
                    {item.enTitle}
                  </div>
                  {/* Delete button (as requested: "실제로 제공하지 않는 서비스는 쉽게 삭제할 수 있도록 만들어 주세요") */}
                  <button
                    onClick={() => handleDeleteService(item.id)}
                    className="absolute top-3 right-3 p-1.5 bg-white/90 hover:bg-rose-50 hover:text-rose-600 rounded text-slate-400 opacity-60 hover:opacity-100 transition-opacity"
                    title="이 서비스 항목 숨기기/삭제"
                    aria-label="서비스 항목 삭제"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#292532] mb-2 group-hover:text-[#514078] transition-colors">
                    {item.krTitle}
                  </h3>
                  <p className="text-sm text-[#777180] leading-relaxed mb-6">
                    {item.description}
                  </p>

                  {/* Key check details */}
                  {item.details && (
                    <div className="space-y-2 mb-6">
                      {item.details.map((detail, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-[#514078]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#8B6CF6] shrink-0 mt-0.5" />
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Materials & Quote Link */}
              <div className="px-6 pb-6 pt-2 border-t border-[#E8E3F0]/60 flex items-center justify-between">
                <span className="text-xs text-[#777180]">
                  {item.materials?.join(' · ')}
                </span>
                <button
                  onClick={() => onNavigate('quote')}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#8B6CF6] hover:text-[#514078]"
                >
                  <span>견적 문의</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Card */}
        <div className="p-8 sm:p-12 rounded-2xl bg-[#F7F4FF] border border-[#E8E3F0] text-center max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-[#292532] mb-3">
            원하시는 포장 형태가 목록에 없으신가요?
          </h2>
          <p className="text-sm text-[#777180] mb-8 leading-relaxed max-w-xl mx-auto">
            신나라패키지는 정형화된 규격 외에도 특수 굿즈, 복합 구성품 키트 등 다양한 아이돌 굿즈 포장을 상담해 드립니다.
          </p>
          <button
            onClick={() => onNavigate('quote')}
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#8B6CF6] text-white font-semibold rounded-lg hover:bg-[#7854f3] transition-colors text-sm shadow-sm"
          >
            <span>아이돌 굿즈 견적 문의하기</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
