interface NetlifyEvent {
  httpMethod: string;
  headers: Record<string, string | undefined>;
  body: string | null;
}

interface NetlifyResponse {
  statusCode: number;
  headers?: Record<string, string>;
  body: string;
}

/**
 * Netlify Serverless Function: verify-admin
 * Validates Firebase ID Token against Google Identity Toolkit REST API
 * and confirms that the user matches ADMIN_ALLOWED_EMAIL with email_verified === true.
 */
export const handler = async (event: NetlifyEvent): Promise<NetlifyResponse> => {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: defaultHeaders,
      body: JSON.stringify({ ok: true }),
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: defaultHeaders,
      body: JSON.stringify({ ok: false, message: 'Method Not Allowed' }),
    };
  }

  try {
    // 1. Extract Bearer token from Authorization header
    const authHeader = event.headers['authorization'] || event.headers['Authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        statusCode: 401,
        headers: defaultHeaders,
        body: JSON.stringify({
          ok: false,
          isAdmin: false,
          message: '인증 토큰이 누락되었거나 Bearer 형식이 아닙니다.',
        }),
      };
    }

    const idToken = authHeader.substring(7).trim();
    if (!idToken) {
      return {
        statusCode: 401,
        headers: defaultHeaders,
        body: JSON.stringify({
          ok: false,
          isAdmin: false,
          message: '유효한 ID 토큰이 비어 있습니다.',
        }),
      };
    }

    // 2. Strict Server Environment Configuration Check: ADMIN_ALLOWED_EMAIL
    // Must be configured in server-side environment variables only (no VITE_ fallback, no silent hardcoded fallback).
    const serverAllowedEmail = process.env.ADMIN_ALLOWED_EMAIL;
    if (!serverAllowedEmail || !serverAllowedEmail.trim()) {
      return {
        statusCode: 500,
        headers: defaultHeaders,
        body: JSON.stringify({
          ok: false,
          isAdmin: false,
          message: '서버 환경 변수 ADMIN_ALLOWED_EMAIL이 구성되지 않았습니다. (서버 보안 설정 오류)',
        }),
      };
    }
    const allowedAdminEmail = serverAllowedEmail.toLowerCase().trim();

    // 3. Resolve Firebase Web API Key from server environment
    const apiKey =
      process.env.FIREBASE_API_KEY ||
      process.env.VITE_FIREBASE_API_KEY ||
      '';

    if (!apiKey) {
      return {
        statusCode: 500,
        headers: defaultHeaders,
        body: JSON.stringify({
          ok: false,
          isAdmin: false,
          message: '서버 환경 변수 FIREBASE_API_KEY가 구성되지 않았습니다.',
        }),
      };
    }

    // 4. Audience / project verification - FIREBASE_PROJECT_ID is mandatory
    const expectedProjectId = (process.env.FIREBASE_PROJECT_ID || '').trim();
    if (!expectedProjectId) {
      return {
        statusCode: 500,
        headers: defaultHeaders,
        body: JSON.stringify({
          ok: false,
          isAdmin: false,
          message: '서버 환경 변수 FIREBASE_PROJECT_ID가 구성되지 않았습니다. (서버 보안 설정 오류)',
        }),
      };
    }

    try {
      const parts = idToken.split('.');
      if (parts.length !== 3) {
        return {
          statusCode: 401,
          headers: defaultHeaders,
          body: JSON.stringify({
            ok: false,
            isAdmin: false,
            message: '토큰 형식(JWT)이 올바르지 않습니다.',
          }),
        };
      }

      const payloadBase64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const payloadJson = Buffer.from(payloadBase64, 'base64').toString('utf8');
      const payload = JSON.parse(payloadJson);

      if (
        payload.aud !== expectedProjectId ||
        payload.iss !== `https://securetoken.google.com/${expectedProjectId}`
      ) {
        return {
          statusCode: 403,
          headers: defaultHeaders,
          body: JSON.stringify({
            ok: false,
            isAdmin: false,
            message: '토큰 발급 대상 프로젝트(Audience)가 일치하지 않습니다.',
          }),
        };
      }
    } catch {
      return {
        statusCode: 401,
        headers: defaultHeaders,
        body: JSON.stringify({
          ok: false,
          isAdmin: false,
          message: '토큰 형식(JWT)을 파싱할 수 없습니다.',
        }),
      };
    }

    // 5. Cryptographically verify token signature & validity with Google Identity Toolkit REST endpoint
    const verifyUrl = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`;
    const verifyRes = await fetch(verifyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });

    if (!verifyRes.ok) {
      const errData = await verifyRes.json().catch(() => ({}));
      const errMsg = errData.error?.message || '토큰 검증 실패';
      return {
        statusCode: 401,
        headers: defaultHeaders,
        body: JSON.stringify({
          ok: false,
          isAdmin: false,
          message: `유효하지 않거나 만료된 토큰입니다: ${errMsg}`,
        }),
      };
    }

    const verifyData = await verifyRes.json();
    const userRecord = verifyData.users?.[0];

    if (!userRecord) {
      return {
        statusCode: 401,
        headers: defaultHeaders,
        body: JSON.stringify({
          ok: false,
          isAdmin: false,
          message: '토큰에 해당하는 사용자 계정을 찾을 수 없습니다.',
        }),
      };
    }

    // 6. Extract token claims verified by Google server
    const tokenEmail = (userRecord.email || '').toLowerCase().trim();
    const emailVerified = Boolean(userRecord.emailVerified);

    // 7. Check 1: Must match server-authoritative ADMIN_ALLOWED_EMAIL
    if (tokenEmail !== allowedAdminEmail) {
      return {
        statusCode: 403,
        headers: defaultHeaders,
        body: JSON.stringify({
          ok: false,
          isAdmin: false,
          message: '신나라패키지 관리자 권한이 부여되지 않은 계정입니다.',
        }),
      };
    }

    // 8. Check 2: Mandatory email verification check (emailVerified must be true)
    if (!emailVerified) {
      return {
        statusCode: 403,
        headers: defaultHeaders,
        body: JSON.stringify({
          ok: false,
          isAdmin: false,
          message: '이메일 인증(email_verified)이 완료되지 않은 계정입니다. 메일함에서 인증 링크를 클릭한 후 다시 시도해 주세요.',
        }),
      };
    }

    // 9. All security checks passed: Return success response
    return {
      statusCode: 200,
      headers: defaultHeaders,
      body: JSON.stringify({
        ok: true,
        isAdmin: true,
        email: tokenEmail,
        emailVerified: true,
        uid: userRecord.localId,
        message: '서버 측 관리자 권한 및 토큰 검증이 성공적으로 완료되었습니다.',
      }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      headers: defaultHeaders,
      body: JSON.stringify({
        ok: false,
        isAdmin: false,
        message: `서버 내부 오류: ${error?.message || '알 수 없는 오류'}`,
      }),
    };
  }
};
