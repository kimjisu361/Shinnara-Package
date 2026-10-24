import React, { useState, useEffect } from 'react';
import { PageTab, AdminUser, AdminAuthStatus } from '../types';
import {
  isFirebaseConfigured,
  ADMIN_ALLOWED_EMAIL,
} from '../lib/firebase';
import {
  loginAdmin,
  logoutAdmin,
  subscribeAdminAuth,
  refreshAdminAuthState,
  getAuthErrorMessage,
  resendVerificationEmail,
  ServerVerifyResult,
} from '../lib/adminAuth';
import {
  ShieldCheck,
  Lock,
  Mail,
  Key,
  LogOut,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  RefreshCw,
  Server,
  ShieldAlert,
  Database,
  Layers,
  Shield,
} from 'lucide-react';
import { PortfolioManager } from '../components/admin/PortfolioManager';

interface AdminViewProps {
  onNavigate: (tab: PageTab) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ onNavigate }) => {
  const [authStatus, setAuthStatus] = useState<AdminAuthStatus>('loading');
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [idToken, setIdToken] = useState<string>('');

  // Admin Sub-Tab: 'portfolio' (작업 사례 관리) | 'security' (보안 및 서버 현황)
  const [adminTab, setAdminTab] = useState<'portfolio' | 'security'>('portfolio');

  // Login form state
  const [emailInput, setEmailInput] = useState<string>(ADMIN_ALLOWED_EMAIL);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>('');

  // Server verification state
  const [serverVerify, setServerVerify] = useState<ServerVerifyResult | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [verificationSent, setVerificationSent] = useState<boolean>(false);

  // Subscribe to Firebase Auth state with multi-layer verification
  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setAuthStatus('unauthenticated');
      return;
    }

    const unsubscribe = subscribeAdminAuth((status, user, token, verifyResult) => {
      setAuthStatus(status);
      setCurrentUser(user);
      setIdToken(token || '');
      setServerVerify(verifyResult || null);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) {
      return;
    }
    setLoginError('');

    const targetEmail = emailInput.trim();
    if (!targetEmail) {
      setLoginError('관리자 이메일 주소를 입력해 주세요.');
      return;
    }
    if (!passwordInput) {
      setLoginError('비밀번호를 입력해 주세요.');
      return;
    }

    if (!isFirebaseConfigured()) {
      setLoginError('Firebase 설정이 올바르지 않습니다. 관리자 환경 설정을 확인해 주세요.');
      return;
    }

    // Clear any previous state before new login attempt
    setIdToken('');
    setServerVerify(null);
    setIsSubmitting(true);

    console.log('[AdminView] 관리자 로그인 시도 시작:', targetEmail);

    try {
      const adminUser = await loginAdmin(targetEmail, passwordInput);
      console.log('[AdminView] Firebase 로그인 성공! UID:', adminUser.uid);
      setPasswordInput('');
      // subscribeAdminAuth will receive auth event and run multi-layer verification
    } catch (err: any) {
      console.error('[AdminView Login Error]:', err);
      const code = err?.code || '';
      if (err?.message?.startsWith('CONFIG_MISSING')) {
        setLoginError('Firebase 환경 설정이 누락되었습니다. 관리자 설정을 확인해 주세요.');
      } else {
        setLoginError(getAuthErrorMessage(code));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutAdmin();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Purge all credentials, token, and server results to prevent stale access
      setAuthStatus('unauthenticated');
      setCurrentUser(null);
      setIdToken('');
      setServerVerify(null);
    }
  };

  const handleRefreshAuth = async () => {
    setIsRefreshing(true);
    try {
      await refreshAdminAuthState((status, user, token, verifyResult) => {
        setAuthStatus(status);
        setCurrentUser(user);
        setIdToken(token || '');
        setServerVerify(verifyResult || null);
      });
    } catch (err) {
      console.error('Refresh auth error:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleResendEmail = async () => {
    try {
      await resendVerificationEmail();
      setVerificationSent(true);
      setTimeout(() => setVerificationSent(false), 5000);
    } catch (err: any) {
      alert(`이메일 발송 실패: ${err?.message || '잠시 후 다시 시도해 주세요.'}`);
    }
  };

  const isConfigured = isFirebaseConfigured();

  // Strict client-side gating condition for management access:
  // 1. authStatus is explicitly 'authenticated'
  // 2. currentUser is not null and matches designated ADMIN_ALLOWED_EMAIL
  // 3. currentUser.emailVerified is strictly true
  // 4. serverVerify is present with ok === true and isAdmin === true
  // 5. valid idToken is present
  const canAccessManagement =
    authStatus === 'authenticated' &&
    currentUser !== null &&
    (currentUser.email || '').toLowerCase().trim() === ADMIN_ALLOWED_EMAIL &&
    currentUser.emailVerified === true &&
    serverVerify !== null &&
    serverVerify.ok === true &&
    serverVerify.isAdmin === true &&
    Boolean(idToken);

  return (
    <div className="min-h-screen bg-[#FAF9FC] py-10 sm:py-14 text-[#292532]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E8E3F0]">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#514078] hover:text-[#8B6CF6] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>신나라패키지 사이트로 돌아가기</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-[#F7F4FF] text-[#8B6CF6] border border-[#B8A1F7]/40">
              ADMIN CONTROL PANEL
            </span>
            {currentUser && (
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold border border-rose-200 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>로그아웃</span>
              </button>
            )}
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#E9E1FF] text-[#8B6CF6] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#292532]">
                신나라패키지 통합 관리자 시스템
              </h1>
              <p className="text-xs sm:text-sm text-[#777180]">
                관리자 인증 및 서버 측 다계층 권한 검증 기반 (Security Foundation)
              </p>
            </div>
          </div>
        </div>

        {/* 1. Configuration Missing State Banner */}
        {!isConfigured && (
          <div className="mb-8 p-6 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-base font-bold text-amber-900">
                  Firebase 클라이언트 환경 변수 설정 안내
                </h3>
                <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                  현재 개발 환경 또는 배포 환경에 Firebase 필수 환경 변수가 아직 입력되지 않았습니다.
                  실제 관리자 로그인을 진행하려면 아래 항목을 환경 변수로 설정해야 합니다.
                </p>
              </div>
            </div>

            <div className="bg-white/80 rounded-xl p-4 border border-amber-200 text-xs font-mono space-y-2">
              <div className="font-bold text-amber-900 mb-1">
                [필요한 공개 클라이언트 환경 변수] (Netlify Site Settings 또는 .env)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded bg-amber-50/60 border border-amber-100">
                  <span className="font-bold">VITE_FIREBASE_API_KEY:</span> Firebase 웹 API 키
                </div>
                <div className="p-2 rounded bg-amber-50/60 border border-amber-100">
                  <span className="font-bold">VITE_FIREBASE_AUTH_DOMAIN:</span> Firebase 인증 도메인
                </div>
                <div className="p-2 rounded bg-amber-50/60 border border-amber-100">
                  <span className="font-bold">VITE_FIREBASE_PROJECT_ID:</span> Firebase 프로젝트 ID
                </div>
                <div className="p-2 rounded bg-amber-50/60 border border-amber-100">
                  <span className="font-bold">VITE_FIREBASE_APP_ID:</span> Firebase App ID
                </div>
              </div>
            </div>

            <div className="text-[11px] text-amber-800 leading-relaxed">
              💡 <strong>안내:</strong> 비밀번호나 비공개 Secret(예: Cloudinary Secret, Service Account 키)은 브라우저 코드나 VITE_ 환경 변수에 절대 넣지 마시고, Netlify 전용 서버 환경 변수로만 보관해야 안전합니다.
            </div>
          </div>
        )}

        {/* 2. Loading State */}
        {authStatus === 'loading' && (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#8B6CF6]" />
            <span className="text-xs font-medium text-[#777180]">
              관리자 인증 상태를 확인하는 중입니다...
            </span>
          </div>
        )}

        {/* 3. Server Verifying State */}
        {authStatus === 'server_verifying' && (
          <div className="py-20 flex flex-col items-center justify-center gap-4 max-w-md mx-auto text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#E9E1FF] text-[#8B6CF6] flex items-center justify-center animate-pulse">
              <Server className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#292532]">
                서버리스 토큰 검증 진행 중
              </h3>
              <p className="text-xs text-[#777180] mt-1.5 leading-relaxed">
                Netlify 서버리스 함수(<code>/.netlify/functions/verify-admin</code>)와 Google Identity Toolkit을 통해 토큰의 진위 여부 및 관리자 권한을 검증하고 있습니다...
              </p>
            </div>
            <Loader2 className="w-5 h-5 animate-spin text-[#8B6CF6]" />
          </div>
        )}

        {/* 4. Unauthenticated State (Login Form) */}
        {authStatus === 'unauthenticated' && (
          <div className="max-w-md mx-auto">
            <div className="bg-white border border-[#E8E3F0] rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#F7F4FF] text-[#8B6CF6] flex items-center justify-center mx-auto mb-3">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-[#292532]">관리자 로그인</h2>
                <p className="text-xs text-[#777180] mt-1">
                  신나라패키지 공식 관리자 계정으로 로그인해 주세요.
                </p>
              </div>

              {loginError && (
                <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span className="leading-snug">{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} noValidate className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#514078] mb-1.5">
                    관리자 이메일
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#777180] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => {
                        setEmailInput(e.target.value);
                        if (loginError) setLoginError('');
                      }}
                      placeholder="admin@example.com"
                      autoComplete="username"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-[#F7F4FF]/60 border border-[#E8E3F0] rounded-xl text-xs sm:text-sm text-[#292532] focus:outline-none focus:border-[#8B6CF6] focus:bg-white transition-colors"
                    />
                  </div>
                  <div className="text-[11px] text-[#777180] mt-1 font-mono">
                    * 지정 관리자: {ADMIN_ALLOWED_EMAIL}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#514078] mb-1.5">
                    비밀번호
                  </label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-[#777180] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={passwordInput}
                      onChange={(e) => {
                        setPasswordInput(e.target.value);
                        if (loginError) setLoginError('');
                      }}
                      placeholder="비밀번호 입력"
                      autoComplete="current-password"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-[#F7F4FF]/60 border border-[#E8E3F0] rounded-xl text-xs sm:text-sm text-[#292532] focus:outline-none focus:border-[#8B6CF6] focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-[#8B6CF6] hover:bg-[#7854f3] active:bg-[#6842e4] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>인증 확인 중...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>관리자 로그인</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-6 pt-5 border-t border-[#E8E3F0] text-[11px] text-[#777180] text-center leading-relaxed">
                일반 방문자는 관리자 화면에 접근할 수 없으며, 모든 변경 시도는 서버 측과 Firestore 보안 규칙에 의해 엄격히 차단됩니다.
              </div>
            </div>
          </div>
        )}

        {/* 5. Unauthorized State (Logged in with non-admin email) */}
        {authStatus === 'unauthorized' && (
          <div className="max-w-md mx-auto">
            <div className="bg-white border border-rose-200 rounded-2xl p-6 sm:p-8 text-center space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-[#292532]">접근 권한이 없습니다</h2>
              <p className="text-xs text-[#777180] leading-relaxed">
                현재 로그인된 계정(<strong>{currentUser?.email}</strong>)은 신나라패키지 공식 관리자 권한이 부여되지 않았습니다.
              </p>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-[#514078]">
                허용 관리자: {ADMIN_ALLOWED_EMAIL}
              </div>
              <div className="pt-2 flex justify-center gap-2">
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  로그아웃 후 관리자 계정으로 로그인
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 6. Email Unverified State (Access strictly blocked, resend email available) */}
        {authStatus === 'email_unverified' && (
          <div className="max-w-lg mx-auto">
            <div className="bg-white border border-amber-200 rounded-2xl p-6 sm:p-8 text-center space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <Mail className="w-6 h-6" />
              </div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-mono font-bold">
                이메일 인증 필수 (email_verified)
              </div>
              <h2 className="text-xl font-bold text-[#292532]">
                이메일 인증이 완료되지 않았습니다
              </h2>
              <p className="text-xs text-[#514078] leading-relaxed max-w-md mx-auto">
                지정된 관리자 계정(<strong>{currentUser?.email}</strong>)으로 로그인되었으나, 이메일 주소 인증이 아직 완료되지 않았습니다. 보안 정책 및 Firestore 보안 규칙에 따라 <strong>이메일 인증이 완료된 관리자만 작업 사례 관리 시스템에 접근할 수 있습니다.</strong>
              </p>

              <div className="p-4 bg-amber-50/80 rounded-xl border border-amber-200 text-left text-xs space-y-2 text-amber-900">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>진행 방법:</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-[11px] text-amber-800 leading-relaxed">
                  <li>수신함에서 Firebase 인증 확인 메일을 확인하고 인증 링크를 클릭해 주세요.</li>
                  <li>메일이 오지 않은 경우 아래 <strong>[인증 이메일 재발송]</strong> 버튼을 클릭하세요.</li>
                  <li>인증 링크를 클릭한 후 <strong>[인증 완료 후 새로고침]</strong> 버튼을 누르면 관리자 화면으로 진입합니다.</li>
                </ol>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleResendEmail}
                  disabled={verificationSent}
                  className="w-full sm:w-auto px-4 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  {verificationSent ? '인증 메일이 전송되었습니다' : '인증 이메일 재발송'}
                </button>
                <button
                  onClick={handleRefreshAuth}
                  disabled={isRefreshing}
                  className="w-full sm:w-auto px-4 py-2.5 bg-[#8B6CF6] hover:bg-[#7854f3] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span>인증 완료 후 새로고침 (계정 갱신)</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-[#514078] rounded-xl text-xs font-semibold transition-colors"
                >
                  로그아웃
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 7. Server Verification Failed State (Access strictly blocked, retry guidance) */}
        {authStatus === 'server_failed' && (
          <div className="max-w-lg mx-auto">
            <div className="bg-white border border-rose-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[11px] font-mono font-bold mb-2">
                  서버리스 검증 실패 (Access Blocked)
                </div>
                <h2 className="text-xl font-bold text-[#292532]">
                  서버 측 관리자 검증에 실패했습니다
                </h2>
                <p className="text-xs text-[#777180] mt-1.5 leading-relaxed">
                  신나라패키지 보안 시스템은 클라이언트 로그인 결과만으로 관리자 화면 접근을 허용하지 않으며, Netlify 서버리스 함수의 암호학적 토큰 검증(HTTP 200, isAdmin)을 필수로 요구합니다.
                </p>
              </div>

              {/* Error Message Box */}
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-mono text-rose-800 leading-relaxed">
                <span className="font-bold block mb-1">검증 응답 내용:</span>
                {serverVerify?.message || '서버리스 검증 함수에 연결할 수 없습니다. (배포 환경 또는 Netlify Dev에서 동작)'}
              </div>

              {/* Architecture & Troubleshooting Notice */}
              <div className="p-4 rounded-xl bg-slate-50 border border-[#E8E3F0] text-xs text-[#514078] space-y-2 leading-relaxed">
                <div className="font-bold text-[#292532] flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-[#8B6CF6]" />
                  <span>보안 아키텍처 및 조치 안내:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-[#777180]">
                  <li>서버 검증이 완료되지 않은 상태에서는 작업 사례 등록, 수정, 삭제 등의 관리자 기능이 엄격히 차단됩니다.</li>
                  <li><strong>로컬 개발 환경:</strong> Vite 단독 실행 시 Netlify 서버리스 함수가 없을 수 있으며, <code>netlify dev</code> 환경 또는 배포 환경에서 정상 검증됩니다.</li>
                  <li><strong>배포 환경:</strong> Netlify 서버 환경 변수(<code>ADMIN_ALLOWED_EMAIL</code>, <code>FIREBASE_PROJECT_ID</code>, <code>FIREBASE_API_KEY</code>)가 올바르게 설정되어 있는지 확인해 주세요.</li>
                  <li>실제 Firestore 데이터베이스 쓰기 권한은 백엔드의 <strong>Firestore Security Rules</strong>에 의해 독립적으로 강제됩니다.</li>
                </ul>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleRefreshAuth}
                  disabled={isRefreshing}
                  className="w-full sm:w-auto px-5 py-2.5 bg-[#8B6CF6] hover:bg-[#7854f3] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span>서버 토큰 재검증 시도</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-[#514078] rounded-xl text-xs font-semibold transition-colors"
                >
                  로그아웃
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 8. Authenticated State: Strict Condition Passed (Admin Dashboard Shell) */}
        {canAccessManagement && currentUser && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Admin Info Banner */}
            <div className="bg-white border border-[#E8E3F0] rounded-2xl p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E3F0]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#E9E1FF] text-[#8B6CF6] flex items-center justify-center font-bold font-mono text-base">
                    {currentUser.email?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-[#292532]">
                        {currentUser.email}
                      </span>
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        서버 검증 완료된 관리자
                      </span>
                    </div>
                    <div className="text-xs text-[#777180] font-mono mt-0.5">
                      UID: {currentUser.uid} · 이메일 인증: 완료 (email_verified: true)
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRefreshAuth}
                    disabled={isRefreshing}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F7F4FF] hover:bg-[#E9E1FF] text-[#514078] text-xs font-semibold border border-[#E8E3F0] transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                    <span>서버 토큰 재검증</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold border border-rose-200 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>로그아웃</span>
                  </button>
                </div>
              </div>

              {/* Security Status Ribbon */}
              <div className="mt-4 pt-1 flex flex-wrap items-center justify-between gap-2 text-xs text-[#514078]">
                <div className="flex items-center gap-2">
                  {serverVerify?.ok && serverVerify?.isAdmin ? (
                    <>
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>
                        서버 검증(Netlify Function HTTP 200, isAdmin: true) 통과 확인
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>
                        서버 검증: {serverVerify ? '실패' : '검증 전'}
                      </span>
                    </>
                  )}
                </div>
                <span className="text-[11px] font-mono text-[#777180]">
                  * Firestore 보안 규칙은 Firebase 콘솔에서 실제 게시(Deploy) 상태를 직접 확인해야 합니다.
                </span>
              </div>
            </div>

            {/* Admin Sub-Navigation */}
            <div className="flex items-center gap-2 border-b border-[#E8E3F0] pb-2">
              <button
                onClick={() => setAdminTab('portfolio')}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  adminTab === 'portfolio'
                    ? 'bg-[#8B6CF6] text-white shadow-sm'
                    : 'bg-white text-[#514078] border border-[#E8E3F0] hover:bg-[#F7F4FF]'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>작업 사례 (포트폴리오) 관리</span>
              </button>
              <button
                onClick={() => setAdminTab('security')}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  adminTab === 'security'
                    ? 'bg-[#8B6CF6] text-white shadow-sm'
                    : 'bg-white text-[#514078] border border-[#E8E3F0] hover:bg-[#F7F4FF]'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>보안 및 서버 검증 현황</span>
              </button>
            </div>

            {/* Tab 1: Portfolio Management (Phase 1) - ONLY rendered when strictly authorized */}
            {adminTab === 'portfolio' && (
              <PortfolioManager
                adminEmail={currentUser.email}
                emailVerified={currentUser.emailVerified}
              />
            )}

            {/* Tab 2: Security & Status Verification */}
            {adminTab === 'security' && (
              <div className="space-y-6">
                {/* Server-Side & Security Verification Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Card 1: Serverless Netlify Function Verification */}
                  <div className="bg-white border border-[#E8E3F0] rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-2.5 mb-3 text-sm font-bold text-[#292532]">
                      <Server className="w-4 h-4 text-[#8B6CF6]" />
                      <span>서버리스 토큰 검증 상태 (Netlify Function)</span>
                    </div>
                    <div className="space-y-2 text-xs leading-relaxed">
                      <div className="flex items-center justify-between p-2 rounded-lg bg-[#FAF9FC] border border-[#E8E3F0]">
                        <span className="text-[#777180]">엔드포인트:</span>
                        <span className="font-mono text-[#514078]">/.netlify/functions/verify-admin</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-[#FAF9FC] border border-[#E8E3F0]">
                        <span className="text-[#777180]">서버 검증 결과:</span>
                        {!serverVerify ? (
                          <span className="text-[#777180] font-medium font-mono text-[11px]">
                            검증 전
                          </span>
                        ) : serverVerify.ok && serverVerify.isAdmin ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-1 font-mono">
                            <CheckCircle2 className="w-3.5 h-3.5" /> 승인됨 (HTTP 200, isAdmin: true)
                          </span>
                        ) : (
                          <span className="text-rose-700 font-bold flex items-center gap-1 font-mono text-[11px]">
                            <AlertTriangle className="w-3.5 h-3.5" /> 검증 실패 ({serverVerify.message || '인증 불가'})
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-[#FAF9FC] border border-[#E8E3F0]">
                        <span className="text-[#777180]">이메일 인증 상태:</span>
                        {currentUser?.emailVerified ? (
                          <span className="text-emerald-700 font-bold font-mono">
                            인증 완료 (emailVerified: true)
                          </span>
                        ) : (
                          <span className="text-amber-700 font-medium font-mono text-[11px]">
                            미인증 (emailVerified: false)
                          </span>
                        )}
                      </div>
                      {serverVerify?.message && (
                        <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-[11px] font-mono text-[#514078]">
                          <span className="text-[#777180] block font-sans font-semibold mb-0.5">서버 메시지:</span>
                          {serverVerify.message}
                        </div>
                      )}
                      <div className="text-[11px] text-[#777180] pt-1">
                        * 현재 로그인 세션에서 Netlify Function이 반환한 검증 결과를 실시간으로 표시합니다.
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Firestore Security Rules Status */}
                  <div className="bg-white border border-[#E8E3F0] rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-2.5 mb-3 text-sm font-bold text-[#292532]">
                      <Database className="w-4 h-4 text-[#8B6CF6]" />
                      <span>Firestore 보안 규칙 상태 (firestore.rules)</span>
                    </div>
                    <div className="space-y-2 text-xs leading-relaxed">
                      <div className="flex items-center justify-between p-2 rounded-lg bg-[#FAF9FC] border border-[#E8E3F0]">
                        <span className="text-[#777180]">규칙 정의 파일:</span>
                        <span className="font-mono text-[#514078]">firestore.rules</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-[#FAF9FC] border border-[#E8E3F0]">
                        <span className="text-[#777180]">실제 규칙 상태:</span>
                        <span className="text-amber-800 font-bold font-mono text-[11px] bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> 게시 및 검증 필요
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-[#FAF9FC] border border-[#E8E3F0]">
                        <span className="text-[#777180]">클라이언트 직접 확인 여부:</span>
                        <span className="text-[#777180] font-mono text-[11px]">
                          브라우저에서 확인 불가
                        </span>
                      </div>
                      <div className="p-3 rounded-lg bg-amber-50/80 border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
                        <div className="font-bold flex items-center gap-1 mb-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>콘솔 확인 안내:</span>
                        </div>
                        브라우저 환경에서는 실제 Firebase 프로젝트에 배포된 보안 규칙의 동작 여부를 직접 조회할 수 없습니다. 비공개 자료 격리 및 관리자 권한 제어가 실제로 활성화되어 있는지 <strong>Firebase 콘솔 (Firestore Database &gt; Rules)</strong>에서 실제 게시 상태와 규칙 내용을 직접 확인해야 합니다.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Admin Modules Roadmap */}
                <div className="bg-white border border-[#E8E3F0] rounded-2xl p-6 shadow-sm">
                  <h3 className="text-base font-bold text-[#292532] mb-1">
                    통합 관리자 시스템 구축 로드맵 (단계별 현황)
                  </h3>
                  <p className="text-xs text-[#777180] mb-5">
                    안전한 점진적 구축 원칙에 따라 보안 인증 기반을 먼저 확정하고 실제 관리 모듈을 연결합니다.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-emerald-900">1단계: 견적 문의 폼 정돈</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          완료 ✅
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-800 leading-relaxed">
                        Netlify Forms 이메일 중복 요약 필드 제거 및 한국어 필드 안정화 완료.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl border border-purple-300 bg-[#F7F4FF]">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-[#514078]">1차 구현: 작업 사례 포트폴리오 관리</span>
                        <span className="px-2 py-0.5 rounded-full bg-[#E9E1FF] text-[#8B6CF6] text-[10px] font-bold">
                          현재 구현됨 🖼️
                        </span>
                      </div>
                      <p className="text-[11px] text-[#514078] leading-relaxed">
                        Firestore portfolio 컬렉션 CRUD, 실시간 공개/비공개 전환, 노출 순서 변경, 소프트 삭제 및 방문자 화면 연동.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl border border-[#E8E3F0] bg-slate-50 opacity-80">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-[#292532]">다음 단계: Cloudinary 서명 업로드</span>
                        <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-medium">
                          다음 예정 ☁️
                        </span>
                      </div>
                      <p className="text-[11px] text-[#777180] leading-relaxed">
                        Netlify 서버리스 서명 발급을 통한 안전한 Cloudinary 직접 이미지 파일 업로드.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl border border-[#E8E3F0] bg-slate-50 opacity-80">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-[#292532]">다음 단계: 콘텐츠 & 디자인 테마 관리자</span>
                        <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-medium">
                          다음 예정 🎨
                        </span>
                      </div>
                      <p className="text-[11px] text-[#777180] leading-relaxed">
                        문구, 색상, 글꼴, 섹션 순서 실시간 조정 및 무배포 즉시 반영 구현 예정.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
