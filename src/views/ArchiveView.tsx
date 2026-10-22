import React, { useState } from 'react';
import { ARCHIVE_SAMPLES } from '../data/content';
import { ArchiveItem, PageTab } from '../types';
import { Maximize2, X, ArrowUpRight, Info } from 'lucide-react';
import { BrandVisualGraphic } from '../components/BrandVisualGraphic';

interface ArchiveViewProps {
  onNavigate: (tab: PageTab) => void;
}

export const ArchiveView: React.FC<ArchiveViewProps> = ({ onNavigate }) => {
  const [selectedCat, setSelectedCat] = useState<string>('ALL');
  const [activeModalItem, setActiveModalItem] = useState<ArchiveItem | null>(null);

  const categories = ['ALL', 'PHOTOCARD', 'OPP & SLEEVE', 'SPECIAL BENEFITS', 'GOODS SET'];

  const filtered = selectedCat === 'ALL'
    ? ARCHIVE_SAMPLES
    : ARCHIVE_SAMPLES.filter(item => item.category === selectedCat);

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
    <div className="py-12 sm:py-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F7F4FF] border border-[#B8A1F7]/40 rounded-md text-xs font-mono tracking-wider text-[#514078] mb-4">
            PACKAGING ARCHIVE
          </div>
          <h1 className="font-['Outfit',sans-serif] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#292532] tracking-tight mb-4">
            작업 사례 아카이브
          </h1>
          <p className="text-base sm:text-lg text-[#514078] leading-relaxed">
            “신나라패키지의 굿즈 포장 스타일을 확인해 보세요.”
          </p>
        </div>

        {/* Disclaimer per brief: No fake clients/stats, clear sample mark */}
        <div className="mb-10 p-4 bg-[#F7F4FF] rounded-xl border border-[#E8E3F0] flex items-start gap-3">
          <Info className="w-5 h-5 text-[#8B6CF6] shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-[#514078] leading-relaxed">
            <span className="font-bold text-[#292532]">예시 레퍼런스 안내:</span> 수록된 이미지와 구성은 신나라패키지의 대표적인 포장 방식(OPP 규격, 탑로더 실링, 특전 봉투 등)을 보여드리기 위한 스튜디오 샘플입니다. 실제 프로젝트의 납품 실적이나 브랜드 상표는 고객사 정보 보호를 위해 임의 공개하지 않습니다.
          </p>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCat(c)}
              className={`px-4 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                selectedCat === c
                  ? 'bg-[#8B6CF6] text-white shadow-xs'
                  : 'bg-[#F7F4FF] text-[#514078] hover:bg-[#E9E1FF]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveModalItem(item)}
              className="group cursor-pointer bg-white border border-[#E8E3F0] hover:border-[#B8A1F7] rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col"
            >
              {/* Image Preview */}
              <div className="relative h-64 w-full overflow-hidden bg-[#F7F4FF]">
                <BrandVisualGraphic
                  type={getVisualType(item.category)}
                  className="w-full h-full"
                  alt={item.title}
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-0.5 rounded text-[10px] font-mono text-[#514078] border border-[#E8E3F0]">
                  예시 이미지
                </div>
                <div className="absolute top-3 right-3 text-[10px] font-mono text-[#8B6CF6] bg-[#F7F4FF]/90 px-2 py-0.5 rounded border border-[#B8A1F7]/30">
                  {item.category}
                </div>

                <div className="absolute inset-0 bg-[#514078]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-white/95 text-[#292532] px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md">
                    <Maximize2 className="w-4 h-4 text-[#8B6CF6]" />
                    <span>상세 보기</span>
                  </div>
                </div>
              </div>

              {/* Text Info */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#292532] group-hover:text-[#514078] transition-colors mb-2">
                    {item.title}
                  </h3>
                  <div className="space-y-1 text-xs text-[#777180] mb-4">
                    <div>
                      <span className="text-[#514078] font-medium">굿즈 종류:</span> {item.goodsType}
                    </div>
                    <div>
                      <span className="text-[#514078] font-medium">포장 방식:</span> {item.packMethod}
                    </div>
                  </div>
                  <p className="text-xs text-[#777180] line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#E8E3F0] flex items-center justify-between text-xs text-[#8B6CF6] font-medium">
                  <span>SPECIFICATION</span>
                  <span className="flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>확인하기</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Inspector */}
        {activeModalItem && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setActiveModalItem(null)}
          >
            <div
              className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#E8E3F0] animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 border-b border-[#E8E3F0] flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-[#8B6CF6] uppercase block">
                    {activeModalItem.category}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-[#292532]">
                    {activeModalItem.title}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveModalItem(null)}
                  className="p-2 text-[#777180] hover:text-[#292532] hover:bg-[#F7F4FF] rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="h-72 w-full bg-[#F7F4FF] relative border-b border-[#E8E3F0]">
                <BrandVisualGraphic
                  type={getVisualType(activeModalItem.category)}
                  className="w-full h-full"
                  alt={activeModalItem.title}
                />
                <div className="absolute top-3 left-3 bg-white/95 px-2.5 py-1 rounded text-xs font-mono text-[#514078] border border-[#E8E3F0]">
                  예시 이미지 (Sample)
                </div>
              </div>

              <div className="p-6 space-y-4 text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#F7F4FF] rounded-xl text-xs border border-[#E8E3F0]">
                  <div>
                    <span className="text-[#777180] block font-medium mb-1">굿즈 종류</span>
                    <span className="font-semibold text-[#292532]">{activeModalItem.goodsType}</span>
                  </div>
                  <div>
                    <span className="text-[#777180] block font-medium mb-1">포장 방식</span>
                    <span className="font-semibold text-[#514078]">{activeModalItem.packMethod}</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-[#777180] font-semibold block mb-1">작업 설명</span>
                  <p className="text-sm text-[#292532] leading-relaxed">
                    {activeModalItem.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E8E3F0] flex items-center justify-between">
                  <span className="text-xs text-[#777180]">
                    이 포장 스타일로 견적 협의가 필요하신가요?
                  </span>
                  <button
                    onClick={() => {
                      setActiveModalItem(null);
                      onNavigate('quote');
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#8B6CF6] text-white rounded-lg text-xs font-semibold hover:bg-[#7854f3]"
                  >
                    <span>견적 문의하기</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
