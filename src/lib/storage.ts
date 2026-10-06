import { supabase } from './supabase';

// CURRENT USER
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
export function getUser() { return getCurrentUser(); }

// USERS - REAL SUPABASE
export async function getUsers() {
  const { data } = await supabase.from('users').select('*');
  return data || [];
}
export async function getUserById(id: string) {
  const { data } = await supabase.from('users').select('*').eq('id', id).single();
  return data;
}
export async function getUserByPhone(phone: string) {
  const { data } = await supabase.from('users').select('*').eq('phone', phone).single();
  return data;
}
export async function loginUser(phone: string, password: string) {
  const { data } = await supabase.from('users').select('*').eq('phone', phone).eq('password', password).single();
  if (data) setCurrentUser(data);
  return data;
}
export async function createUser(user: any) {
  const { data } = await supabase.from('users').insert(user).select().single();
  return data;
}
export async function registerUser(user: any) { return createUser(user); }
export async function signupUser(user: any) { return createUser(user); }
export async function updateUser(id: string, updates: any) {
  const { data } = await supabase.from('users').update(updates).eq('id', id).select().single();
  return data;
}

// GIFT CODES
export async function redeemGiftCode(userId: string, code: string) {
  const clean = code.trim().toUpperCase();
  const { data: gift } = await supabase.from('gift_codes').select('*').eq('code', clean).single();
  if (!gift) return { success: false, message: 'Invalid code' };
  if (gift.is_used) return { success: false, message: 'Already used' };
  const { data: user } = await supabase.from('users').select('*').eq('id', userId).single();
  if (!user) return { success: false, message: 'User not found' };
  await supabase.from('users').update({ balance: Number(user.balance) + Number(gift.amount) }).eq('id', userId);
  await supabase.from('gift_codes').update({ is_used: true, used_by: user.phone }).eq('id', gift.id);
  return { success: true, message: `Added ${gift.amount} UGX`, amount: gift.amount };
}
export async function getGiftCodes() {
  const { data } = await supabase.from('gift_codes').select('*');
  return data || [];
}
export async function createGiftCode(code: any) {
  const { data } = await supabase.from('gift_codes').insert(code).select().single();
  return data;
}

// PASSWORD RESET - ALL VARIANTS
export function getPasswordResets() { return []; }
export function getPasswordResetRequests() { return []; }
export function createPasswordReset(_d: any) { return { id: '1' }; }
export function createPasswordResetRequest(_d: any) { return { id: '1' }; }
export function createPasswordResetReq(_d: any) { return { id: '1' }; }
export function approvePasswordReset(_id: string) { return true; }
export function rejectPasswordReset(_id: string) { return true; }

// OTHER
export function getTransactions() { return []; }
export function saveTransaction(_t: any) { return true; }
export function getDeposits() { return []; }
export function getWithdrawals() { return []; }
export const storage = {
  get: (k: string) => localStorage.getItem(k),
  set: (k: string, v: string) => localStorage.setItem(k, v),
};
