import React, { useState } from 'react';
import { X, MessageCircle, ExternalLink, Check, AlertCircle, HelpCircle } from 'lucide-react';

interface KakaoConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUrl?: string;
  onSaveUrl: (url: string) => void;
}

export const KakaoConfigModal: React.FC<KakaoConfigModalProps> = ({
  isOpen,
  onClose,
  currentUrl = 'https://pf.kakao.com/_CXxcmX',
  onSaveUrl,
}) => {
  const [urlInput, setUrlInput] = useState(currentUrl || 'https://pf.kakao.com/_CXxcmX');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (isOpen) {
      setUrlInput(currentUrl || 'https://pf.kakao.com/_CXxcmX');
    }
  }, [isOpen, currentUrl]);

  if (!isOpen) return null;

  const handleSave = (andOpen = false) => {
    let cleanUrl = urlInput.trim();
    if (!cleanUrl) {
      setError('카카오톡 채널 URL을 입력해 주세요.');
      return;
    }

    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = 'https://' + cleanUrl;
    }

    setError('');
    onSaveUrl(cleanUrl);
    setSavedSuccess(true);

    if (andOpen) {
      window.open(cleanUrl, '_blank', 'noopener,noreferrer');
    }

    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#E8E3F0] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-[#E8E3F0] flex items-center justify-between bg-[#FEE500]/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#FEE500] text-[#191919] flex items-center justify-center shadow-xs">
              <MessageCircle className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#292532]">
                카카오톡 상담 채널 연동 설정
              </h3>
              <span className="text-[11px] text-[#777180]">
                신나라패키지 1:1 카카오톡 채팅 URL 등록
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-white rounded-lg transition-colors"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-xs sm:text-sm">
          <p className="text-xs text-[#514078] leading-relaxed">
            운영 중이신 <strong>신나라패키지 공식 카카오톡 채널</strong> 또는 <strong>1:1 오픈채팅</strong> 링크를 입력해 주세요. 방문 고객이 웹사이트에서 [카카오톡 상담하기] 버튼을 누르면 해당 채팅창으로 즉시 연결됩니다.
          </p>

          {/* URL Input Form */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#292532]">
              카카오톡 채널 또는 오픈채팅 URL
            </label>
            <div className="relative">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => {
                  setUrlInput(e.target.value);
                  setError('');
                }}
                placeholder="예: https://pf.kakao.com/_CXxcmX"
                className="w-full px-3.5 py-3 bg-[#F7F4FF]/70 border border-[#B8A1F7]/50 rounded-xl text-xs sm:text-sm text-[#292532] focus:outline-none focus:border-[#8B6CF6] focus:bg-white transition-colors pr-10 font-mono"
              />
              {currentUrl && (
                <button
                  type="button"
                  onClick={() => window.open(currentUrl, '_blank')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-[#8B6CF6] hover:bg-[#E9E1FF] rounded-md transition-colors"
                  title="현재 연결된 주소 열기"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              )}
            </div>

            {error && (
              <div className="flex items-center gap-1.5 text-xs text-rose-600 mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {savedSuccess && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 mt-1 font-medium">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>카카오톡 채널 URL이 성공적으로 저장되었습니다!</span>
              </div>
            )}
          </div>

          {/* Channel Link Finding Guide */}
          <div className="p-4 rounded-xl bg-[#F7F4FF] border border-[#E8E3F0] space-y-2 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-[#514078]">
              <HelpCircle className="w-3.5 h-3.5 text-[#8B6CF6]" />
              <span>카카오톡 채널 1:1 채팅 링크 확인 방법</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-[#777180] pl-1">
              <li>
                <a
                  href="https://center-pf.kakao.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#8B6CF6] hover:underline inline-flex items-center gap-0.5 font-medium"
                >
                  <span>카카오톡 채널 관리자센터</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                에 로그인합니다.
              </li>
              <li>신나라패키지 채널 선택 후 <strong>[대시보드 홈]</strong>으로 이동합니다.</li>
              <li>채널 프로필 아래 <strong>'채널 홈 URL'</strong> 또는 <strong>'1:1 채팅 URL'</strong>을 복사합니다.</li>
              <li>위 입력창에 붙여넣고 [저장하기]를 누르면 즉시 연동 완료됩니다.</li>
            </ol>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-[#E8E3F0] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-[#777180] text-[11px]">
            설정은 브라우저에 안전하게 저장됩니다.
          </span>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2.5 bg-white border border-[#E8E3F0] text-[#777180] rounded-xl font-medium hover:bg-slate-100 transition-colors"
            >
              닫기
            </button>
            <button
              type="button"
              onClick={() => handleSave(true)}
              className="flex-1 sm:flex-initial px-4 py-2.5 bg-[#FEE500] hover:bg-[#f5dc00] active:bg-[#ebd300] text-[#191919] rounded-xl font-bold transition-colors shadow-xs flex items-center justify-center gap-1.5"
            >
              <span>저장 및 채팅 열기</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
