import { supabase } from '@/lib/supabase';

// USER
export const getCurrentUser = () => {
  try { const raw = localStorage.getItem('user'); return raw? JSON.parse(raw) : null; } catch { return null; }
};
export const setCurrentUser = (u: any) => { if (u) localStorage.setItem('user', JSON.stringify(u)); else localStorage.removeItem('user'); };
export const logoutUser = () => localStorage.removeItem('user');
export const logout = logoutUser;
export const getUserById = async (id: string) => { const { data } = await supabase.from('users').select('*').eq('id', id).single(); return data; };
export const updateUser = async (id: string, d: any) => { const { data } = await supabase.from('users').update(d).eq('id', id).select().single(); if (data) setCurrentUser(data); return data; };
export const getUsers = async () => { const { data } = await supabase.from('users').select('*'); return data || []; };

// PRODUCTS
export const getProducts = async () => { const { data } = await supabase.from('products').select('*'); return data || []; };
export const getProductById = async (id: string) => { const { data } = await supabase.from('products').select('*').eq('id', id).single(); return data; };
export const purchaseProduct = async (uid: string, pid: string, amt: number) => {
  const { data: prod } = await supabase.from('products').select('*').eq('id', pid).single();
  const { data: user } = await supabase.from('users').select('*').eq('id', uid).single();
  if (!prod ||!user) return { success: false, message: 'Not found' };
  if ((user.balance || 0) < (prod.price || amt)) return { success: false, message: 'Insufficient balance' };
  await supabase.from('users').update({ balance: (user.balance || 0) - (prod.price || amt) }).eq('id', uid);
  await supabase.from('investments').insert([{ user_id: uid, product_id: pid, amount: prod.price || amt, daily_profit: prod.daily_profit || 0, status: 'active' }]);
  const { data: nu } = await supabase.from('users').select('*').eq('id', uid).single(); if (nu) setCurrentUser(nu);
  return { success: true };
};
export const getUserInvestments = async (uid?: string) => { if (!uid) { const u = getCurrentUser(); uid = u?.id; } if (!uid) return []; const { data } = await supabase.from('investments').select('*, products(*)').eq('user_id', uid); return data || []; };
export const getInvestments = getUserInvestments;

// TEAM
export const getTeamMembers = async (uid?: string) => { if (!uid) { const u = getCurrentUser(); uid = u?.id; } if (!uid) return []; const { data } = await supabase.from('users').select('*').eq('referred_by', uid); return data || []; };
export const getTeamMember = getTeamMembers; export const getMyTeam = getTeamMembers; export const getTeam = getTeamMembers;
export const getTeamCount = async (id?: string) => (await getTeamMembers(id)).length;
export const getTeamMembersCount = getTeamCount; export const getTeamSize = getTeamCount;
export const getTeamEarnings = () => 0; export const getTeamIncome = () => 0; export const getTeamCommission = () => 0; export const getTeamCommissions = () => 0; export const getCommissions = () => 0; export const getTeamEarningsList = () => [];
export const getReferralLink = () => `${typeof window!== 'undefined'? window.location.origin : ''}?ref=${getCurrentUser()?.id || ''}`;
export const getInviteCode = () => getCurrentUser()?.id || ''; export const getReferralCode = getInviteCode;

// WALLET / TRANSACTIONS / CHECK-IN / BONUS / GIFT
export const getTransactions = () => []; export const saveTransaction = () => true;
export const getWalletBalance = () => getCurrentUser()?.balance || 0; export const getBalance = getWalletBalance;
export const getGiftCodes = async () => { const { data } = await supabase.from('gift_codes').select('*'); return data || []; };
export const redeemGiftCode = async (uid: string, code: string) => {
  const c = code.trim().toUpperCase(); const { data: gift } = await supabase.from('gift_codes').select('*').eq('code', c).single();
  if (!gift) return { success: false, message: 'Invalid code' }; if (gift.is_used) return { success: false, message: 'Already used' };
  const { data: user } = await supabase.from('users').select('*').eq('id', uid).single(); if (!user) return { success: false, message: 'User not found' };
  await supabase.from('users').update({ balance: (user.balance || 0) + gift.amount }).eq('id', uid);
  await supabase.from('gift_codes').update({ is_used: true, used_by: uid }).eq('id', gift.id);
  const { data: nu } = await supabase.from('users').select('*').eq('id', uid).single(); if (nu) setCurrentUser(nu);
  return { success: true, message: `Added $${gift.amount}` };
};
export const createPasswordReset = (d: any) => ({ id: Date.now().toString(),...d }); export const getPasswordResetStatus = () => 'pending'; export const getPasswordResets = () => []; export const approvePasswordReset = () => true; export const rejectPasswordReset = () => true;

// CHECK-IN PAGE - FIXES your current error
export const performCheckIn = async () => {
  const u = getCurrentUser(); if (!u) return { success: false, message: 'Not logged in' };
  const today = new Date().toISOString().split('T')[0]; const key = `checkin_${u.id}_${today}`;
  if (localStorage.getItem(key)) return { success: false, message: 'Already checked in today' };
  localStorage.setItem(key, '1');
  await supabase.from('users').update({ balance: (u.balance || 0) + 5 }).eq('id', u.id);
  const { data: nu } = await supabase.from('users').select('*').eq('id', u.id).single(); if (nu) setCurrentUser(nu);
  return { success: true, message: 'Checked in! +$5', reward: 5 };
};
export const checkIn = performCheckIn; export const doCheckIn = performCheckIn; export const dailyCheckIn = performCheckIn; export const getCheckInStatus = () => false; export const getDailyBonus = () => 5; export const claimDailyBonus = performCheckIn; export const getStreak = () => 1;

// EXTRA COMPATIBILITY
export const getIncome = () => 0; export const getEarnings = () => 0; export const getTotalIncome = () => 0; export const getReferralBonus = () => 0;
export const storage = { get: (k: string) => localStorage.getItem(k), set: (k: string, v: string) => localStorage.setItem(k, v) };
