/**
 * 后端 API 客户端
 *
 * 封装对 aikitsbox-server 的所有请求
 * 当前会员功能关闭时，所有请求会直接返回错误
 */
import { FEATURES } from './config';

const BASE = FEATURES.apiBase;

function getToken(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('member_token') || '';
}

async function request(path: string, options: RequestInit = {}): Promise<any> {
  if (!FEATURES.membership) {
    throw new Error('会员系统尚未开放');
  }
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...((options.headers as any) || {}) };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || '请求失败');
  return data;
}

// ===== Auth =====
export async function register(email: string, password: string, nickname?: string) {
  const data = await request('/api/auth/register', { method: 'POST', body: JSON.stringify({ email, password, nickname }) });
  if (data.token) localStorage.setItem('member_token', data.token);
  return data;
}

export async function login(email: string, password: string) {
  const data = await request('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  if (data.token) localStorage.setItem('member_token', data.token);
  return data;
}

export function logout() {
  localStorage.removeItem('member_token');
  window.location.reload();
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

// ===== Member =====
export async function getMemberInfo() {
  return request('/api/member/me');
}

export async function recharge(planId: string, amount: number, tokens: number) {
  return request('/api/member/recharge', { method: 'POST', body: JSON.stringify({ planId, amount, tokens }) });
}

export async function getRechargeStatus(orderId: number) {
  return request(`/api/member/recharge/${orderId}`);
}

export async function getUsageRecords() {
  return request('/api/member/records');
}

// ===== AI =====
export async function aiChat(messages: { role: string; content: string }[], toolId: string, maxTokens = 2000) {
  return request('/api/ai/chat', {
    method: 'POST',
    body: JSON.stringify({ messages, toolId, maxTokens }),
  });
}
