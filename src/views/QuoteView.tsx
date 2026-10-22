import React, { useState } from 'react';
import { CONTACT_CHANNELS } from '../data/content';
import { QuoteFormData } from '../types';
import {
  Send,
  Phone,
  MessageCircle,
  Mail,
  FileSpreadsheet,
  CheckCircle2,
  Copy,
  Check,
  AlertCircle,
  UploadCloud,
  FileCheck,
  Loader2
} from 'lucide-react';

// Helper to format quantity with thousand commas if it contains 4+ digit numbers
const formatQuantity = (val: string): string => {
  if (!val || !val.trim()) return '미입력';
  const trimmed = val.trim();
  if (/^\d+$/.test(trimmed)) {
    return Number(trimmed).toLocaleString('ko-KR');
  }
  return trimmed.replace(/\b\d{4,}\b/g, num => Number(num).toLocaleString('ko-KR'));
};

// Helper to convert internal code like 'needConsult' to natural Korean label
const getMaterialReadyLabel = (val: string): string => {
  switch (val) {
    case 'ready':
      return '고객사 자체 준비 (자재 직접 제공)';
    case 'sinnaraSupplied':
      return '신나라패키지 표준 포장재(OPP/슬리브) 사용 희망';
    case 'needConsult':
      return '자재 별도 상담 필요 (적합한 자재 추천 요청)';
    default:
      return '상담 후 결정';
  }
};

// Helper to generate a clean, structured inquiry summary for email and on-screen preview
const generateFormattedSummary = (data: QuoteFormData, fileName?: string, fileSizeKb?: number): string => {
  const formattedQty = formatQuantity(data.estimatedQuantity);
  const materialLabel = getMaterialReadyLabel(data.materialReady);
  const fileText = fileName
    ? `${fileName}${fileSizeKb !== undefined ? ` (${fileSizeKb} KB)` : ''}`
    : '첨부 없음';

  return `================================================
[신나라패키지] 포장 견적 문의 상세 내역
================================================

[1. 고객 정보]
• 업체명(브랜드명): ${data.companyName.trim() || '미입력'}
• 담당자 성함: ${data.contactName.trim() || '미입력'}
• 연락처(전화번호): ${data.phone.trim() || '미입력'}
• 이메일 주소: ${data.email.trim() || '미입력'}

[2. 굿즈 및 포장 정보]
• 굿즈 종류: ${data.goodsType.trim() || '미입력'}
• 예상 수량: ${formattedQty}
• 굿즈 크기/규격: ${data.goodsSize.trim() || '미입력 (상담 시 규격 확인)'}
• 희망 포장 방식: ${data.packagingMethod.trim() || '미입력 (상담 시 포장 방식 제안 요청)'}
• 포장재(부자재) 준비: ${materialLabel}

[3. 일정 및 추가 요청 사항]
• 희망 작업 일정: ${data.targetSchedule.trim() || '미입력 (일정 협의)'}
• 첨부 파일: ${fileText}
• 개인정보 수집·이용 동의: ${data.agreePrivacy ? '동의 완료' : '미동의'}

------------------------------------------------
[추가 요청 사항]
${data.additionalRequests.trim() || '미입력 (별도 특이사항 없음)'}
================================================
(접수 시각: ${new Date().toLocaleString('ko-KR')})`;
};

interface QuoteViewProps {
  onOpenGoogleSitesGuide: () => void;
  kakaoChannelUrl?: string;
  onOpenKakaoConfig?: () => void;
}

export const QuoteView: React.FC<QuoteViewProps> = ({
  onOpenGoogleSitesGuide,
  kakaoChannelUrl,
  onOpenKakaoConfig,
}) => {
  const [formData, setFormData] = useState<QuoteFormData>({
    companyName: '',
    contactName: '',
    phone: '',
    email: '',
    goodsType: '',
    estimatedQuantity: '',
    goodsSize: '',
    packagingMethod: '',
    materialReady: 'needConsult',
    targetSchedule: '',
    fileNote: '',
    additionalRequests: '',
    agreePrivacy: false,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [emailCopyStatus, setEmailCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle');

  const handleCopyEmail = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const emailToCopy = CONTACT_CHANNELS.email.value; // 'ares361@naver.com'
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(emailToCopy)
        .then(() => {
          setEmailCopyStatus('copied');
          setTimeout(() => setEmailCopyStatus('idle'), 2500);
        })
        .catch(() => {
          fallbackCopyEmail(emailToCopy);
        });
    } else {
      fallbackCopyEmail(emailToCopy);
    }
  };

  const fallbackCopyEmail = (text: string) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      if (successful) {
        setEmailCopyStatus('copied');
        setTimeout(() => setEmailCopyStatus('idle'), 2500);
        return;
      }
    } catch {
      // ignore
    }
    setEmailCopyStatus('failed');
    setTimeout(() => setEmailCopyStatus('idle'), 4000);
  };

  const [phoneCopyStatus, setPhoneCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle');

  const handleCopyPhone = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const phoneToCopy = CONTACT_CHANNELS.phone.value; // '010-4591-0334'
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(phoneToCopy)
        .then(() => {
          setPhoneCopyStatus('copied');
          setTimeout(() => setPhoneCopyStatus('idle'), 2500);
        })
        .catch(() => {
          fallbackCopyPhone(phoneToCopy);
        });
    } else {
      fallbackCopyPhone(phoneToCopy);
    }
  };

  const fallbackCopyPhone = (text: string) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      if (successful) {
        setPhoneCopyStatus('copied');
        setTimeout(() => setPhoneCopyStatus('idle'), 2500);
        return;
      }
    } catch {
      // ignore
    }
    setPhoneCopyStatus('failed');
    setTimeout(() => setPhoneCopyStatus('idle'), 4000);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setSelectedFileName(file.name);
      setFormData(prev => ({ ...prev, fileNote: `${file.name} (${Math.round(file.size / 1024)} KB)` }));
    } else {
      setSelectedFile(null);
      setSelectedFileName('');
      setFormData(prev => ({ ...prev, fileNote: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.companyName.trim()) {
      setErrorMessage('업체명 또는 브랜드명을 입력해 주세요.');
      return;
    }
    if (!formData.contactName.trim()) {
      setErrorMessage('담당자 성함을 입력해 주세요.');
      return;
    }
    if (!formData.phone.trim() && !formData.email.trim()) {
      setErrorMessage('연락처(전화번호) 또는 이메일 중 최소 하나를 입력해 주세요.');
      return;
    }
    if (!formData.goodsType.trim()) {
      setErrorMessage('굿즈 종류를 입력해 주세요.');
      return;
    }
    if (!formData.estimatedQuantity.trim()) {
      setErrorMessage('예상 작업 수량을 입력해 주세요.');
      return;
    }
    if (!formData.agreePrivacy) {
      setErrorMessage('개인정보 수집 및 이용에 동의해 주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const fileSizeKb = selectedFile ? Math.round(selectedFile.size / 1024) : undefined;
      const formattedQty = formatQuantity(formData.estimatedQuantity);
      const materialLabel = getMaterialReadyLabel(formData.materialReady);
      const fileText = selectedFileName
        ? `${selectedFileName}${fileSizeKb !== undefined ? ` (${fileSizeKb} KB)` : ''}`
        : '첨부 없음';
      const summaryText = generateFormattedSummary(formData, selectedFileName, fileSizeKb);

      // Prepare form data for Netlify Forms with natural Korean field names & sections
      const netlifyData = new FormData();
      netlifyData.append('form-name', 'quote-form');
      netlifyData.append('bot-field', '');
      netlifyData.append('subject', `[신나라패키지] 새 견적 문의 접수 - ${formData.companyName.trim()}`);
      netlifyData.append('[한눈에 보는 견적 문의 요약]', summaryText);

      // 1. 고객 정보
      netlifyData.append('[고객 정보] 업체명', formData.companyName.trim());
      netlifyData.append('[고객 정보] 담당자', formData.contactName.trim());
      netlifyData.append('[고객 정보] 연락처', formData.phone.trim() || '미입력');
      netlifyData.append('[고객 정보] 이메일', formData.email.trim() || '미입력');

      // 2. 굿즈 및 포장 정보
      netlifyData.append('[굿즈 및 포장 정보] 굿즈 종류', formData.goodsType.trim());
      netlifyData.append('[굿즈 및 포장 정보] 예상 수량', formattedQty);
      netlifyData.append('[굿즈 및 포장 정보] 굿즈 크기', formData.goodsSize.trim() || '미입력 (상담 시 규격 확인)');
      netlifyData.append('[굿즈 및 포장 정보] 포장 방식', formData.packagingMethod.trim() || '미입력 (상담 시 추천 희망)');
      netlifyData.append('[굿즈 및 포장 정보] 자재 준비', materialLabel);

      // 3. 일정 및 추가 요청 사항
      netlifyData.append('[일정 및 추가 요청 사항] 희망 일정', formData.targetSchedule.trim() || '미입력 (일정 협의)');
      netlifyData.append('[일정 및 추가 요청 사항] 첨부 파일', fileText);
      netlifyData.append('[일정 및 추가 요청 사항] 추가 요청 사항', formData.additionalRequests.trim() || '미입력 (별도 추가 요청 없음)');
      netlifyData.append('개인정보 수집·이용 동의', formData.agreePrivacy ? '동의 완료' : '미동의');

      // Attach file for Netlify Forms file upload
      if (selectedFile) {
        netlifyData.append('file', selectedFile);
      }

      const response = await fetch('/', {
        method: 'POST',
        body: netlifyData,
      });

      if (!response.ok) {
        throw new Error(`Netlify form error (HTTP ${response.status})`);
      }

      // Save inquiry to localStorage for client-side persistence backup
      try {
        const existing = JSON.parse(localStorage.getItem('sinnara_inquiries') || '[]');
        existing.push({
          ...formData,
          formattedQuantity: formattedQty,
          materialReadyLabel: materialLabel,
          submittedAt: new Date().toISOString(),
        });
        localStorage.setItem('sinnara_inquiries', JSON.stringify(existing));
      } catch {
        // ignore storage error
      }

      setIsSubmitted(true);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    } catch (err) {
      console.error('Netlify submission failed:', err);
      setErrorMessage(
        '견적 접수 중 네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주시거나 카카오톡(1:1 채팅) 또는 대표전화(010-4591-0334)로 직접 문의해 주시기 바랍니다.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateInquirySummary = () => {
    const fileSizeKb = selectedFile ? Math.round(selectedFile.size / 1024) : undefined;
    return generateFormattedSummary(formData, selectedFileName, fileSizeKb);
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(generateInquirySummary());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="py-12 sm:py-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F7F4FF] border border-[#B8A1F7]/40 rounded-md text-xs font-mono tracking-wider text-[#514078] mb-4">
            GET A QUOTE
          </div>
          <h1 className="font-['Outfit',sans-serif] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#292532] tracking-tight mb-4">
            아이돌 굿즈 포장 견적 문의
          </h1>
          <p className="text-base sm:text-lg text-[#514078] leading-relaxed">
            “포장할 굿즈의 종류와 수량, 원하는 포장 방식을 알려주세요. 내용을 확인하고 상담을 진행할 수 있도록 안내해 드립니다.”
          </p>
        </div>

        {/* Contact Channels Grid (Explicitly labeled as editable placeholders) */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono font-bold text-[#777180] uppercase tracking-wider">
              INQUIRY CHANNELS · 상담 접수 창구
            </span>
            <span className="text-[11px] text-[#8B6CF6] bg-[#F7F4FF] px-2 py-0.5 rounded border border-[#E8E3F0]">
              운영 정보 교체 영역
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Phone */}
            <div className="p-5 rounded-xl bg-[#F7F4FF] border border-[#E8E3F0] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-[#8B6CF6]">
                    <Phone className="w-4 h-4" />
                    <span className="text-xs font-bold text-[#292532]">{CONTACT_CHANNELS.phone.label}</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 font-semibold">
                    상담 전화
                  </span>
                </div>

                {/* Clickable phone number: calls on mobile, easy to click on PC */}
                <a
                  href="tel:01045910334"
                  className="text-sm font-bold text-[#292532] hover:text-[#8B6CF6] mb-1 font-mono block transition-colors select-all cursor-pointer"
                  title="모바일에서 클릭 시 바로 전화 연결"
                >
                  {CONTACT_CHANNELS.phone.value}
                </a>

                <div className="text-[11px] text-[#777180] leading-tight">
                  {CONTACT_CHANNELS.phone.note}
                </div>

                {/* Copy success feedback message */}
                {phoneCopyStatus === 'copied' && (
                  <div className="mt-2.5 py-1 px-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-medium flex items-center gap-1.5 animate-in fade-in duration-200">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>전화번호가 복사되었습니다.</span>
                  </div>
                )}

                {/* Copy fail/unsupported feedback message */}
                {phoneCopyStatus === 'failed' && (
                  <div className="mt-2.5 py-1.5 px-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] leading-tight flex items-start gap-1.5 animate-in fade-in duration-200">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>위 전화번호(010-4591-0334)를 직접 복사해 주세요.</span>
                  </div>
                )}
              </div>

              {/* Action row: Phone call on mobile & Copy button on PC/Mobile */}
              <div className="mt-3 pt-3 border-t border-[#E8E3F0] flex items-center justify-between text-[11px]">
                <a
                  href="tel:01045910334"
                  className="font-semibold text-[#8B6CF6] hover:text-[#7854f3] flex items-center gap-1 transition-colors"
                  title="전화 걸기"
                >
                  <span>전화 걸기</span>
                  <span className="font-mono">↗</span>
                </a>
                <button
                  type="button"
                  onClick={handleCopyPhone}
                  className="text-[#777180] hover:text-[#514078] font-mono flex items-center gap-1 transition-colors focus:outline-none"
                  title="전화번호 클립보드 복사"
                >
                  {phoneCopyStatus === 'copied' ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>복사됨</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-0.5">
                      <Copy className="w-3 h-3" />
                      <span>번호 복사</span>
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* KakaoTalk */}
            <div className="p-5 rounded-xl bg-[#F7F4FF] border border-[#E8E3F0] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-[#8B6CF6]">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-xs font-bold text-[#292532]">{CONTACT_CHANNELS.kakao.label}</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 font-semibold">
                    공식 채널
                  </span>
                </div>
                <a
                  href={kakaoChannelUrl || CONTACT_CHANNELS.kakao.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-[#514078] hover:text-[#8B6CF6] mb-1 block transition-colors cursor-pointer"
                  title="신나라패키지 카카오톡 1:1 채팅 열기"
                >
                  {CONTACT_CHANNELS.kakao.value}
                </a>
                <div className="text-[11px] text-[#777180] leading-tight">
                  {CONTACT_CHANNELS.kakao.note}
                </div>
              </div>
              <a
                href={kakaoChannelUrl || CONTACT_CHANNELS.kakao.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 pt-3 border-t border-[#E8E3F0] text-[11px] text-[#8B6CF6] font-semibold text-left hover:underline flex items-center justify-between"
                title="카카오톡 1:1 상담 채팅 바로가기"
              >
                <span>1:1 채팅 상담 바로가기</span>
                <span>↗</span>
              </a>
            </div>

            {/* Email */}
            <div className="p-5 rounded-xl bg-[#F7F4FF] border border-[#E8E3F0] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-[#8B6CF6]">
                    <Mail className="w-4 h-4" />
                    <span className="text-xs font-bold text-[#292532]">{CONTACT_CHANNELS.email.label}</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 font-semibold">
                    공식 이메일
                  </span>
                </div>

                {/* Clickable email address: copies to clipboard */}
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="w-full text-left group focus:outline-none mb-1"
                  title="클릭하여 이메일 주소 복사하기"
                >
                  <span className="text-sm font-semibold text-[#514078] group-hover:text-[#8B6CF6] font-mono block select-all transition-colors cursor-pointer">
                    {CONTACT_CHANNELS.email.value}
                  </span>
                </button>

                <div className="text-[11px] text-[#777180] leading-tight">
                  {CONTACT_CHANNELS.email.note}
                </div>

                {/* Copy success feedback message */}
                {emailCopyStatus === 'copied' && (
                  <div className="mt-2.5 py-1 px-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-medium flex items-center gap-1.5 animate-in fade-in duration-200">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>이메일 주소가 복사되었습니다.</span>
                  </div>
                )}

                {/* Copy fail/unsupported feedback message */}
                {emailCopyStatus === 'failed' && (
                  <div className="mt-2.5 py-1.5 px-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] leading-tight flex items-start gap-1.5 animate-in fade-in duration-200">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>클립보드 복사를 지원하지 않는 환경입니다. 위 이메일 주소를 직접 선택해서 복사해 주세요.</span>
                  </div>
                )}
              </div>

              {/* '이메일 주소 복사하기' Button */}
              <button
                type="button"
                onClick={handleCopyEmail}
                className="mt-3 pt-3 border-t border-[#E8E3F0] text-[11px] text-[#8B6CF6] hover:text-[#7854f3] font-semibold text-left flex items-center justify-between group transition-colors focus:outline-none"
              >
                <span className="flex items-center gap-1.5">
                  {emailCopyStatus === 'copied' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">이메일 주소가 복사되었습니다.</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                      <span>이메일 주소 복사하기</span>
                    </>
                  )}
                </span>
                <span className="text-[10px] text-[#777180] font-mono group-hover:translate-x-0.5 transition-transform">
                  COPY
                </span>
              </button>
            </div>

            {/* Google Forms Connection */}
            <div className="p-5 rounded-xl bg-[#F7F4FF] border border-[#E8E3F0] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-[#8B6CF6]">
                    <FileSpreadsheet className="w-4 h-4" />
                    <span className="text-xs font-bold text-[#292532]">{CONTACT_CHANNELS.googleForm.label}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">연동형</span>
                </div>
                <div className="text-xs text-[#514078] leading-tight mb-2">
                  {CONTACT_CHANNELS.googleForm.note}
                </div>
              </div>
              <button
                type="button"
                onClick={onOpenGoogleSitesGuide}
                className="mt-3 pt-3 border-t border-[#E8E3F0] text-[11px] text-[#8B6CF6] font-semibold text-left hover:underline flex items-center justify-between"
              >
                <span>연동 가이드 확인</span>
                <span>↗</span>
              </button>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white border border-[#E8E3F0] rounded-2xl p-6 sm:p-10 shadow-sm max-w-4xl mx-auto">
          {isSubmitted ? (
            <div className="text-center py-10 space-y-6 animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-full bg-[#E9E1FF] text-[#8B6CF6] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-[#292532]">
                  견적 문의 내용이 정상 접수되었습니다.
                </h3>
                <p className="text-sm text-[#777180] max-w-md mx-auto">
                  접수해 주신 내용을 토대로 담당자가 검토 후 기재해 주신 연락처로 상담을 안내해 드리겠습니다.
                </p>
              </div>

              {/* Inquiry Summary Preview */}
              <div className="bg-[#F7F4FF] border border-[#E8E3F0] rounded-xl p-5 text-left text-xs font-mono text-[#514078] max-w-lg mx-auto whitespace-pre-line leading-relaxed">
                {generateInquirySummary()}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <button
                  onClick={handleCopySummary}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#8B6CF6] text-white rounded-lg text-xs font-semibold hover:bg-[#7854f3]"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? '클립보드에 복사됨' : '견적 내용 텍스트 복사하기'}</span>
                </button>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setSelectedFile(null);
                    setSelectedFileName('');
                    setFormData({
                      companyName: '',
                      contactName: '',
                      phone: '',
                      email: '',
                      goodsType: '',
                      estimatedQuantity: '',
                      goodsSize: '',
                      packagingMethod: '',
                      materialReady: 'needConsult',
                      targetSchedule: '',
                      fileNote: '',
                      additionalRequests: '',
                      agreePrivacy: false,
                    });
                  }}
                  className="px-5 py-2.5 bg-white border border-[#E8E3F0] text-[#777180] rounded-lg text-xs font-medium hover:bg-[#F7F4FF]"
                >
                  새로운 문의 작성하기
                </button>
              </div>
            </div>
          ) : (
            <form
              name="quote-form"
              method="POST"
              data-netlify="true"
              data-netlify-honeypot="bot-field"
              onSubmit={handleSubmit}
              className="space-y-8"
            >
              {/* Netlify Forms Hidden Identification and Honeypot */}
              <input type="hidden" name="form-name" value="quote-form" />
              <input type="hidden" name="subject" value="[신나라패키지] 새 견적 문의 접수" />
              <div className="hidden">
                <label>
                  스팸 방지 필드 <input name="bot-field" />
                </label>
              </div>
              {errorMessage && (
                <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Section 1: Client Information */}
              <div>
                <h3 className="text-base font-bold text-[#292532] mb-4 pb-2 border-b border-[#E8E3F0]">
                  1. 의뢰 담당자 정보
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#514078] mb-1.5">
                      업체명 또는 브랜드명 <span className="text-[#8B6CF6]">*</span>
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      placeholder="예: 굿즈스튜디오 / 개인 판매자명"
                      className="w-full px-3.5 py-2.5 bg-[#F7F4FF]/60 border border-[#E8E3F0] rounded-lg text-xs sm:text-sm text-[#292532] focus:outline-none focus:border-[#8B6CF6] focus:bg-white transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#514078] mb-1.5">
                      담당자 성함 <span className="text-[#8B6CF6]">*</span>
                    </label>
                    <input
                      type="text"
                      name="contactName"
                      value={formData.contactName}
                      onChange={handleInputChange}
                      placeholder="예: 홍길동"
                      className="w-full px-3.5 py-2.5 bg-[#F7F4FF]/60 border border-[#E8E3F0] rounded-lg text-xs sm:text-sm text-[#292532] focus:outline-none focus:border-[#8B6CF6] focus:bg-white transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#514078] mb-1.5">
                      연락처 (전화번호)
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="예: 010-1234-5678"
                      className="w-full px-3.5 py-2.5 bg-[#F7F4FF]/60 border border-[#E8E3F0] rounded-lg text-xs sm:text-sm text-[#292532] focus:outline-none focus:border-[#8B6CF6] focus:bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#514078] mb-1.5">
                      이메일 주소
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="예: your@company.com"
                      className="w-full px-3.5 py-2.5 bg-[#F7F4FF]/60 border border-[#E8E3F0] rounded-lg text-xs sm:text-sm text-[#292532] focus:outline-none focus:border-[#8B6CF6] focus:bg-white transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Goods & Packing Details */}
              <div>
                <h3 className="text-base font-bold text-[#292532] mb-4 pb-2 border-b border-[#E8E3F0]">
                  2. 굿즈 및 포장 세부 사항
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#514078] mb-1.5">
                      굿즈 종류 <span className="text-[#8B6CF6]">*</span>
                    </label>
                    <input
                      type="text"
                      name="goodsType"
                      value={formData.goodsType}
                      onChange={handleInputChange}
                      placeholder="예: 아이돌 앨범 포토카드, 예약특전 엽서, 굿즈세트"
                      className="w-full px-3.5 py-2.5 bg-[#F7F4FF]/60 border border-[#E8E3F0] rounded-lg text-xs sm:text-sm text-[#292532] focus:outline-none focus:border-[#8B6CF6] focus:bg-white transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#514078] mb-1.5">
                      예상 작업 수량 <span className="text-[#8B6CF6]">*</span>
                    </label>
                    <input
                      type="text"
                      name="estimatedQuantity"
                      value={formData.estimatedQuantity}
                      onChange={handleInputChange}
                      placeholder="예: 1,000매 / 500세트"
                      className="w-full px-3.5 py-2.5 bg-[#F7F4FF]/60 border border-[#E8E3F0] rounded-lg text-xs sm:text-sm text-[#292532] focus:outline-none focus:border-[#8B6CF6] focus:bg-white transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#514078] mb-1.5">
                      굿즈 크기 / 규격
                    </label>
                    <input
                      type="text"
                      name="goodsSize"
                      value={formData.goodsSize}
                      onChange={handleInputChange}
                      placeholder="예: 55×85mm 표준 / 100×150mm"
                      className="w-full px-3.5 py-2.5 bg-[#F7F4FF]/60 border border-[#E8E3F0] rounded-lg text-xs sm:text-sm text-[#292532] focus:outline-none focus:border-[#8B6CF6] focus:bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#514078] mb-1.5">
                      원하는 포장 방식
                    </label>
                    <input
                      type="text"
                      name="packagingMethod"
                      value={formData.packagingMethod}
                      onChange={handleInputChange}
                      placeholder="예: 고투명 OPP 접착 / 슬리브+탑로더 / 전용 봉투입"
                      className="w-full px-3.5 py-2.5 bg-[#F7F4FF]/60 border border-[#E8E3F0] rounded-lg text-xs sm:text-sm text-[#292532] focus:outline-none focus:border-[#8B6CF6] focus:bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#514078] mb-1.5">
                      포장재(부자재) 준비 여부
                    </label>
                    <select
                      name="materialReady"
                      value={formData.materialReady}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 bg-[#F7F4FF]/60 border border-[#E8E3F0] rounded-lg text-xs sm:text-sm text-[#292532] focus:outline-none focus:border-[#8B6CF6] focus:bg-white transition-colors"
                    >
                      <option value="needConsult">상담 시 적합한 자재 추천 요청</option>
                      <option value="ready">고객사에서 직접 포장재를 제공하여 입고</option>
                      <option value="sinnaraSupplied">신나라패키지 표준 포장재(OPP/슬리브) 사용 희망</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#514078] mb-1.5">
                      희망 작업 일정 / 납품 기한
                    </label>
                    <input
                      type="text"
                      name="targetSchedule"
                      value={formData.targetSchedule}
                      onChange={handleInputChange}
                      placeholder="예: 2026년 11월 초까지 납품 희망"
                      className="w-full px-3.5 py-2.5 bg-[#F7F4FF]/60 border border-[#E8E3F0] rounded-lg text-xs sm:text-sm text-[#292532] focus:outline-none focus:border-[#8B6CF6] focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                {/* File Attachment Slot */}
                <div className="mt-4">
                  <label className="block text-xs font-semibold text-[#514078] mb-1.5">
                    참고 이미지 또는 발주 파일 첨부
                  </label>
                  <label className="border-2 border-dashed border-[#B8A1F7]/40 hover:border-[#8B6CF6] rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer bg-[#F7F4FF]/30 transition-colors">
                    <input
                      type="file"
                      name="file"
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/*,.pdf,.zip"
                    />
                    {selectedFileName ? (
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#514078]">
                        <FileCheck className="w-5 h-5 text-emerald-600" />
                        <span>선택된 파일: {selectedFileName}</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-center">
                        <UploadCloud className="w-6 h-6 text-[#8B6CF6]" />
                        <span className="text-xs font-medium text-[#292532]">
                          굿즈 사진, 포장 참고 이미지, 사양서 파일 첨부 (선택)
                        </span>
                        <span className="text-[10px] text-[#777180]">
                          이미지, PDF, ZIP 등 지원
                        </span>
                      </div>
                    )}
                  </label>
                </div>

                {/* Additional Requests */}
                <div className="mt-4">
                  <label className="block text-xs font-semibold text-[#514078] mb-1.5">
                    기타 요청 사항
                  </label>
                  <textarea
                    rows={3}
                    name="additionalRequests"
                    value={formData.additionalRequests}
                    onChange={handleInputChange}
                    placeholder="검수 기준, 멤버별 묶음 정렬, 택배 발송 요청 등 특이사항이 있다면 자유롭게 적어주세요."
                    className="w-full px-3.5 py-2.5 bg-[#F7F4FF]/60 border border-[#E8E3F0] rounded-lg text-xs sm:text-sm text-[#292532] focus:outline-none focus:border-[#8B6CF6] focus:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* Section 3: Privacy Consent */}
              <div className="p-4 rounded-xl bg-[#F7F4FF] border border-[#E8E3F0]">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    name="agreePrivacy"
                    checked={formData.agreePrivacy}
                    onChange={handleInputChange}
                    className="mt-0.5 rounded text-[#8B6CF6] focus:ring-[#8B6CF6]"
                    required
                  />
                  <div className="text-xs text-[#514078] leading-relaxed">
                    <span className="font-semibold text-[#292532]">개인정보 수집 및 이용 동의 (필수):</span> 견적 상담 및 작업 일정 조율을 위해 기재된 업체명, 담당자명, 연락처, 이메일을 수집하며 상담 목적 종료 시까지 안전하게 보관됩니다.
                  </div>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#8B6CF6] hover:bg-[#7854f3] active:bg-[#6842e4] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-sm hover:shadow transition-all text-sm sm:text-base flex items-center justify-center gap-2 group focus:outline-none focus:ring-2 focus:ring-[#8B6CF6]/40"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>견적 접수 전송 중...</span>
                    </>
                  ) : (
                    <>
                      <span>견적 문의 접수하기</span>
                      <Send className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
