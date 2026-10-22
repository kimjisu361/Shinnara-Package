import React, { useState } from 'react';
import { PageTab, CustomAssets } from '../types';
import { ArrowUpRight, Menu, X, Sparkles, SlidersHorizontal } from 'lucide-react';

interface HeaderProps {
  currentTab: PageTab;
  onSelectTab: (tab: PageTab) => void;
  customAssets: CustomAssets;
  onOpenAssetManager: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  customAssets,
  onOpenAssetManager,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: PageTab; labelKr: string; labelEn: string }[] = [
    { id: 'home', labelKr: 'HOME', labelEn: 'HOME' },
    { id: 'services', labelKr: '포장 서비스', labelEn: 'SERVICES' },
    { id: 'archive', labelKr: '작업 사례', labelEn: 'ARCHIVE' },
    { id: 'process', labelKr: '진행 안내', labelEn: 'HOW IT WORKS' },
    { id: 'location', labelKr: '찾아오는 길', labelEn: 'LOCATION' },
    { id: 'quote', labelKr: '견적 문의', labelEn: 'GET A QUOTE' },
  ];

  const handleNavClick = (tab: PageTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-[#E8E3F0] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark & Mascot Lockup */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
            aria-label="신나라패키지 홈으로 이동"
          >
            {/* White Puppy Character / Mascot Icon (Restrained & Tasteful) */}
            {customAssets.puppyImage ? (
              <img
                src={customAssets.puppyImage}
                alt="신나라패키지 캐릭터"
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full object-cover border border-[#B8A1F7]/40 shadow-xs"
              />
            ) : (
              <div
                className="w-8 h-8 rounded-full bg-[#F7F4FF] border border-[#B8A1F7]/50 flex items-center justify-center text-[#8B6CF6] shadow-xs group-hover:scale-105 transition-transform"
                title="신나라패키지 마스코트"
              >
                {/* Minimalist white puppy vector icon */}
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  {/* Puppy head & floppy ears */}
                  <path
                    d="M10 5.122A7 7 0 0 0 4 12c0 2.21 1.02 4.19 2.62 5.5.38.31.63.78.63 1.28V19a2 2 0 0 0 2 2h5.5a2 2 0 0 0 2-2v-.22c0-.5.25-.97.63-1.28A6.993 6.993 0 0 0 20 12c0-3.87-3.13-7-7-7a6.96 6.96 0 0 0-3 1.122Z"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Nose & face details */}
                  <ellipse cx="12" cy="14" rx="1.5" ry="1.2" fill="#514078" />
                  <path d="M11 16c.3.3.7.5 1 .5s.7-.2 1-.5" strokeWidth="1.4" strokeLinecap="round" />
                  <circle cx="9" cy="11.5" r="1" fill="#514078" />
                  <circle cx="15" cy="11.5" r="1" fill="#514078" />
                  {/* Cute subtle lavender ear tip */}
                  <path d="M5 8c-1-1-2.5 0-2 2" stroke="#B8A1F7" strokeWidth="1.6" strokeLinecap="round" />
                  <path d="M19 8c1-1 2.5 0 2 2" stroke="#B8A1F7" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </div>
            )}

            {/* Wordmark */}
            {customAssets.logoImage ? (
              <img
                src={customAssets.logoImage}
                alt="SINNARA PACKAGE"
                referrerPolicy="no-referrer"
                className="h-7 w-auto object-contain"
              />
            ) : (
              <div className="flex flex-col">
                <span className="font-['Outfit',sans-serif] text-base sm:text-lg font-bold tracking-tight text-[#292532] group-hover:text-[#8B6CF6] transition-colors whitespace-nowrap">
                  SINNARA PACKAGE
                </span>
                <span className="text-[10px] font-medium tracking-wider text-[#777180] -mt-0.5 whitespace-nowrap">
                  신나라패키지
                </span>
              </div>
            )}
          </button>
        </div>

        {/* Zone 2: Navigation Links (Single-Line, Desktop) */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-8 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`whitespace-nowrap transition-all duration-200 relative py-1 focus:outline-none ${
                  isActive
                    ? 'text-[#514078] font-semibold'
                    : 'text-[#777180] hover:text-[#292532]'
                }`}
              >
                <span>{item.labelKr}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#8B6CF6] rounded-full animate-in fade-in" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action & Asset Utility */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Quick asset customizer button */}
          <button
            onClick={onOpenAssetManager}
            className="p-2 text-[#777180] hover:text-[#514078] hover:bg-[#F7F4FF] rounded-lg transition-colors text-xs flex items-center gap-1.5 focus:outline-none"
            title="로고 / 이미지 커스텀 관리"
            aria-label="로고 및 이미지 설정"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#8B6CF6]" />
            <span className="hidden xl:inline text-xs font-medium">스튜디오 설정</span>
          </button>

          {/* Standout Lavender CTA Button */}
          <button
            onClick={() => handleNavClick('quote')}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#8B6CF6] hover:bg-[#7854f3] active:bg-[#6842e4] rounded-lg shadow-sm hover:shadow transition-all whitespace-nowrap shrink-0 group focus:outline-none focus:ring-2 focus:ring-[#8B6CF6]/40"
          >
            <span>GET A QUOTE</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>

          {/* Mobile hamburger trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#292532] hover:bg-[#F7F4FF] rounded-lg focus:outline-none"
            aria-label="메뉴 열기/닫기"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/98 border-b border-[#E8E3F0] px-4 pt-3 pb-6 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center justify-between px-3 py-3 rounded-lg text-left text-sm font-medium transition-colors ${
                  currentTab === item.id
                    ? 'bg-[#F7F4FF] text-[#8B6CF6] font-semibold'
                    : 'text-[#292532] hover:bg-slate-50'
                }`}
              >
                <span>{item.labelKr}</span>
                <span className="text-[11px] font-mono text-[#777180]">{item.labelEn}</span>
              </button>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-[#E8E3F0] flex flex-col gap-2">
            <button
              onClick={() => {
                handleNavClick('quote');
              }}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#8B6CF6] text-white rounded-lg font-medium text-sm shadow-sm"
            >
              <span>견적 문의하기</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAssetManager();
              }}
              className="w-full py-2.5 text-xs text-[#777180] hover:text-[#514078] flex items-center justify-center gap-1.5"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#8B6CF6]" />
              <span>로고 및 사진 커스텀 관리</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
