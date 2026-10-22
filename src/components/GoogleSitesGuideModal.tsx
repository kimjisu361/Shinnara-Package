import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, Code2 } from 'lucide-react';

interface GoogleSitesGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleSitesGuideModal: React.FC<GoogleSitesGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://sinnarapackage.com';
  const embedCode = `<iframe 
  src="${currentUrl}" 
  width="100%" 
  height="900" 
  style="border:none; border-radius:12px; overflow:hidden;"
  allow="clipboard-write"
></iframe>`;

  const copyToClipboard = (text: string, type: 'code' | 'url') => {
    navigator.clipboard.writeText(text);
    if (type === 'code') {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#E8E3F0] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-[#E8E3F0] flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#514078]">
            <Code2 className="w-5 h-5 text-[#8B6CF6]" />
            <h3 className="font-bold text-base text-[#292532]">
              Google Sites 연동 및 이전 적용 가이드
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-[#F7F4FF] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-xs sm:text-sm max-h-[80vh] overflow-y-auto">
          <div className="p-4 rounded-xl bg-[#F7F4FF] border border-[#E8E3F0] text-xs leading-relaxed text-[#514078]">
            <span className="font-bold text-[#292532]">적용 전 유의사항:</span> Google AI Studio의 고성능 React 웹앱과 Google Sites(구글 사이트 도구)는 내부 엔진이 다르므로, 소스 코드를 파일 복사 형태로 붙여넣기보다는 아래의 <strong>‘임베드(Embed) 방식’</strong>이나 <strong>‘도메인 직접 연결’</strong> 방식을 사용하셔야 고유한 라벤더 디자인과 인터랙션이 100% 동일하게 유지됩니다.
          </div>

          {/* Step 1 */}
          <div className="space-y-2">
            <h4 className="font-bold text-[#292532] text-sm flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#8B6CF6] text-white text-[11px] font-mono flex items-center justify-center">1</span>
              <span>방법 1: Google Sites에 웹사이트 전체 임베드하기 (가장 추천)</span>
            </h4>
            <ol className="list-decimal list-inside space-y-1.5 text-xs text-[#777180] pl-2">
              <li>Google Sites(구글 사이트 도구) 편집 화면을 엽니다.</li>
              <li>우측 메뉴에서 <strong>[삽입] &gt; [임베드 (Embed)]</strong>를 클릭합니다.</li>
              <li><strong>‘임베드 코드’</strong> 탭을 선택하고 아래 코드를 붙여넣습니다.</li>
            </ol>

            <div className="relative mt-2">
              <pre className="p-3.5 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono overflow-x-auto">
                {embedCode}
              </pre>
              <button
                onClick={() => copyToClipboard(embedCode, 'code')}
                className="absolute top-2.5 right-2.5 px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded text-[11px] font-medium flex items-center gap-1 transition-colors"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? '복사됨' : '코드 복사'}</span>
              </button>
            </div>
          </div>

          {/* Step 2 */}
          <div className="space-y-2 pt-2 border-t border-[#E8E3F0]">
            <h4 className="font-bold text-[#292532] text-sm flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#8B6CF6] text-white text-[11px] font-mono flex items-center justify-center">2</span>
              <span>방법 2: 구글 사이트 버튼에 현재 서비스 URL 링크 걸기</span>
            </h4>
            <p className="text-xs text-[#777180]">
              Google Sites 메인 화면에 “신나라패키지 굿즈 포장 스튜디오 바로가기” 버튼을 추가하고 아래 링크를 연결합니다.
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="flex-1 px-3 py-2 bg-[#F7F4FF] border border-[#E8E3F0] rounded-lg text-xs font-mono text-[#514078]"
              />
              <button
                onClick={() => copyToClipboard(currentUrl, 'url')}
                className="px-3.5 py-2 bg-[#8B6CF6] text-white rounded-lg text-xs font-semibold hover:bg-[#7854f3] flex items-center gap-1 shrink-0"
              >
                {copiedUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedUrl ? '복사됨' : '주소 복사'}</span>
              </button>
            </div>
          </div>

          {/* Step 3 */}
          <div className="space-y-2 pt-2 border-t border-[#E8E3F0]">
            <h4 className="font-bold text-[#292532] text-sm flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#8B6CF6] text-white text-[11px] font-mono flex items-center justify-center">3</span>
              <span>구글 폼(Google Forms) 및 카카오톡 연결 안내</span>
            </h4>
            <p className="text-xs text-[#777180] leading-relaxed">
              본 웹사이트의 <strong>[견적 문의]</strong> 페이지에 있는 구글 폼 및 카카오톡 채널 영역은 운영자의 실제 주소로 교체할 수 있도록 설계되어 있습니다. 개설 후 주소만 입력하시면 방문 고객이 즉시 연결됩니다.
            </p>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-[#E8E3F0] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#8B6CF6] text-white rounded-lg text-xs font-semibold hover:bg-[#7854f3]"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
