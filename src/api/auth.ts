import type { ApiResponse, LoginStatus } from '../types/index.ts';
import { setAuth, clearAuth } from '../store/config.ts';

const BASE_URL = 'https://www.spusu.at/imoscmsapi';

const DEFAULT_HEADERS: Record<string, string> = {
  'accept': '*/*',
  'accept-language': 'en,de;q=0.9',
  'content-type': 'application/json',
  'saleschannel': 'Homepage',
  'internalusertoken': '',
  'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',
};

/**
 * Request a TAN code to be sent via SMS to the given phone number
 */
export async function requestTan(phoneNumber: string): Promise<ApiResponse<void>> {
  try {
    const response = await fetch(`${BASE_URL}/authentication/tan/`, {
      method: 'POST',
      headers: DEFAULT_HEADERS,
      body: JSON.stringify({ phoneNumber }),
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // Ignore JSON parse errors
      }
      return { success: false, error: errorMessage, statusCode: response.status };
    }

    return { success: true, statusCode: response.status };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Login with phone number and TAN code
 */
export async function login(
  phoneNumber: string,
  tanCode: string
): Promise<ApiResponse<LoginStatus>> {
  try {
    const response = await fetch(`${BASE_URL}/authentication/login/`, {
      method: 'POST',
      headers: DEFAULT_HEADERS,
      body: JSON.stringify({
        phoneNumberOrCustomerNumber: phoneNumber,
        secret: tanCode,
      }),
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // Ignore JSON parse errors
      }
      return { success: false, error: errorMessage, statusCode: response.status };
    }

    // Extract session ID from Set-Cookie header
    const setCookie = response.headers.get('set-cookie');
    let sessionId: string | undefined;

    if (setCookie) {
      const match = setCookie.match(/JSESSIONID=([^;]+)/);
      if (match) {
        sessionId = match[1];
      }
    }

    if (!sessionId) {
      return { success: false, error: 'No session ID received' };
    }

    // Get login status to verify
    const statusResponse = await fetch(`${BASE_URL}/user/status`, {
      method: 'GET',
      headers: {
        ...DEFAULT_HEADERS,
        'cookie': `JSESSIONID=${sessionId}`,
      },
    });

    if (!statusResponse.ok) {
      return { success: false, error: 'Failed to verify login status' };
    }

    const statusData = await statusResponse.json();
    const loginStatus: LoginStatus = statusData.loginStatus;

    if (!loginStatus.loggedIn) {
      return { success: false, error: 'Login verification failed' };
    }

    // Save session
    await setAuth({
      sessionId,
      phoneNumber,
    });

    return { success: true, data: loginStatus, statusCode: response.status };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Check current login status
 */
export async function getStatus(): Promise<ApiResponse<LoginStatus>> {
  const { getAuth } = await import('../store/config.ts');
  const auth = await getAuth();

  if (!auth?.sessionId) {
    return {
      success: true,
      data: { loggedIn: false },
    };
  }

  try {
    const response = await fetch(`${BASE_URL}/user/status`, {
      method: 'GET',
      headers: {
        ...DEFAULT_HEADERS,
        'cookie': `JSESSIONID=${auth.sessionId}`,
      },
    });

    if (!response.ok) {
      // Session might be expired
      if (response.status === 401 || response.status === 403) {
        await clearAuth();
        return { success: true, data: { loggedIn: false } };
      }
      return { success: false, error: `HTTP ${response.status}`, statusCode: response.status };
    }

    const data = await response.json();
    return { success: true, data: data.loginStatus, statusCode: response.status };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Logout - clear stored session
 */
export async function logout(): Promise<void> {
  await clearAuth();
}
