import React, { useState } from 'react';
import { BRAND_INFO } from '../data/content';
import { PageTab } from '../types';
import { MapPin, Copy, Check, Navigation, ExternalLink, Building2, Train } from 'lucide-react';

interface LocationStripProps {
  onNavigate: (tab: PageTab) => void;
}

export const LocationStrip: React.FC<LocationStripProps> = ({ onNavigate }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(BRAND_INFO.business.addressJibun);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-[#E8E3F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F7F4FF] border border-[#E8E3F0] rounded-2xl p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left info (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#B8A1F7]/40 rounded-md text-xs font-mono tracking-wider text-[#514078]">
                <MapPin className="w-3.5 h-3.5 text-[#8B6CF6]" />
                <span>STUDIO LOCATION · 찾아오는 길</span>
              </div>

              <h2 className="font-['Outfit',sans-serif] text-2xl sm:text-3xl font-bold text-[#292532] tracking-tight">
                인천테크노밸리 U1 센터 포장 스튜디오
              </h2>

              <p className="text-sm text-[#514078] leading-relaxed">
                신나라패키지는 수도권 및 전국 각지에서 입고되는 대량 굿즈 화물 하역과 포장 공정을 신속하고 안전하게 수행하기 위해 인천테크노밸리 U1 센터에 전용 작업실을 두고 있습니다.
              </p>

              {/* Address & Business Reg Box */}
              <div className="pt-2 space-y-2 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-[#292532]">
                  <span className="font-bold text-[#514078] shrink-0">사업장 주소:</span>
                  <span className="font-medium">{BRAND_INFO.business.addressJibun}</span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-[#777180]">
                  <div>
                    <span className="text-[#514078] font-medium mr-1">사업자등록번호:</span>
                    <span className="font-mono font-bold text-[#8B6CF6]">{BRAND_INFO.business.regNumber}</span>
                  </div>
                  <div>
                    <span className="text-[#514078] font-medium mr-1">지하철:</span>
                    <span>인천 1호선 갈산역 2번 출구</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 flex flex-wrap items-center gap-3">
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-[#E9E1FF] text-[#514078] rounded-lg text-xs font-semibold border border-[#E8E3F0] transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#8B6CF6]" />}
                  <span>{copied ? '주소 복사 완료' : '주소 복사하기'}</span>
                </button>
                <button
                  onClick={() => onNavigate('location')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#8B6CF6] text-white hover:bg-[#7854f3] rounded-lg text-xs font-semibold shadow-xs transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>상세 교통 및 화물 입고 안내</span>
                </button>
              </div>
            </div>

            {/* Right Mini Card (5 cols) */}
            <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-[#E8E3F0] space-y-4">
              <div className="flex items-center justify-between border-b border-[#E8E3F0] pb-3">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#8B6CF6]" />
                  <span className="text-xs font-bold text-[#292532]">D동 6층 615호</span>
                </div>
                <span className="text-[10px] font-mono text-[#8B6CF6] bg-[#F7F4FF] px-2 py-0.5 rounded border border-[#E8E3F0]">
                  화물 엘리베이터 완비
                </span>
              </div>

              <div className="space-y-2 text-xs text-[#777180]">
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-[#514078] shrink-0">화물 하역:</span>
                  <span>지상 6층 드라이브인 직진입으로 대량 화물 및 다마스/라보 편리한 하역</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-[#514078] shrink-0">방문 상담:</span>
                  <span>포장 견적 및 굿즈 샘플 대조 미팅은 사전 예약제로 운영됩니다.</span>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <a
                  href={BRAND_INFO.business.naverMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center py-2 bg-[#03C75A]/10 hover:bg-[#03C75A]/20 text-[#03C75A] rounded-lg text-xs font-bold border border-[#03C75A]/20 transition-colors"
                >
                  네이버 지도 ↗
                </a>
                <a
                  href={BRAND_INFO.business.kakaoMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center py-2 bg-[#FEE500]/30 hover:bg-[#FEE500]/50 text-[#3C1E1E] rounded-lg text-xs font-bold border border-[#FEE500]/60 transition-colors"
                >
                  카카오맵 ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
