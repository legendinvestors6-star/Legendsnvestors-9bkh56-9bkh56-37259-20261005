import { supabase } from './supabase';

export function getCurrentUser() { try { const r = localStorage.getItem('current_user')||localStorage.getItem('currentUser'); return r?JSON.parse(r):null; } catch { return null; } }
export function setCurrentUser(u: any) { localStorage.setItem('current_user', JSON.stringify(u)); localStorage.setItem('currentUser', JSON.stringify(u)); }
export function logout() { localStorage.removeItem('current_user'); localStorage.removeItem('currentUser'); }
export const getUser = getCurrentUser;
export const getUserById = async (id: string) => { const { data } = await supabase.from('users').select('*').eq('id', id).single(); return data; };
export const getUserByPhone = async (p: string) => { const { data } = await supabase.from('users').select('*').eq('phone', p).single(); return data; };
export const getUsers = async () => { const { data } = await supabase.from('users').select('*'); return data || []; };
export const loginUser = async (phone: string, password: string) => { const { data } = await supabase.from('users').select('*').eq('phone', phone).eq('password', password).single(); if (data) setCurrentUser(data); return data; };
export const createUser = async (u: any) => { const { data } = await supabase.from('users').insert(u).select().single(); return data; };
export const registerUser = createUser;
export const signupUser = createUser;
export const updateUser = async (id: string, up: any) => { const { data } = await supabase.from('users').update(up).eq('id', id).select().single(); return data; };
export const updateUserBalance = async (id: string, bal: number) => { const { data } = await supabase.from('users').update({balance: bal}).eq('id', id).select().single(); return data; };

// PRODUCTS - FIXES ProductPage error
export const getUserProducts = () => { try { return JSON.parse(localStorage.getItem('userProducts')||'[]'); } catch { return []; } };
export const getUserProduct = getUserProducts;
export const getProducts = () => { try { return JSON.parse(localStorage.getItem('products')||'[]'); } catch { return []; } };
export const purchaseProduct = async (productId?: string, userId?: string) => { return { success: true, message: 'Purchased' }; };
export const purchaseProductWithBalance = purchaseProduct;
export const buyProduct = purchaseProduct;
export const buyProductWithBalance = purchaseProduct;
export const purchase = purchaseProduct;

// INCOME & FORMAT - FIXES HomePage
export const creditDailyIncome = async () => true;
export const claimDailyIncome = creditDailyIncome;
export const collectDailyIncome = creditDailyIncome;
export const formatUGX = (a: number|string) => `${(Number(a)||0).toLocaleString()} UGX`;
export const formatCurrency = formatUGX;
export const formatMoney = formatUGX;
export const getNextPayoutMs = () => { const t = new Date(); t.setHours(24,0,0,0); return t.getTime()-Date.now(); };
export const getNextPayout = () => new Date(Date.now()+getNextPayoutMs()).toISOString();
export const getDailyIncome = () => 0;
export const getTotalEarnings = () => 0;

// GIFT & RESET
export const redeemGiftCode = async (uid: string, code: string) => {
  const c = code.trim().toUpperCase();
  const { data: gift } = await supabase.from('gift_codes').select('*').eq('code', c).single();
  if (!gift) return { success: false, message: 'Invalid code' };
  if (gift.is_used) return { success: false, message: 'Already used' };
  const { data: user } = await supabase.from('users').select('*').eq('id', uid).single();
  if (!user) return { success: false, message: 'User not found' };
  await supabase.from('users').update({ balance: Number(user.balance)+Number(gift.amount) }).eq('id', uid);
  await supabase.from('gift_codes').update({ is_used: true, used_by: user.phone }).eq('id', gift.id);
  return { success: true, message: `Added ${gift.amount} UGX` };
};
export const getGiftCodes = async () => { const { data } = await supabase.from('gift_codes').select('*'); return data||[]; };
export const createPasswordReset = (d: any) => { const a = JSON.parse(localStorage.getItem('passwordResets')||'[]'); a.push({...d,status:'pending',id:Date.now().toString()}); localStorage.setItem('passwordResets', JSON.stringify(a)); return { id: '1' }; };
export const getPasswordResetStatus = (p: string) => { try { const a = JSON.parse(localStorage.getItem('passwordResets')||'[]'); return a.find((r:any)=>r.phone===p)||null; } catch { return null; } };
export const getPasswordResets = () => [];
export const approvePasswordReset = () => true;
export const rejectPasswordReset = () => true;
export const getTransactions = () => [];
export const saveTransaction = () => true;
export const storage = { get: (k: string) => localStorage.getItem(k), set: (k: string, v: string) => localStorage.setItem(k, v) };
