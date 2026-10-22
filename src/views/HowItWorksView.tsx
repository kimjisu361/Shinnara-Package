import React from 'react';
import { PROCESS_STEPS } from '../data/content';
import { PageTab } from '../types';
import { ArrowUpRight, CheckCircle2, AlertTriangle, FileText, PackageCheck } from 'lucide-react';

interface HowItWorksViewProps {
  onNavigate: (tab: PageTab) => void;
}

export const HowItWorksView: React.FC<HowItWorksViewProps> = ({ onNavigate }) => {
  return (
    <div className="py-12 sm:py-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F7F4FF] border border-[#B8A1F7]/40 rounded-md text-xs font-mono tracking-wider text-[#514078] mb-4">
            HOW IT WORKS
          </div>
          <h1 className="font-['Outfit',sans-serif] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#292532] tracking-tight mb-4">
            포장 문의부터 작업 완료까지
          </h1>
          <p className="text-base sm:text-lg text-[#514078] leading-relaxed">
            신나라패키지는 정형화된 일방적 기준 대신, 고객사의 굿즈 특성과 릴리즈 일정에 최적화된 맞춤형 작업 단계를 진행합니다.
          </p>
        </div>

        {/* 4 Steps Detailed Breakdown */}
        <div className="space-y-6 mb-16">
          {PROCESS_STEPS.map((step) => (
            <div
              key={step.num}
              className="bg-white border border-[#E8E3F0] hover:border-[#B8A1F7] rounded-2xl p-6 sm:p-8 transition-all hover:shadow-md grid grid-cols-1 md:grid-cols-12 gap-6 items-start"
            >
              <div className="md:col-span-3 flex md:flex-col items-center md:items-start justify-between">
                <span className="text-4xl font-['Outfit',sans-serif] font-bold text-[#8B6CF6]">
                  {step.num}
                </span>
                <span className="text-xs font-mono tracking-wider text-[#777180] uppercase mt-2">
                  {step.enTitle}
                </span>
              </div>

              <div className="md:col-span-9 space-y-3">
                <h3 className="text-xl font-bold text-[#292532]">
                  {step.krTitle}
                </h3>
                <p className="text-sm font-semibold text-[#514078]">
                  {step.description}
                </p>
                <p className="text-sm text-[#777180] leading-relaxed">
                  {step.detailText}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Operational Checklist for Clients */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="p-6 sm:p-8 rounded-2xl bg-[#F7F4FF] border border-[#E8E3F0]">
            <div className="flex items-center gap-2 mb-4 text-[#8B6CF6]">
              <FileText className="w-5 h-5" />
              <h4 className="font-bold text-[#292532] text-base">
                문의 전 미리 준비하시면 빠른 상담이 가능한 항목
              </h4>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-[#514078]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8B6CF6] shrink-0 mt-0.5" />
                <span>굿즈 품목 및 예상 작업 수량 (예: 포토카드 2,000매)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8B6CF6] shrink-0 mt-0.5" />
                <span>굿즈의 가로×세로 실측 규격 및 두께</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8B6CF6] shrink-0 mt-0.5" />
                <span>포장 방식 (단순 OPP 봉투, 슬리브 이중 포장, 특전 봉투입 등)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8B6CF6] shrink-0 mt-0.5" />
                <span>포장재 준비 상태 (자체 지참 제공 또는 스튜디오 조달 필요 여부)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8B6CF6] shrink-0 mt-0.5" />
                <span>굿즈 입고 희망일 및 최종 납품 완료 희망일</span>
              </li>
            </ul>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E8E3F0]">
            <div className="flex items-center gap-2 mb-4 text-[#514078]">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h4 className="font-bold text-[#292532] text-base">
                정직한 운영 안내
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-[#777180] leading-relaxed mb-4">
              신나라패키지는 사실과 다른 임의의 최저 견적, 무조건적인 단납기 확답, 혹은 비현실적인 무료 옵션을 내세우지 않습니다.
            </p>
            <p className="text-xs sm:text-sm text-[#777180] leading-relaxed">
              아이돌 굿즈의 특성상 인쇄 품질과 민감한 표면 보호가 최우선이므로, 실제 샘플 확인 및 정확한 공정 산출을 거쳐 신뢰할 수 있는 단가와 일정을 제안해 드립니다.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-8 border-t border-[#E8E3F0]">
          <button
            onClick={() => onNavigate('quote')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#8B6CF6] text-white font-bold rounded-xl hover:bg-[#7854f3] transition-colors text-sm sm:text-base shadow-sm"
          >
            <span>상담 견적서 작성하기</span>
            <ArrowUpRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
