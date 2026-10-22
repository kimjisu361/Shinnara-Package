import React, { useState } from 'react';
import { BRAND_INFO } from '../data/content';
import { PageTab } from '../types';
import {
  MapPin,
  Copy,
  Check,
  ExternalLink,
  Navigation,
  Train,
  Car,
  Bus,
  PackageCheck,
  Building2,
  ArrowUpRight,
  ShieldCheck,
  PhoneCall
} from 'lucide-react';

interface LocationViewProps {
  onNavigate: (tab: PageTab) => void;
}

export const LocationView: React.FC<LocationViewProps> = ({ onNavigate }) => {
  const [copiedJibun, setCopiedJibun] = useState(false);
  const [copiedRoad, setCopiedRoad] = useState(false);

  const copyAddress = (address: string, type: 'jibun' | 'road') => {
    navigator.clipboard.writeText(address);
    if (type === 'jibun') {
      setCopiedJibun(true);
      setTimeout(() => setCopiedJibun(false), 2000);
    } else {
      setCopiedRoad(true);
      setTimeout(() => setCopiedRoad(false), 2000);
    }
  };

  return (
    <div className="py-12 sm:py-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Block */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F7F4FF] border border-[#B8A1F7]/40 rounded-md text-xs font-mono tracking-wider text-[#514078] mb-4">
            <MapPin className="w-3.5 h-3.5 text-[#8B6CF6]" />
            <span>STUDIO LOCATION & LOGISTICS</span>
          </div>
          <h1 className="font-['Outfit',sans-serif] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#292532] tracking-tight mb-4">
            신나라패키지 찾아오는 길
          </h1>
          <p className="text-base sm:text-lg text-[#514078] leading-relaxed">
            인천테크노밸리 U1 센터 6층 D동 615호에 위치한 전용 포장 스튜디오입니다.
            대량 굿즈 화물 하역과 방문 상담을 위한 최적의 물류 환경을 갖추고 있습니다.
          </p>
        </div>

        {/* Studio Address Card & Map Link Buttons */}
        <div className="bg-[#F7F4FF] border border-[#E8E3F0] rounded-2xl p-6 sm:p-8 mb-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Address Details (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-[#8B6CF6] uppercase tracking-wider font-semibold">
                <span>OFFICIAL ADDRESS & BUSINESS NUMBER</span>
              </div>

              {/* Jibun Address */}
              <div className="p-4 bg-white rounded-xl border border-[#E8E3F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-mono text-[#777180] block mb-1">지번 주소 (공식 등록)</span>
                  <div className="text-sm sm:text-base font-bold text-[#292532] tracking-tight">
                    {BRAND_INFO.business.addressJibun}
                  </div>
                </div>
                <button
                  onClick={() => copyAddress(BRAND_INFO.business.addressJibun, 'jibun')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F7F4FF] hover:bg-[#E9E1FF] text-[#514078] rounded-lg text-xs font-semibold border border-[#E8E3F0] transition-colors shrink-0 self-start sm:self-auto"
                >
                  {copiedJibun ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#8B6CF6]" />}
                  <span>{copiedJibun ? '지번 주소 복사됨' : '지번 주소 복사'}</span>
                </button>
              </div>

              {/* Road Name Address */}
              <div className="p-4 bg-white rounded-xl border border-[#E8E3F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-mono text-[#777180] block mb-1">도로명 주소 (내비게이션 및 택배)</span>
                  <div className="text-sm sm:text-base font-medium text-[#292532] tracking-tight">
                    {BRAND_INFO.business.addressRoad}
                  </div>
                </div>
                <button
                  onClick={() => copyAddress(BRAND_INFO.business.addressRoad, 'road')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F7F4FF] hover:bg-[#E9E1FF] text-[#514078] rounded-lg text-xs font-semibold border border-[#E8E3F0] transition-colors shrink-0 self-start sm:self-auto"
                >
                  {copiedRoad ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#8B6CF6]" />}
                  <span>{copiedRoad ? '도로명 주소 복사됨' : '도로명 주소 복사'}</span>
                </button>
              </div>

              {/* Business Registration */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#514078] pt-1">
                <div>
                  <span className="text-[#777180] font-medium mr-1.5">상호:</span>
                  <span className="font-semibold text-[#292532]">신나라패키지 (SINNARA PACKAGE)</span>
                </div>
                <div>
                  <span className="text-[#777180] font-medium mr-1.5">사업자등록번호:</span>
                  <span className="font-mono font-bold text-[#8B6CF6]">{BRAND_INFO.business.regNumber}</span>
                </div>
                <div>
                  <span className="text-[#777180] font-medium mr-1.5">우편번호:</span>
                  <span className="font-mono text-[#292532]">{BRAND_INFO.business.postalCode}</span>
                </div>
                <div>
                  <span className="text-[#777180] font-medium mr-1.5">상담전화:</span>
                  <a
                    href="tel:01045910334"
                    className="font-mono font-bold text-[#292532] hover:text-[#8B6CF6] hover:underline"
                    title="전화 걸기"
                  >
                    010-4591-0334
                  </a>
                </div>
                <div>
                  <span className="text-[#777180] font-medium mr-1.5">이메일:</span>
                  <a
                    href="mailto:ares361@naver.com?subject=%5B%EC%8B%A0%EB%82%98%EB%9D%BC%ED%8C%A8%ED%82%A4%EC%A7%80%5D%20%EA%B5%BF%EC%A6%88%20%ED%8F%AC%EC%9E%A5%20%EA%B2%AC%EC%A0%81%20%EB%AC%B8%EC%9D%98"
                    className="font-mono font-semibold text-[#514078] hover:text-[#8B6CF6] hover:underline"
                  >
                    ares361@naver.com
                  </a>
                </div>
              </div>
            </div>

            {/* Map Shortcut Actions (4 cols) */}
            <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-[#E8E3F0] flex flex-col justify-between gap-4">
              <div>
                <span className="text-xs font-mono text-[#8B6CF6] uppercase block mb-1">MAP NAVIGATION</span>
                <h2 className="text-base font-bold text-[#292532] mb-2">빠른 지도 바로가기</h2>
                <p className="text-xs text-[#777180] leading-relaxed mb-4">
                  네이버 지도와 카카오맵에서 신나라패키지의 정확한 위치와 실시간 길찾기 경로를 확인하실 수 있습니다.
                </p>
              </div>

              <div className="space-y-2">
                <a
                  href={BRAND_INFO.business.naverMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-between px-4 py-2.5 bg-[#03C75A] text-white rounded-lg text-xs font-bold hover:bg-[#02b350] transition-colors shadow-xs"
                >
                  <span className="flex items-center gap-1.5">
                    <span className="font-extrabold text-[13px]">N</span>
                    <span>네이버 지도에서 보기</span>
                  </span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a
                  href={BRAND_INFO.business.kakaoMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-between px-4 py-2.5 bg-[#FEE500] text-[#191919] rounded-lg text-xs font-bold hover:bg-[#ebd300] transition-colors shadow-xs"
                >
                  <span className="flex items-center gap-1.5">
                    <span className="font-extrabold text-[13px]">K</span>
                    <span>카카오맵에서 보기</span>
                  </span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Map & Floor Guide Diagram */}
        <div className="bg-white border border-[#E8E3F0] rounded-2xl overflow-hidden mb-16 shadow-xs">
          <div className="p-6 border-b border-[#E8E3F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F7F4FF]/50">
            <div>
              <span className="text-xs font-mono text-[#8B6CF6] uppercase font-semibold block mb-0.5">
                CAMPUS & STUDIO LAYOUT
              </span>
              <h2 className="text-lg font-bold text-[#292532]">
                인천테크노밸리 U1 센터 D동 진입 및 6층 안내
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#514078]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8B6CF6]" />
              <span className="font-medium">화물 하역 드라이브인 램프 연결</span>
            </div>
          </div>

          {/* Aesthetic Vector Map Representation */}
          <div className="p-6 sm:p-10 bg-gradient-to-b from-[#F7F4FF]/30 to-white">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Box 1: Bupyeong IC & Location */}
              <div className="p-5 rounded-xl border border-[#E8E3F0] bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-lg bg-[#E9E1FF] text-[#8B6CF6] flex items-center justify-center font-bold">
                    <Car className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono text-[#777180]">STEP 01</span>
                </div>
                <h3 className="text-sm font-bold text-[#292532]">부평IC & 갈산역 접근</h3>
                <p className="text-xs text-[#777180] leading-relaxed">
                  경인고속도로 부평IC에서 3분 거리입니다. 갈산역 방면에서 주부토로 대로변을 따라 인천테크노밸리 U1센터(대형 트윈 타워)로 진입합니다.
                </p>
              </div>

              {/* Box 2: D-Dong Entry */}
              <div className="p-5 rounded-xl border-2 border-[#B8A1F7]/60 bg-[#F7F4FF] space-y-3 relative">
                <div className="absolute top-3 right-3 text-[10px] font-mono bg-[#8B6CF6] text-white px-2 py-0.5 rounded font-semibold">
                  TARGET D-DONG
                </div>
                <div className="w-9 h-9 rounded-lg bg-[#8B6CF6] text-white flex items-center justify-center font-bold">
                  <Building2 className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#292532]">D동(제디동) 주차 및 승강기</h3>
                <p className="text-xs text-[#514078] leading-relaxed">
                  센터 내 A/B/C/D동 중 <strong>‘D동’</strong> 진입구로 진입합니다. 승객용 및 고용량 화물 엘리베이터가 바로 연결되어 굿즈 운반이 수월합니다.
                </p>
              </div>

              {/* Box 3: 6th Floor 615 Room */}
              <div className="p-5 rounded-xl border border-[#E8E3F0] bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-lg bg-[#E9E1FF] text-[#8B6CF6] flex items-center justify-center font-bold">
                    <PackageCheck className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono text-[#777180]">STEP 03</span>
                </div>
                <h3 className="text-sm font-bold text-[#292532]">제6층 제디동 615호 도착</h3>
                <p className="text-xs text-[#777180] leading-relaxed">
                  엘리베이터 하차 후 615호 ‘신나라패키지 굿즈 포장 스튜디오’ 도어벨을 누르시면 안전하게 입고 및 수령 상담을 도와드립니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Transportation Detailed Tabs/Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Public Transport - Subway */}
          <div className="p-6 rounded-2xl bg-[#F7F4FF] border border-[#E8E3F0] space-y-3">
            <div className="flex items-center gap-2 text-[#8B6CF6]">
              <Train className="w-5 h-5" />
              <h3 className="font-bold text-[#292532] text-base">지하철 이용 시</h3>
            </div>
            <div className="text-xs font-semibold text-[#514078]">
              인천 1호선 갈산역 2번 출구
            </div>
            <p className="text-xs text-[#777180] leading-relaxed">
              갈산역 2번 출구에서 도보 약 10~12분 거리입니다. (갈산사거리 방향 직진 후 주부토로 방면 이동). 버스 환승 시 1정거장 거리입니다.
            </p>
          </div>

          {/* Public Transport - Bus */}
          <div className="p-6 rounded-2xl bg-[#F7F4FF] border border-[#E8E3F0] space-y-3">
            <div className="flex items-center gap-2 text-[#8B6CF6]">
              <Bus className="w-5 h-5" />
              <h3 className="font-bold text-[#292532] text-base">버스 이용 시</h3>
            </div>
            <div className="text-xs font-semibold text-[#514078]">
              부평세관 / 인천테크노밸리 U1 센터 하차
            </div>
            <p className="text-xs text-[#777180] leading-relaxed">
              정류장 하차 후 도보 2분 내에 대형 지식산업센터 단지로 진입하실 수 있습니다. 간선/지선 다수 노선이 경유합니다.
            </p>
          </div>

          {/* Car & Parking */}
          <div className="p-6 rounded-2xl bg-[#F7F4FF] border border-[#E8E3F0] space-y-3">
            <div className="flex items-center gap-2 text-[#8B6CF6]">
              <Car className="w-5 h-5" />
              <h3 className="font-bold text-[#292532] text-base">자가용 및 화물차</h3>
            </div>
            <div className="text-xs font-semibold text-[#514078]">
              부평IC 진출 후 3분 / 넓은 주차 공간
            </div>
            <p className="text-xs text-[#777180] leading-relaxed">
              지하 및 지상 대형 주차장이 마련되어 있으며, 굿즈 화물 하역 차량은 6층 드라이브인 램프로 진입하여 편리하게 적재/하역할 수 있습니다.
            </p>
          </div>
        </div>

        {/* Goods Cargo Receiving & Delivery Guide for Clients */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border-2 border-[#B8A1F7]/40 shadow-sm mb-16">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#F7F4FF] border border-[#B8A1F7]/40 text-[#8B6CF6] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-mono text-[#8B6CF6] uppercase font-semibold">
                IDOL GOODS LOGISTICS PROTOCOL
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-[#292532]">
                굿즈 화물 택배 및 퀵 배송 입고 안내
              </h3>
              <p className="text-xs sm:text-sm text-[#777180] leading-relaxed">
                아이돌 포토카드, 앨범 특전 등 대량 굿즈를 택배나 화물 퀵(다마스/라보)으로 입고하실 경우, 물품 분실 및 오배송을 방지하기 위해 <strong>받는 사람 란에 [업체명 / 의뢰 건명 / 신나라패키지]</strong>를 정확하게 기재해 주시기 바랍니다.
              </p>
              <div className="pt-2 text-xs font-mono text-[#514078] bg-[#F7F4FF] p-3 rounded-lg border border-[#E8E3F0]">
                입고 수령 주소: 인천광역시 부평구 갈산동 94번지 인천테크노밸리유1센터 제6층 제디동615호 신나라패키지
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center pt-8 border-t border-[#E8E3F0] flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('quote')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#8B6CF6] text-white font-bold rounded-xl hover:bg-[#7854f3] transition-colors text-sm sm:text-base shadow-sm"
          >
            <span>포장 견적 및 작업 상담하기</span>
            <ArrowUpRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="w-full sm:w-auto px-6 py-4 bg-white border border-[#E8E3F0] text-[#514078] font-semibold rounded-xl hover:bg-[#F7F4FF] transition-colors text-sm"
          >
            홈으로 이동
          </button>
        </div>
      </div>
    </div>
  );
};
