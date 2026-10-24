import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth, getAuthInstance, isFirebaseConfigured, ADMIN_ALLOWED_EMAIL } from './firebase';
import { AdminUser, AdminAuthStatus } from '../types';

export interface ServerVerifyResult {
  ok: boolean;
  isAdmin: boolean;
  email?: string;
  emailVerified?: boolean;
  message?: string;
}

/**
 * Maps Firebase Auth error codes to user-friendly Korean messages.
 */
export const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
      return '이메일 또는 비밀번호가 올바르지 않습니다. 다시 확인해 주세요.';
    case 'auth/user-not-found':
      return '등록되지 않은 관리자 계정입니다.';
    case 'auth/invalid-email':
      return '유효하지 않은 이메일 형식입니다.';
    case 'auth/user-disabled':
      return '해당 계정은 비활성화되었습니다. Firebase 콘솔에서 확인해 주세요.';
    case 'auth/too-many-requests':
      return '로그인 시도가 너무 많이 실패했습니다. 잠시 후 다시 시도해 주세요.';
    case 'auth/network-request-failed':
      return '네트워크 연결이 불안정합니다. 인터넷 상태를 확인해 주세요.';
    case 'auth/missing-password':
      return '비밀번호를 입력해 주세요.';
    default:
      return `인증 오류가 발생했습니다. (${errorCode})`;
  }
};

/**
 * Sign in admin user with email and password.
 */
export const loginAdmin = async (email: string, pass: string): Promise<AdminUser> => {
  const currentAuth = auth || getAuthInstance();
  if (!isFirebaseConfigured() || !currentAuth) {
    throw new Error('CONFIG_MISSING: Firebase 환경 설정이 누락되었습니다.');
  }

  const trimmedEmail = email.trim().toLowerCase();
  console.log('[adminAuth] Firebase signInWithEmailAndPassword 호출 시작:', trimmedEmail);
  const credential = await signInWithEmailAndPassword(currentAuth, trimmedEmail, pass);
  const user = credential.user;
  console.log('[adminAuth] Firebase 인증 성공. UID:', user.uid, 'emailVerified:', user.emailVerified);

  return {
    uid: user.uid,
    email: user.email,
    emailVerified: user.emailVerified,
    displayName: user.displayName,
  };
};

/**
 * Sign out the currently logged in admin.
 */
export const logoutAdmin = async (): Promise<void> => {
  if (!auth) return;
  await signOut(auth);
};

/**
 * Requests sending an email verification link to the current user.
 */
export const resendVerificationEmail = async (): Promise<void> => {
  if (!auth?.currentUser) {
    throw new Error('로그인된 사용자가 없습니다.');
  }
  await sendEmailVerification(auth.currentUser);
};

/**
 * Calls Netlify Serverless Function to cryptographically verify Firebase ID token and admin privileges.
 */
export const verifyAdminWithServer = async (idToken: string): Promise<ServerVerifyResult> => {
  try {
    console.log('[adminAuth] /.netlify/functions/verify-admin 서버리스 함수 호출 시작...');
    const res = await fetch('/.netlify/functions/verify-admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
      },
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      console.warn('[adminAuth] 서버리스 검증 응답 오류 (HTTP ' + res.status + '):', data);
      return {
        ok: false,
        isAdmin: false,
        message: data.message || `서버 검증 실패 (HTTP ${res.status})`,
      };
    }

    const data = await res.json();
    console.log('[adminAuth] 서버리스 검증 응답 성공:', data);
    return {
      ok: true,
      isAdmin: Boolean(data.isAdmin),
      email: data.email,
      emailVerified: data.emailVerified,
      message: data.message,
    };
  } catch (err: any) {
    console.error('[adminAuth] 서버리스 검증 요청 실패:', err);
    return {
      ok: false,
      isAdmin: false,
      message: '서버리스 검증 함수에 연결할 수 없습니다. (배포 환경 또는 Netlify Dev에서 동작)',
    };
  }
};

/**
 * Subscribes to Firebase Auth state changes with comprehensive multi-layer verification:
 * 1. Confirms user is logged in
 * 2. Confirms email matches the designated ADMIN_ALLOWED_EMAIL
 * 3. Confirms email_verified === true (blocks unauthorized / unverified users from gaining 'authenticated')
 * 4. Obtains Firebase ID token and performs cryptographic server verification via Netlify Function
 * 5. Only delivers 'authenticated' when:
 *    - target email matches
 *    - emailVerified is true
 *    - server verification returns ok === true && isAdmin === true
 */
export const subscribeAdminAuth = (
  callback: (
    status: AdminAuthStatus,
    user: AdminUser | null,
    idToken?: string,
    serverVerify?: ServerVerifyResult | null
  ) => void
): (() => void) => {
  if (!isFirebaseConfigured() || !auth) {
    callback('unauthenticated', null, undefined, null);
    return () => {};
  }

  let authSequence = 0;

  return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
    const seq = ++authSequence;

    if (!firebaseUser) {
      callback('unauthenticated', null, undefined, null);
      return;
    }

    const email = (firebaseUser.email || '').toLowerCase().trim();
    const isTargetEmail = email === ADMIN_ALLOWED_EMAIL;

    const adminUser: AdminUser = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      emailVerified: firebaseUser.emailVerified,
      displayName: firebaseUser.displayName,
    };

    // Step 1: Check designated administrator email
    if (!isTargetEmail) {
      callback('unauthorized', adminUser, undefined, null);
      return;
    }

    // Step 2: Check email verification status
    if (!firebaseUser.emailVerified) {
      callback('email_unverified', adminUser, undefined, null);
      return;
    }

    // Step 3: Enter server verification phase
    callback('server_verifying', adminUser, undefined, null);

    try {
      const idToken = await firebaseUser.getIdToken();
      if (seq !== authSequence) return;

      const serverResult = await verifyAdminWithServer(idToken);
      if (seq !== authSequence) return;

      // Step 4: Strict server check - both ok and isAdmin must be strictly true
      if (serverResult.ok && serverResult.isAdmin) {
        callback('authenticated', adminUser, idToken, serverResult);
      } else {
        callback('server_failed', adminUser, undefined, serverResult);
      }
    } catch (err: any) {
      if (seq !== authSequence) return;
      callback('server_failed', adminUser, undefined, {
        ok: false,
        isAdmin: false,
        message: `서버 검증 처리 중 오류가 발생했습니다: ${err?.message || '알 수 없는 오류'}`,
      });
    }
  });
};

/**
 * Manually re-checks the current user's state by reloading Firebase Auth user
 * and re-running server verification (useful when email has just been verified in inbox).
 */
export const refreshAdminAuthState = async (
  callback: (
    status: AdminAuthStatus,
    user: AdminUser | null,
    idToken?: string,
    serverVerify?: ServerVerifyResult | null
  ) => void
): Promise<void> => {
  if (!auth?.currentUser) {
    callback('unauthenticated', null, undefined, null);
    return;
  }

  callback('loading', null, undefined, null);

  try {
    await auth.currentUser.reload();
    const firebaseUser = auth.currentUser;

    const email = (firebaseUser.email || '').toLowerCase().trim();
    const isTargetEmail = email === ADMIN_ALLOWED_EMAIL;

    const adminUser: AdminUser = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      emailVerified: firebaseUser.emailVerified,
      displayName: firebaseUser.displayName,
    };

    if (!isTargetEmail) {
      callback('unauthorized', adminUser, undefined, null);
      return;
    }

    if (!firebaseUser.emailVerified) {
      callback('email_unverified', adminUser, undefined, null);
      return;
    }

    callback('server_verifying', adminUser, undefined, null);

    const idToken = await firebaseUser.getIdToken(true);
    const serverResult = await verifyAdminWithServer(idToken);

    if (serverResult.ok && serverResult.isAdmin) {
      callback('authenticated', adminUser, idToken, serverResult);
    } else {
      callback('server_failed', adminUser, undefined, serverResult);
    }
  } catch (err: any) {
    callback('server_failed', null, undefined, {
      ok: false,
      isAdmin: false,
      message: `인증 갱신 중 오류가 발생했습니다: ${err?.message || '알 수 없는 오류'}`,
    });
  }
};
