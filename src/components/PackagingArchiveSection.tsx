import React, { useState, useEffect } from 'react';
import { ARCHIVE_SAMPLES } from '../data/content';
import { ArchiveItem, PageTab } from '../types';
import { ArrowUpRight, Maximize2, X, PackageSearch, AlertCircle, Info, RefreshCw } from 'lucide-react';
import { BrandVisualGraphic } from './BrandVisualGraphic';
import { fetchPublicPortfolio, mapPortfolioToArchiveItem } from '../lib/portfolioService';

interface PackagingArchiveSectionProps {
  onNavigate: (tab: PageTab) => void;
}

type ArchiveStatus = 'loading' | 'published' | 'empty' | 'fallback';

export const PackagingArchiveSection: React.FC<PackagingArchiveSectionProps> = ({ onNavigate }) => {
  const [status, setStatus] = useState<ArchiveStatus>('loading');
  const [items, setItems] = useState<ArchiveItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeModalItem, setActiveModalItem] = useState<ArchiveItem | null>(null);

  // Fetch published & non-deleted portfolio from Firestore with strict distinction:
  // - []  => Genuine empty: no published items, do NOT show fake/static samples.
  // - null => Query failure/Firebase unconfigured: Fallback mode with explicit sample disclaimer.
  // - [...] => Published items: Render real customer/portfolio items.
  useEffect(() => {
    let isMounted = true;

    const loadItems = async () => {
      try {
        const publicDocs = await fetchPublicPortfolio();
        if (!isMounted) return;

        if (publicDocs === null) {
          // Failure or unconfigured state: Fallback with clear disclaimer
          setItems(ARCHIVE_SAMPLES);
          setStatus('fallback');
        } else if (publicDocs.length === 0) {
          // Normal successful query but 0 published items: Genuine empty state
          setItems([]);
          setStatus('empty');
        } else {
          // Successful query with published items
          setItems(publicDocs.map(mapPortfolioToArchiveItem));
          setStatus('published');
        }
      } catch {
        if (isMounted) {
          setItems(ARCHIVE_SAMPLES);
          setStatus('fallback');
        }
      }
    };

    loadItems();
    return () => {
      isMounted = false;
    };
  }, []);

  const categories = ['ALL', 'PHOTOCARD', 'OPP & SLEEVE', 'SPECIAL BENEFITS', 'GOODS SET'];

  const filteredItems = selectedCategory === 'ALL'
    ? items
    : items.filter(item => item.category === selectedCategory);

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
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono font-bold tracking-widest text-[#8B6CF6] uppercase">
                PACKAGING ARCHIVE
              </span>
              <span className="text-[11px] font-mono text-[#777180] bg-[#F7F4FF] px-2 py-0.5 rounded border border-[#E8E3F0]">
                {status === 'published' ? '실제 작업 사례' : status === 'fallback' ? '규격 예시 안내' : '작업 사례'}
              </span>
            </div>
            <h2 className="font-['Outfit',sans-serif] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#292532] tracking-tight mb-3">
              Details Make the Difference.
            </h2>
            <p className="text-base text-[#514078]">
              “다양한 굿즈 포장 스타일과 작업 과정을 살펴보세요.”
            </p>
          </div>

          {status === 'published' && (
            <div className="text-xs text-[#777180] max-w-xs">
              * 고객사 보안 및 저작권 기준을 준수하여 정식 등록된 실제 작업 사례입니다.
            </div>
          )}
        </div>

        {/* State: Loading */}
        {status === 'loading' && (
          <div className="py-16 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-[#514078] mb-8">
              <RefreshCw className="w-4 h-4 animate-spin text-[#8B6CF6]" />
              <span>작업 사례를 불러오는 중입니다...</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-[#F7F4FF]/60 border border-[#E8E3F0] rounded-xl h-80 animate-pulse" />
              ))}
            </div>
          </div>
        )}

        {/* State: Normal Empty (Query succeeded, 0 published items) */}
        {status === 'empty' && (
          <div className="bg-[#F7F4FF] border border-[#E8E3F0] rounded-2xl p-8 sm:p-14 text-center max-w-2xl mx-auto my-6 shadow-xs">
            <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-2xl border border-[#B8A1F7]/40 flex items-center justify-center text-[#8B6CF6] shadow-xs">
              <PackageSearch className="w-8 h-8" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#E8E3F0] rounded-full text-xs font-mono text-[#514078] mb-3">
              안내: 등록된 공개 사례 없음
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#292532] mb-3">
              등록된 공개 작업 사례가 없습니다
            </h3>
            <p className="text-sm text-[#514078] leading-relaxed max-w-md mx-auto mb-6">
              현재 새로운 고객 작업 사례를 선별하여 등록 준비 중입니다. 신나라패키지의 포토카드, OPP 봉투, 특전 세트 등 맞춤 포장 작업 견적은 언제든 직접 문의해 주세요.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => onNavigate('quote')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#8B6CF6] text-white rounded-xl text-sm font-semibold hover:bg-[#7854f3] transition-colors shadow-sm"
              >
                <span>맞춤 포장 견적 문의하기</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-[#777180] mt-6">
              전화 상담: <span className="font-semibold text-[#292532]">010-4591-0334</span> · 카카오톡 채널 실시간 상담 가능
            </p>
          </div>
        )}

        {/* State: Fallback Notice (Query failed / Firebase not configured) */}
        {status === 'fallback' && (
          <div className="mb-8 p-4 sm:p-5 bg-amber-50/90 border border-amber-200 rounded-xl flex items-start gap-3.5 text-amber-900 shadow-xs">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm leading-relaxed">
              <div className="font-bold text-amber-950 mb-1 flex flex-wrap items-center gap-2">
                <span>포장 규격 참고용 예시 안내 (시스템 연결 안내)</span>
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 bg-amber-100 text-amber-800 rounded border border-amber-300">
                  REFERENCE SAMPLES
                </span>
              </div>
              <p className="text-amber-800">
                현재 작업 사례 조회 서버를 연결 중이거나 점검 중입니다. 실제 사례가 없는 것이 아니며, 방문 고객님의 포장 규격 이해를 돕기 위해 아래에는 <span className="font-semibold underline underline-offset-2">표준 제작 규격 예시 데이터(참고용 샘플)</span>를 표시하고 있습니다.
              </p>
            </div>
          </div>
        )}

        {/* Gallery Section for 'published' or 'fallback' */}
        {(status === 'published' || status === 'fallback') && (
          <>
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

            {/* Filtered Empty Notice */}
            {filteredItems.length === 0 ? (
              <div className="py-16 text-center bg-[#F7F4FF]/50 border border-dashed border-[#E8E3F0] rounded-xl p-8">
                <Info className="w-8 h-8 text-[#8B6CF6] mx-auto mb-2 opacity-60" />
                <p className="text-sm font-semibold text-[#292532] mb-1">
                  선택하신 카테고리에 등록된 사례가 없습니다.
                </p>
                <p className="text-xs text-[#777180] mb-4">
                  다른 카테고리를 선택하시거나 전체 목록을 확인해 보세요.
                </p>
                <button
                  onClick={() => setSelectedCategory('ALL')}
                  className="px-4 py-2 bg-white border border-[#E8E3F0] rounded-lg text-xs font-medium text-[#514078] hover:bg-[#F7F4FF]"
                >
                  전체 카테고리 보기
                </button>
              </div>
            ) : (
              /* Editorial Grid Gallery */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredItems.map((item) => {
                  const visualType = getVisualType(item.category);
                  const isFallbackSample = status === 'fallback';

                  return (
                    <div
                      key={item.id}
                      onClick={() => setActiveModalItem(item)}
                      className="group cursor-pointer bg-white border border-[#E8E3F0] hover:border-[#B8A1F7] rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-purple-950/5 flex flex-col"
                    >
                      {/* Visual Frame */}
                      <div className="relative h-60 w-full overflow-hidden bg-[#F7F4FF]">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              (e.currentTarget as HTMLElement).style.display = 'none';
                              const fallback = e.currentTarget.parentElement?.querySelector('.fallback-box') as HTMLElement;
                              if (fallback) fallback.style.display = 'block';
                            }}
                          />
                        ) : null}

                        <div className={`w-full h-full fallback-box ${item.imageUrl ? 'hidden' : 'block'}`}>
                          <BrandVisualGraphic
                            type={visualType}
                            className="w-full h-full"
                            alt={item.title}
                          />
                        </div>

                        {/* Top-Left Badge: Explicitly distinguishes real vs sample */}
                        <div
                          className={`absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-mono border backdrop-blur-xs ${
                            isFallbackSample
                              ? 'bg-amber-100/90 text-amber-900 border-amber-300'
                              : item.imageUrl
                              ? 'bg-white/90 text-[#514078] border-[#E8E3F0]'
                              : 'bg-white/90 text-[#8B6CF6] border-[#B8A1F7]/40'
                          }`}
                        >
                          {isFallbackSample
                            ? '제작 규격 예시 (참고용)'
                            : item.imageUrl
                            ? '작업 사진'
                            : '등록 작업 사례'}
                        </div>

                        {/* Category Label */}
                        <div className="absolute top-3 right-3 text-[10px] font-mono font-medium text-[#8B6CF6] bg-[#F7F4FF]/90 backdrop-blur-xs px-2 py-0.5 rounded border border-[#B8A1F7]/30">
                          {item.category}
                        </div>

                        {/* Hover Zoom Prompt */}
                        <div className="absolute inset-0 bg-[#514078]/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <div className="bg-white/90 text-[#292532] px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-md">
                            <Maximize2 className="w-3.5 h-3.5 text-[#8B6CF6]" />
                            <span>상세 보기</span>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <h3 className="text-base font-bold text-[#292532] group-hover:text-[#514078] transition-colors">
                              {item.title}
                            </h3>
                          </div>
                          <p className="text-xs text-[#777180] line-clamp-2 leading-relaxed mb-4">
                            {item.description}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-[#E8E3F0] flex items-center justify-between text-xs">
                          <span className="text-[#514078] font-medium truncate max-w-[200px]">
                            {item.packMethod || item.goodsType}
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
            )}
          </>
        )}

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
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-[#8B6CF6] uppercase">
                      {activeModalItem.category}
                    </span>
                    {status === 'fallback' ? (
                      <span className="text-[10px] font-mono font-medium px-2 py-0.2 bg-amber-100 text-amber-800 rounded border border-amber-300">
                        예시 규격 샘플
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono font-medium px-2 py-0.2 bg-[#F7F4FF] text-[#514078] rounded border border-[#E8E3F0]">
                        등록 작업 사례
                      </span>
                    )}
                  </div>
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
              <div className="h-72 sm:h-80 w-full bg-[#F7F4FF] relative border-b border-[#E8E3F0] flex items-center justify-center overflow-hidden">
                {activeModalItem.imageUrl ? (
                  <img
                    src={activeModalItem.imageUrl}
                    alt={activeModalItem.title}
                    className="w-full h-full object-contain bg-[#1F1B2C]"
                  />
                ) : (
                  <BrandVisualGraphic
                    type={getVisualType(activeModalItem.category)}
                    className="w-full h-full"
                    alt={activeModalItem.title}
                  />
                )}
                <div
                  className={`absolute bottom-3 left-3 px-3 py-1 rounded text-xs font-mono border backdrop-blur-xs ${
                    status === 'fallback'
                      ? 'bg-amber-100/95 text-amber-900 border-amber-300'
                      : activeModalItem.imageUrl
                      ? 'bg-white/95 text-[#514078] border-[#E8E3F0]'
                      : 'bg-white/95 text-[#8B6CF6] border-[#B8A1F7]/40'
                  }`}
                >
                  {status === 'fallback'
                    ? '※ 제작 규격 안내용 스튜디오 샘플 (Reference)'
                    : activeModalItem.imageUrl
                    ? '실제 작업 포장 사진'
                    : '신나라패키지 등록 작업 사례'}
                </div>
              </div>

              {/* Modal Info Table */}
              <div className="p-6 space-y-4 text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-[#F7F4FF] rounded-xl text-xs border border-[#E8E3F0]">
                  <div>
                    <span className="text-[#777180] block mb-1 font-medium">굿즈 종류</span>
                    <span className="font-semibold text-[#292532]">{activeModalItem.goodsType || '-'}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[#777180] block mb-1 font-medium">포장 방식</span>
                    <span className="font-semibold text-[#514078]">{activeModalItem.packMethod || '-'}</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-[#777180] font-semibold block mb-1 uppercase">작업 설명</span>
                  <p className="text-[#292532] leading-relaxed">
                    {activeModalItem.description}
                  </p>
                </div>

                {status === 'fallback' && (
                  <div className="text-xs text-amber-800 bg-amber-50 p-3 rounded-lg border border-amber-200">
                    ※ 본 사양은 실제 고객 납품 사례가 아닌, 신나라패키지의 대표적인 포장 규격 및 방식을 안내하기 위한 예시 데이터(Sample)입니다.
                  </div>
                )}

                <div className="pt-4 border-t border-[#E8E3F0] flex items-center justify-between">
                  <span className="text-xs text-[#777180]">
                    비슷한 포장 방식으로 제작을 희망하시나요?
                  </span>
                  <button
                    onClick={() => {
                      setActiveModalItem(null);
                      onNavigate('quote');
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#8B6CF6] text-white rounded-lg text-xs font-semibold hover:bg-[#7854f3] transition-colors"
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
