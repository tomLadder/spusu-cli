import type { ApiResponse } from '../types/index.ts';
import { getAuth } from '../store/config.ts';

const BASE_URL = 'https://www.spusu.at/imoscmsapi';

const DEFAULT_HEADERS: Record<string, string> = {
  'accept': '*/*',
  'accept-language': 'en,de;q=0.9',
  'content-type': 'application/json',
  'saleschannel': 'Homepage',
  'internalusertoken': '',
  'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',
};

export async function apiRequest<T>(
  endpoint: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: unknown;
    authenticated?: boolean;
    headers?: Record<string, string>;
  } = {}
): Promise<ApiResponse<T>> {
  const { method = 'GET', body, authenticated = true, headers = {} } = options;

  const requestHeaders: Record<string, string> = {
    ...DEFAULT_HEADERS,
    ...headers,
  };

  // Add session cookie if authenticated request
  if (authenticated) {
    const auth = await getAuth();
    if (auth?.sessionId) {
      requestHeaders['cookie'] = `JSESSIONID=${auth.sessionId}`;
    }
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    // Handle non-JSON responses (like PDF downloads)
    const contentType = response.headers.get('content-type') || '';

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      if (contentType.includes('application/json')) {
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          // Ignore JSON parse errors
        }
      }
      return {
        success: false,
        error: errorMessage,
        statusCode: response.status,
      };
    }

    // Return raw response for binary content
    if (contentType.includes('application/pdf') || contentType.includes('application/vnd')) {
      return {
        success: true,
        data: response as unknown as T,
        statusCode: response.status,
      };
    }

    // Parse JSON response
    if (contentType.includes('application/json')) {
      const data = await response.json();
      return {
        success: true,
        data: data as T,
        statusCode: response.status,
      };
    }

    // Return text for other content types
    const text = await response.text();
    return {
      success: true,
      data: text as unknown as T,
      statusCode: response.status,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Helper for downloading files (PDFs, Excel)
export async function downloadFile(
  endpoint: string,
  outputPath: string
): Promise<ApiResponse<string>> {
  const auth = await getAuth();

  const headers: Record<string, string> = {
    ...DEFAULT_HEADERS,
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  };

  if (auth?.sessionId) {
    headers['cookie'] = `JSESSIONID=${auth.sessionId}`;
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP ${response.status}`,
        statusCode: response.status,
      };
    }

    const buffer = await response.arrayBuffer();
    const fs = await import('fs/promises');
    await fs.writeFile(outputPath, Buffer.from(buffer));

    return {
      success: true,
      data: outputPath,
      statusCode: response.status,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
