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

export const loginUser = async (phone: string, password: string) => {
  const { data } = await supabase.from('users').select('*').eq('phone', phone).eq('password', password).single();
  if (data) setCurrentUser(data);
  return data;
};

export const createPasswordReset = (data: any) => {
  const all = JSON.parse(localStorage.getItem('passwordResets') || '[]');
  all.push({ ...data, status: 'pending', id: Date.now().toString() });
  localStorage.setItem('passwordResets', JSON.stringify(all));
  return { id: '1' };
};

export const getPasswordResetStatus = (phone: string) => {
  try {
    const all = JSON.parse(localStorage.getItem('passwordResets') || '[]');
    return all.find((r: any) => r.phone === phone) || null;
  } catch { return null; }
};

// --- below are for your other pages (Admin, Gift) so they don't break ---
export const getUsers = async () => { const { data } = await supabase.from('users').select('*'); return data || []; };
export const getUserById = async (id: string) => { const { data } = await supabase.from('users').select('*').eq('id', id).single(); return data; };
export const createUser = async (u: any) => { const { data } = await supabase.from('users').insert(u).select().single(); return data; };
export const registerUser = createUser;
export const redeemGiftCode = async (uid: string, code: string) => {
  const clean = code.trim().toUpperCase();
  const { data: gift } = await supabase.from('gift_codes').select('*').eq('code', clean).single();
  if (!gift) return { success: false, message: 'Invalid code' };
  if (gift.is_used) return { success: false, message: 'Already used' };
  const { data: user } = await supabase.from('users').select('*').eq('id', uid).single();
  await supabase.from('users').update({ balance: Number(user?.balance || 0) + Number(gift.amount) }).eq('id', uid);
  await supabase.from('gift_codes').update({ is_used: true, used_by: user?.phone }).eq('id', gift.id);
  return { success: true, message: `Added ${gift.amount} UGX` };
};
export const getGiftCodes = async () => { const { data } = await supabase.from('gift_codes').select('*'); return data || []; };
export const getPasswordResets = () => [];
export const approvePasswordReset = () => true;
export const rejectPasswordReset = () => true;
export const storage = { get: (k: string) => localStorage.getItem(k), set: (k: string, v: string) => localStorage.setItem(k, v) };
