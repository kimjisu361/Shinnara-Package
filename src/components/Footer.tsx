import React, { useState } from 'react';
import { PageTab } from '../types';
import { BRAND_INFO } from '../data/content';
import { MapPin, Copy, Check, Navigation, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: PageTab) => void;
  onOpenGoogleSitesGuide: () => void;
  onOpenAssetManager: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenGoogleSitesGuide,
  onOpenAssetManager,
}) => {
  const [copiedAddress, setCopiedAddress] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(BRAND_INFO.business.addressJibun);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  return (
    <footer className="bg-white border-t border-[#E8E3F0] text-[#777180] text-xs py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          {/* Col 1: Brand Info & Business Registration (5 cols) */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-['Outfit',sans-serif] text-lg font-bold tracking-tight text-[#292532]">
                SINNARA PACKAGE
              </span>
              <span className="text-xs text-[#8B6CF6] font-medium">신나라패키지</span>
            </div>
            <p className="text-xs text-[#514078] leading-relaxed max-w-sm">
              LAVENDER GOODS PACKAGING STUDIO.
              아이돌 굿즈 및 포토카드, 앨범 특전 전용 포장 전문 스튜디오입니다.
              굿즈의 설렘과 아티스트의 품격을 지키는 깔끔하고 섬세한 포장 작업을 함께합니다.
            </p>

            {/* Business Registration & Studio Address Box */}
            <div className="pt-3 border-t border-[#E8E3F0] space-y-1.5 text-xs text-[#514078]">
              <div className="flex items-center gap-2">
                <span className="text-[#777180] font-medium shrink-0">사업자등록번호:</span>
                <span className="font-mono font-bold text-[#292532] bg-[#F7F4FF] px-2 py-0.5 rounded border border-[#E8E3F0]">
                  {BRAND_INFO.business.regNumber}
                </span>
              </div>
              <div className="flex items-start gap-1.5 pt-1">
                <MapPin className="w-3.5 h-3.5 text-[#8B6CF6] shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-medium text-[#292532] leading-snug">
                    {BRAND_INFO.business.addressJibun}
                  </div>
                  <div className="text-[11px] text-[#777180] mt-0.5">
                    (도로명) {BRAND_INFO.business.addressRoad}
                  </div>
                </div>
              </div>

              {/* Quick Action Buttons for Address */}
              <div className="pt-2 flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleCopyAddress}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F7F4FF] hover:bg-[#E9E1FF] text-[#514078] rounded text-[11px] font-medium border border-[#E8E3F0] transition-colors"
                >
                  {copiedAddress ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-[#8B6CF6]" />}
                  <span>{copiedAddress ? '주소 복사됨' : '주소 복사'}</span>
                </button>
                <button
                  onClick={() => onNavigate('location')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#8B6CF6]/10 hover:bg-[#8B6CF6]/20 text-[#514078] rounded text-[11px] font-semibold border border-[#B8A1F7]/40 transition-colors"
                >
                  <Navigation className="w-3 h-3 text-[#8B6CF6]" />
                  <span>찾아오는 길 안내 ↗</span>
                </button>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation Links (3 cols) */}
          <div className="md:col-span-3 space-y-2.5">
            <div className="text-xs font-mono font-bold text-[#292532] uppercase tracking-wider mb-2">
              PAGES
            </div>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-[#8B6CF6] transition-colors"
                >
                  HOME (메인)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-[#8B6CF6] transition-colors"
                >
                  포장 서비스 (Packaging Services)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('archive')}
                  className="hover:text-[#8B6CF6] transition-colors"
                >
                  작업 사례 (Packaging Archive)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('process')}
                  className="hover:text-[#8B6CF6] transition-colors"
                >
                  진행 안내 (How It Works)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('location')}
                  className="hover:text-[#8B6CF6] transition-colors font-medium text-[#514078] flex items-center gap-1"
                >
                  <span>찾아오는 길 (Location)</span>
                  <span className="text-[10px] text-[#8B6CF6] bg-[#F7F4FF] px-1.5 py-0.2 rounded border border-[#E8E3F0]">인천 부평</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('quote')}
                  className="hover:text-[#8B6CF6] transition-colors font-medium text-[#8B6CF6]"
                >
                  견적 문의 (Get a Quote) ↗
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Studio Operations & Guides (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <div className="text-xs font-mono font-bold text-[#292532] uppercase tracking-wider mb-2">
              STUDIO & INTEGRATION
            </div>
            <p className="text-xs leading-relaxed text-[#777180]">
              신나라패키지는 인천테크노밸리 U1 센터 스튜디오에서 대량 포토카드 및 굿즈 세트를 정성껏 포장합니다. 화물 하역 및 방문 상담은 사전 예약제로 진행됩니다.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                onClick={onOpenGoogleSitesGuide}
                className="px-3 py-2 bg-[#F7F4FF] hover:bg-[#E9E1FF] text-[#514078] rounded border border-[#E8E3F0] text-[11px] font-medium text-left transition-colors"
              >
                🌐 Google Sites 연동 안내서
              </button>
              <button
                onClick={onOpenAssetManager}
                className="px-3 py-2 bg-[#F7F4FF] hover:bg-[#E9E1FF] text-[#514078] rounded border border-[#E8E3F0] text-[11px] font-medium text-left transition-colors"
              >
                ⚙️ 로고 및 이미지 설정
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Hairline & Legal Strip */}
        <div className="pt-8 border-t border-[#E8E3F0] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#777180]">
          <div>
            © {new Date().getFullYear()} SINNARA PACKAGE (신나라패키지). All rights reserved.
            <span className="mx-2 text-[#E8E3F0]">|</span>
            <span>사업자등록번호: {BRAND_INFO.business.regNumber}</span>
          </div>
          <div className="flex items-center gap-4">
            <span>아이돌 굿즈 포장 전문 서비스</span>
            <span>·</span>
            <span>인천테크노밸리U1센터 제6층 D동 615호</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
