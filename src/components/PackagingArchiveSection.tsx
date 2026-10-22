import React, { useState } from 'react';
import { ARCHIVE_SAMPLES } from '../data/content';
import { ArchiveItem, PageTab } from '../types';
import { ArrowUpRight, Maximize2, X, Sparkles } from 'lucide-react';
import { BrandVisualGraphic } from './BrandVisualGraphic';

interface PackagingArchiveSectionProps {
  onNavigate: (tab: PageTab) => void;
}

export const PackagingArchiveSection: React.FC<PackagingArchiveSectionProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeModalItem, setActiveModalItem] = useState<ArchiveItem | null>(null);

  const categories = ['ALL', 'PHOTOCARD', 'OPP & SLEEVE', 'SPECIAL BENEFITS', 'GOODS SET'];

  const filteredItems = selectedCategory === 'ALL'
    ? ARCHIVE_SAMPLES
    : ARCHIVE_SAMPLES.filter(item => item.category === selectedCategory);

  const getVisualType = (cat: string): 'photocard' | 'sleeve' | 'benefits' | 'set' => {
    switch (cat) {
      case 'PHOTOCARD': return 'photocard';
      case 'OPP & SLEEVE': return 'sleeve';
      case 'SPECIAL BENEFITS': return 'benefits';
      case 'GOODS SET': return 'set';
      default: return 'photocard';
    }
  };

  return (
    <section className="py-20 lg:py-28 bg-white border-b border-[#E8E3F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono font-bold tracking-widest text-[#8B6CF6] uppercase">
                PACKAGING ARCHIVE
              </span>
              <span className="text-[11px] font-mono text-[#777180] bg-[#F7F4FF] px-2 py-0.5 rounded border border-[#E8E3F0]">
                샘플 레퍼런스
              </span>
            </div>
            <h2 className="font-['Outfit',sans-serif] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#292532] tracking-tight mb-3">
              Details Make the Difference.
            </h2>
            <p className="text-base text-[#514078]">
              “다양한 굿즈 포장 스타일과 작업 과정을 살펴보세요.”
            </p>
          </div>

          <div className="text-xs text-[#777180] max-w-xs">
            * 실제 고객사 및 포장 실적은 보안 및 저작권 협의에 따라 샘플 예시 이미지로 표기됩니다.
          </div>
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F7F4FF] border border-[#E8E3F0] rounded-xl overflow-x-auto mb-10 w-full sm:w-auto self-start">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
                selectedCategory === cat
                  ? 'bg-white text-[#514078] shadow-xs font-semibold'
                  : 'text-[#777180] hover:text-[#292532]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Editorial Grid Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredItems.map((item) => {
            const visualType = getVisualType(item.category);
            return (
              <div
                key={item.id}
                onClick={() => setActiveModalItem(item)}
                className="group cursor-pointer bg-white border border-[#E8E3F0] hover:border-[#B8A1F7] rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-purple-950/5 flex flex-col"
              >
                {/* Visual Frame */}
                <div className="relative h-60 w-full overflow-hidden bg-[#F7F4FF]">
                  <BrandVisualGraphic
                    type={visualType}
                    className="w-full h-full"
                    alt={item.title}
                  />
                  {/* Sample Badge */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-mono text-[#514078] border border-[#E8E3F0]">
                    샘플 이미지
                  </div>
                  {/* Category Pill Tag Replacement -> Clean Top Right Label */}
                  <div className="absolute top-3 right-3 text-[10px] font-mono font-medium text-[#8B6CF6] bg-[#F7F4FF]/90 backdrop-blur-xs px-2 py-0.5 rounded border border-[#B8A1F7]/30">
                    {item.category}
                  </div>

                  {/* Hover Zoom Prompt */}
                  <div className="absolute inset-0 bg-[#514078]/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <div className="bg-white/90 text-[#292532] px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-md">
                      <Maximize2 className="w-3.5 h-3.5 text-[#8B6CF6]" />
                      <span>크게 보기</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#292532] group-hover:text-[#514078] transition-colors mb-1.5">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#777180] line-clamp-2 leading-relaxed mb-4">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#E8E3F0] flex items-center justify-between text-xs">
                    <span className="text-[#514078] font-medium truncate max-w-[200px]">
                      {item.packMethod}
                    </span>
                    <span className="text-[#8B6CF6] font-mono text-[11px] shrink-0">
                      DETAILS ↗
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Inspector for Full Image & Specifications */}
        {activeModalItem && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setActiveModalItem(null)}
          >
            <div
              className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#E8E3F0] animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 sm:p-6 border-b border-[#E8E3F0] flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-[#8B6CF6] uppercase block mb-1">
                    {activeModalItem.category} · SAMPLE ARCHIVE
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-[#292532]">
                    {activeModalItem.title}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveModalItem(null)}
                  className="p-2 text-[#777180] hover:text-[#292532] hover:bg-[#F7F4FF] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Visual Area */}
              <div className="h-72 sm:h-80 w-full bg-[#F7F4FF] relative border-b border-[#E8E3F0]">
                <BrandVisualGraphic
                  type={getVisualType(activeModalItem.category)}
                  className="w-full h-full"
                  alt={activeModalItem.title}
                />
                <div className="absolute bottom-3 left-3 bg-white/95 px-3 py-1 rounded text-xs font-mono text-[#514078] border border-[#E8E3F0]">
                  * 작업 예시용 스튜디오 샘플 그래픽
                </div>
              </div>

              {/* Modal Info Table */}
              <div className="p-6 space-y-4 text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-[#F7F4FF] rounded-xl text-xs border border-[#E8E3F0]">
                  <div>
                    <span className="text-[#777180] block mb-1 font-medium">굿즈 종류</span>
                    <span className="font-semibold text-[#292532]">{activeModalItem.goodsType}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[#777180] block mb-1 font-medium">포장 방식</span>
                    <span className="font-semibold text-[#514078]">{activeModalItem.packMethod}</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-[#777180] font-semibold block mb-1 uppercase">작업 설명</span>
                  <p className="text-[#292532] leading-relaxed">
                    {activeModalItem.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E8E3F0] flex items-center justify-between">
                  <span className="text-xs text-[#777180]">
                    비슷한 포장 방식으로 제작을 희망하시나요?
                  </span>
                  <button
                    onClick={() => {
                      setActiveModalItem(null);
                      onNavigate('quote');
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#8B6CF6] text-white rounded-lg text-xs font-semibold hover:bg-[#7854f3]"
                  >
                    <span>이 포장 견적 문의하기</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
