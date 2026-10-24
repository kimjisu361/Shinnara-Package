import React, { useRef } from 'react';
import { CustomAssets } from '../types';
import { X, Upload, RotateCcw, Check, Image as ImageIcon } from 'lucide-react';

interface AssetManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customAssets: CustomAssets;
  onUpdateAssets: (newAssets: CustomAssets) => void;
}

export const AssetManagerModal: React.FC<AssetManagerModalProps> = ({
  isOpen,
  onClose,
  customAssets,
  onUpdateAssets,
}) => {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const puppyInputRef = useRef<HTMLInputElement>(null);
  const heroInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (
    field: keyof CustomAssets,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const updated = { ...customAssets, [field]: result };
        onUpdateAssets(updated);
        try {
          localStorage.setItem('sinnara_assets', JSON.stringify(updated));
        } catch {
          // ignore storage limit
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetField = (field: keyof CustomAssets) => {
    const updated = { ...customAssets, [field]: undefined };
    onUpdateAssets(updated);
    try {
      localStorage.setItem('sinnara_assets', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-[#E8E3F0] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-[#E8E3F0] flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#514078]">
            <ImageIcon className="w-5 h-5 text-[#8B6CF6]" />
            <h3 className="font-bold text-base text-[#292532]">
              스튜디오 에셋 & 로고 관리
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-[#F7F4FF] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-xs sm:text-sm">
          <p className="text-xs text-[#777180] leading-relaxed">
            신나라패키지의 공식 로고 파일, 흰색 강아지 캐릭터, 또는 실제 스튜디오 작업 사진을 언제든지 업로드하여 즉시 반영할 수 있습니다.
          </p>

          {/* Slot 1: Puppy Mascot */}
          <div className="p-4 rounded-xl bg-[#F7F4FF] border border-[#E8E3F0] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white border border-[#B8A1F7]/50 overflow-hidden flex items-center justify-center shrink-0">
                {customAssets.puppyImage ? (
                  <img
                    src={customAssets.puppyImage}
                    alt="흰색 강아지 캐릭터"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs font-mono text-[#8B6CF6]">기본</span>
                )}
              </div>
              <div>
                <span className="font-bold text-[#292532] block">흰색 강아지 캐릭터 마스코트</span>
                <span className="text-[11px] text-[#777180]">헤더 로고 옆 및 브랜드 포인트용</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                ref={puppyInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload('puppyImage', e)}
              />
              <button
                onClick={() => puppyInputRef.current?.click()}
                className="px-3 py-1.5 bg-[#8B6CF6] text-white rounded-lg text-xs font-medium hover:bg-[#7854f3] flex items-center gap-1"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>업로드</span>
              </button>
              {customAssets.puppyImage && (
                <button
                  onClick={() => handleResetField('puppyImage')}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                  title="기본 그래픽으로 복원"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Slot 2: Brand Logo */}
          <div className="p-4 rounded-xl bg-[#F7F4FF] border border-[#E8E3F0] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-10 rounded bg-white border border-[#B8A1F7]/50 overflow-hidden flex items-center justify-center shrink-0">
                {customAssets.logoImage ? (
                  <img
                    src={customAssets.logoImage}
                    alt="브랜드 로고"
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <span className="text-[10px] font-mono text-[#8B6CF6]">워드마크</span>
                )}
              </div>
              <div>
                <span className="font-bold text-[#292532] block">SINNARA PACKAGE 공식 로고</span>
                <span className="text-[11px] text-[#777180]">투명 PNG 또는 SVG 권장</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload('logoImage', e)}
              />
              <button
                onClick={() => logoInputRef.current?.click()}
                className="px-3 py-1.5 bg-[#8B6CF6] text-white rounded-lg text-xs font-medium hover:bg-[#7854f3] flex items-center gap-1"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>업로드</span>
              </button>
              {customAssets.logoImage && (
                <button
                  onClick={() => handleResetField('logoImage')}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                  title="기본 워드마크로 복원"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Slot 3: Hero Banner Photo */}
          <div className="p-4 rounded-xl bg-[#F7F4FF] border border-[#E8E3F0] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-10 rounded bg-white border border-[#B8A1F7]/50 overflow-hidden flex items-center justify-center shrink-0">
                {customAssets.heroImage ? (
                  <img
                    src={customAssets.heroImage}
                    alt="히어로 사진"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-[10px] font-mono text-[#8B6CF6]">스튜디오</span>
                )}
              </div>
              <div>
                <span className="font-bold text-[#292532] block">메인 히어로 작업 사진</span>
                <span className="text-[11px] text-[#777180]">실제 작업장 포토카드 사진으로 교체</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                ref={heroInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload('heroImage', e)}
              />
              <button
                onClick={() => heroInputRef.current?.click()}
                className="px-3 py-1.5 bg-[#8B6CF6] text-white rounded-lg text-xs font-medium hover:bg-[#7854f3] flex items-center gap-1"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>업로드</span>
              </button>
              {customAssets.heroImage && (
                <button
                  onClick={() => handleResetField('heroImage')}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                  title="기본 그래픽으로 복원"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Slot 4: KakaoTalk Channel URL */}
          <div className="p-4 rounded-xl bg-[#FEE500]/15 border border-[#FEE500]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FEE500] text-[#191919] flex items-center justify-center shrink-0 shadow-xs font-bold">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 3C6.477 3 2 6.477 2 10.768c0 2.766 1.867 5.19 4.675 6.567l-.95 3.513c-.084.307.25.56.515.396l4.24-2.617c.502.052 1.01.079 1.52.079 5.523 0 10-3.477 10-7.768C22 6.477 17.523 3 12 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <span className="font-bold text-[#292532] block">카카오톡 채널 상담 링크</span>
                <span className="text-[11px] text-[#777180]">
                  {customAssets.kakaoChannelUrl || 'https://pf.kakao.com/_CXxcmX'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="https://pf.kakao.com/_CXxcmX"
                value={customAssets.kakaoChannelUrl || ''}
                onChange={(e) => {
                  const updated = { ...customAssets, kakaoChannelUrl: e.target.value };
                  onUpdateAssets(updated);
                  try {
                    localStorage.setItem('sinnara_assets', JSON.stringify(updated));
                  } catch {
                    // ignore
                  }
                }}
                className="px-2.5 py-1.5 bg-white border border-[#E8E3F0] rounded-lg text-xs font-mono text-[#292532] w-48 focus:outline-none focus:border-[#8B6CF6]"
              />
              {customAssets.kakaoChannelUrl && (
                <button
                  type="button"
                  onClick={() => window.open(customAssets.kakaoChannelUrl, '_blank')}
                  className="px-2.5 py-1.5 bg-[#FEE500] hover:bg-[#fae100] text-[#191919] font-bold text-xs rounded-lg transition-colors shrink-0"
                  title="연결 테스트"
                >
                  테스트
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-[#E8E3F0] flex items-center justify-between text-xs">
          <span className="text-[#777180]">설정은 브라우저에 안전하게 저장됩니다.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#292532] text-white font-medium rounded-lg hover:bg-black transition-colors"
          >
            완료
          </button>
        </div>
      </div>
    </div>
  );
};
