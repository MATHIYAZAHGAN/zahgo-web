import { Injectable } from '@angular/core';

export const HTTP_FALLBACK_MESSAGES: Record<number, string> = {
  400: 'The request could not be processed. Please review your details and try again.',
  404: 'The requested information could not be found. It may have been removed.',
  408: 'The request timed out. Please try again.',
  409: 'This action conflicts with an existing record. Please refresh and try again.',
  422: 'Some information is missing or invalid. Please double-check and try again.',
  500: 'Something went wrong on our side. Please try again in a moment.',
  502: 'We are experiencing temporary issues. Please try again shortly.',
  503: 'We are briefly unavailable. Please check back in a moment.',
  504: 'The server took too long to respond. Please try again.',
  0: 'Unable to reach the server. Please check your internet connection and try again.'
};

/**
 * Sanitizes a raw backend / library error message into something
 * safe and human-friendly. Prevents stack traces, file paths, URLs
 * and technical jargon from leaking to the UI.
 */
function sanitize(raw: string): string {
  let text = raw.trim();

  // Strip HTML tags to avoid any markup leaking into the UI
  text = text.replace(/<[^>]*>/g, ' ');

  // Drop anything that looks like a stack trace (contains "at " + function frames)
  if (text.match(/( at )? [a-zA-Z0-9_$.]+\([^)]*\)/g) && / at .*\(.*:.*\)/.test(text)) {
    text = text.split('\n')[0];
  }

  // Remove URLs, file paths and windows paths
  text = text
    .replace(/https?:\/\/\S+/gi, '')
    .replace(/[A-Za-z]:\\[^\s]+/g, '')
    .replace(/[^\s:/]+\.\w{2,5}(?:\/|\\|$)/g, '');

  // Collapse whitespace and newlines into single spaces
  text = text.replace(/\s+/g, ' ').trim();

  // Remove quoted code-like segments (keys, hex ids, tokens)
  text = text.replace(/["'][^"']*["']/g, '').trim();

  // Cap length to keep toasts compact
  if (text.length > 160) {
    text = text.substring(0, 160).trimEnd() + '…';
  }

  return text;
}

/**
 * Maps any thrown error into a safe, user-friendly message.
 */
export function getFriendlyErrorMessage(error: unknown, fallback: string): string {
  const httpError = error as any;

  // Status-based fallback takes priority when we have nothing usable
  if (httpError?.status !== undefined && HTTP_FALLBACK_MESSAGES[httpError.status]) {
    const raw = httpError?.error?.message || httpError?.error?.title || '';
    if (raw) {
      const cleaned = sanitize(String(raw));
      if (cleaned) return cleaned;
    }
    return HTTP_FALLBACK_MESSAGES[httpError.status];
  }

  // Firebase / library style errors carry a `code` + `message`
  const candidates = [
    httpError?.error?.message,
    httpError?.error?.title,
    httpError?.message,
    httpError?.code
  ];

  for (const candidate of candidates) {
    if (candidate && typeof candidate === 'string') {
      const cleaned = sanitize(candidate);
      if (cleaned) return cleaned;
    }
  }

  return fallback;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorMessageService {
  getFriendlyMessage(error: unknown, fallback: string): string {
    return getFriendlyErrorMessage(error, fallback);
  }
}