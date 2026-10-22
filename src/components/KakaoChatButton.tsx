import React from 'react';
import { MessageCircle, Settings } from 'lucide-react';

interface KakaoChatButtonProps {
  kakaoChannelUrl?: string;
  onOpenConfig: () => void;
}

export const KakaoChatButton: React.FC<KakaoChatButtonProps> = ({
  kakaoChannelUrl = 'http://pf.kakao.com/_CXxcmX',
  onOpenConfig,
}) => {
  const targetUrl = (kakaoChannelUrl && kakaoChannelUrl.trim()) || 'http://pf.kakao.com/_CXxcmX';

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {/* Desktop Floating Button (Fixed Bottom-Right) */}
      <div className="hidden sm:flex fixed bottom-6 right-6 z-40 items-center group">
        <div className="relative flex items-center">
          {/* Main Kakao Consultation Button */}
          <button
            onClick={handleClick}
            className="flex items-center gap-2.5 px-4 py-3 bg-[#FEE500] hover:bg-[#fae100] active:bg-[#ebd300] text-[#191919] font-bold text-sm rounded-full shadow-lg shadow-purple-950/10 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 border border-[#e8d200] focus:outline-none focus:ring-2 focus:ring-[#8B6CF6]/50"
            title={kakaoChannelUrl ? "카카오톡 1:1 상담하기" : "카카오톡 채널 URL 설정하기"}
            aria-label="카카오톡 상담하기"
          >
            {/* Kakao Speech Bubble Icon */}
            <div className="w-5 h-5 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 fill-current text-[#191919]" viewBox="0 0 24 24">
                <path d="M12 3C6.477 3 2 6.477 2 10.768c0 2.766 1.867 5.19 4.675 6.567l-.95 3.513c-.084.307.25.56.515.396l4.24-2.617c.502.052 1.01.079 1.52.079 5.523 0 10-3.477 10-7.768C22 6.477 17.523 3 12 3z" />
              </svg>
            </div>
            <span className="whitespace-nowrap tracking-tight">카카오톡 상담하기</span>

            {/* Pulsing indicator to show it's active */}
            <span className="w-2 h-2 rounded-full bg-[#8B6CF6] shrink-0" />
          </button>

          {/* Quick Settings trigger button to edit URL */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenConfig();
            }}
            className="ml-1.5 p-2 bg-white/90 hover:bg-white text-[#777180] hover:text-[#514078] rounded-full shadow-md border border-[#E8E3F0] transition-transform duration-200 hover:scale-110 focus:outline-none"
            title="카카오톡 채널 링크 설정/변경"
            aria-label="카카오톡 채널 설정"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mobile Floating Action (Fixed Bottom-Left or alongside Quote button) */}
      <div className="sm:hidden fixed bottom-4 left-4 z-30">
        <button
          onClick={handleClick}
          className="flex items-center gap-1.5 px-3.5 py-2.5 bg-[#FEE500] active:bg-[#ebd300] text-[#191919] text-xs font-bold rounded-full shadow-lg shadow-purple-950/15 active:scale-95 transition-transform border border-[#e8d200] focus:outline-none"
          aria-label="카카오톡 상담하기"
        >
          <svg className="w-4 h-4 fill-current text-[#191919]" viewBox="0 0 24 24">
            <path d="M12 3C6.477 3 2 6.477 2 10.768c0 2.766 1.867 5.19 4.675 6.567l-.95 3.513c-.084.307.25.56.515.396l4.24-2.617c.502.052 1.01.079 1.52.079 5.523 0 10-3.477 10-7.768C22 6.477 17.523 3 12 3z" />
          </svg>
          <span className="tracking-tight">카톡 상담</span>
        </button>
      </div>
    </>
  );
};
