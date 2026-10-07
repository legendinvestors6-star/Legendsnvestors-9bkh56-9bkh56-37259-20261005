import { supabase } from './supabase';

export function getCurrentUser() {
  try {
    const r = localStorage.getItem('current_user') || localStorage.getItem('currentUser');
    return r ? JSON.parse(r) : null;
  } catch { return null; }
}
export function setCurrentUser(u: any) {
  localStorage.setItem('current_user', JSON.stringify(u));
  localStorage.setItem('currentUser', JSON.stringify(u));
}
export function logout() {
  localStorage.removeItem('current_user');
  localStorage.removeItem('currentUser');
}
export const getUser = getCurrentUser;
export const getUsers = async () => { const { data } = await supabase.from('users').select('*'); return data || []; };
export const loginUser = async (phone: string, password: string) => { const { data } = await supabase.from('users').select('*').eq('phone', phone).eq('password', password).single(); if (data) setCurrentUser(data); return data; };
export const createUser = async (u: any) => { const { data } = await supabase.from('users').insert(u).select().single(); return data; };
export const registerUser = createUser;

// HOMEPAGE - ALL 5 NEEDED EXPORTS - NO DUPLICATES
export const getUserProducts = () => { try { return JSON.parse(localStorage.getItem('userProducts') || '[]'); } catch { return []; } };
export const creditDailyIncome = async () => true;
export const formatUGX = (amount: number | string) => `${(Number(amount) || 0).toLocaleString()} UGX`;
export const formatCurrency = formatUGX;
export const formatMoney = formatUGX;
export const getNextPayoutMs = () => { const now = Date.now(); const t = new Date(); t.setHours(24,0,0,0); return t.getTime() - now; };
export const getNextPayout = () => new Date(Date.now() + getNextPayoutMs()).toISOString();

// GIFT & PASSWORD RESET
export const redeemGiftCode = async (uid: string, code: string) => {
  const clean = code.trim().toUpperCase();
  const { data: gift } = await supabase.from('gift_codes').select('*').eq('code', clean).single();
  if (!gift) return { success: false, message: 'Invalid code' };
  if (gift.is_used) return { success: false, message: 'Already used' };
  const { data: user } = await supabase.from('users').select('*').eq('id', uid).single();
  if (!user) return { success: false, message: 'User not found' };
  await supabase.from('users').update({ balance: Number(user.balance) + Number(gift.amount) }).eq('id', uid);
  await supabase.from('gift_codes').update({ is_used: true, used_by: user.phone }).eq('id', gift.id);
  return { success: true, message: `Added ${gift.amount} UGX` };
};
export const getGiftCodes = async () => { const { data } = await supabase.from('gift_codes').select('*'); return data || []; };
export const createPasswordReset = (d: any) => { const a = JSON.parse(localStorage.getItem('passwordResets') || '[]'); a.push({ ...d, status: 'pending', id: Date.now().toString() }); localStorage.setItem('passwordResets', JSON.stringify(a)); return { id: '1' }; };
export const getPasswordResetStatus = (p: string) => { try { const a = JSON.parse(localStorage.getItem('passwordResets') || '[]'); return a.find((r: any) => r.phone === p) || null; } catch { return null; } };
export const getPasswordResets = () => [];
export const approvePasswordReset = () => true;
export const rejectPasswordReset = () => true;
export const storage = { get: (k: string) => localStorage.getItem(k), set: (k: string, v: string) => localStorage.setItem(k, v) };
