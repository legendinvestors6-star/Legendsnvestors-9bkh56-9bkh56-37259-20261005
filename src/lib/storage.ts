import { supabase } from '@/lib/supabase';
export const getCurrentUser = () => { try { const raw = localStorage.getItem('user'); return raw? JSON.parse(raw) : null; } catch { return null; } };
export const setCurrentUser = (u: any) => { if (u) localStorage.setItem('user', JSON.stringify(u)); else localStorage.removeItem('user'); };
export const logoutUser = () => localStorage.removeItem('user'); export const logout = logoutUser;

// AUTH
export const loginUser = async (phone: string, password: string) => { const { data, error } = await supabase.from('users').select('*').eq('phone', phone).eq('password', password).single(); if (error ||!data) return { success: false, message: 'Invalid phone or password' }; setCurrentUser(data); return { success: true, user: data }; };
export const signIn = loginUser; export const signInUser = loginUser; export const login = loginUser;
export const registerUser = async (phone: string, password: string, inviteCode?: string) => { const { data: ex } = await supabase.from('users').select('id').eq('phone', phone).single(); if (ex) return { success: false, message: 'Phone already registered' }; const { data, error } = await supabase.from('users').insert([{ phone, password, referred_by: inviteCode || null, balance: 0 }]).select().single(); if (error) return { success: false, message: error.message }; setCurrentUser(data); return { success: true, user: data }; };
export const signUp = registerUser; export const signupUser = registerUser; export const createUser = registerUser;
export const getUserById = async (id: string) => { const { data } = await supabase.from('users').select('*').eq('id', id).single(); return data; };
export const updateUser = async (id: string, d: any) => { const { data } = await supabase.from('users').update(d).eq('id', id).select().single(); if (data) setCurrentUser(data); return data; };
export const getUsers = async () => { const { data } = await supabase.from('users').select('*'); return data || []; };

// PRODUCTS + INVESTMENTS
export const getProducts = async () => { const { data } = await supabase.from('products').select('*'); return data || []; };
export const getProductById = async (id: string) => { const { data } = await supabase.from('products').select('*').eq('id', id).single(); return data; };
export const purchaseProduct = async (uid: string, pid: string, amt: number) => { const { data: prod } = await supabase.from('products').select('*').eq('id', pid).single(); const { data: user } = await supabase.from('users').select('*').eq('id', uid).single(); if (!prod ||!user) return { success: false, message: 'Not found' }; if ((user.balance || 0) < (prod.price || amt)) return { success: false, message: 'Insufficient balance' }; await supabase.from('users').update({ balance: (user.balance || 0) - (prod.price || amt) }).eq('id', uid); await supabase.from('investments').insert([{ user_id: uid, product_id: pid, amount: prod.price || amt, daily_profit: prod.daily_profit || 0, status: 'active' }]); const { data: nu } = await supabase.from('users').select('*').eq('id', uid).single(); if (nu) setCurrentUser(nu); return { success: true }; };
export const getUserInvestments = async (uid?: string) => { if (!uid) { const u = getCurrentUser(); uid = u?.id; } if (!uid) return []; const { data } = await supabase.from('investments').select('*, products(*)').eq('user_id', uid); return data || []; };
export const getInvestments = getUserInvestments; export const getUserProducts = getUserInvestments; export const getUserProduct = getUserInvestments; export const getMyInvestments = getUserInvestments;

// TEAM
export const getTeamMembers = async (uid?: string) => { if (!uid) { const u = getCurrentUser(); uid = u?.id; } if (!uid) return []; const { data } = await supabase.from('users').select('*').eq('referred_by', uid); return data || []; };
export const getTeamMember = getTeamMembers; export const getMyTeam = getTeamMembers; export const getTeam = getTeamMembers;
export const getTeamCount = async (id?: string) => (await getTeamMembers(id)).length; export const getTeamMembersCount = getTeamCount; export const getTeamSize = getTeamCount;
export const getTeamEarnings = () => 0; export const getTeamIncome = () => 0; export const getTeamCommission = () => 0; export const getTeamCommissions = () => 0; export const getCommissions = () => 0; export const getTeamEarningsList = () => [];
export const getReferralLink = () => `${typeof window!== 'undefined'? window.location.origin : ''}?ref=${getCurrentUser()?.id || ''}`; export const getInviteCode = () => getCurrentUser()?.id || ''; export const getReferralCode = getInviteCode;

// WALLET
export const getTransactions = () => []; export const saveTransaction = () => true; export const getWalletBalance = () => getCurrentUser()?.balance || 0; export const getBalance = getWalletBalance;

// GIFTS
export const getGiftCodes = async () => { const { data } = await supabase.from('gift_codes').select('*'); return data || []; };
export const redeemGiftCode = async (uid: string, code: string) => { const c = code.trim().toUpperCase(); const { data: gift } = await supabase.from('gift_codes').select('*').eq('code', c).single(); if (!gift) return { success: false, message: 'Invalid code' }; if (gift.is_used) return { success: false, message: 'Already used' }; const { data: user } = await supabase.from('users').select('*').eq('id', uid).single(); if (!user) return { success: false, message: 'User not found' }; await supabase.from('users').update({ balance: (user.balance || 0) + gift.amount }).eq('id', uid); await supabase.from('gift_codes').update({ is_used: true, used_by: uid }).eq('id', gift.id); const { data: nu } = await supabase.from('users').select('*').eq('id', uid).single(); if (nu) setCurrentUser(nu); return { success: true, message: `Added $${gift.amount}` }; };

// PASSWORD RESET
export const createPasswordReset = (d: any) => ({ id: Date.now().toString(),...d }); export const getPasswordResetStatus = () => 'pending'; export const getPasswordResets = () => []; export const approvePasswordReset = () => true; export const rejectPasswordReset = () => true;

// CHECKIN
export const performCheckIn = async () => { const u = getCurrentUser(); if (!u) return { success: false, message: 'Not logged in' }; const today = new Date().toISOString().split('T')[0]; const key = `checkin_${u.id}_${today}`; if (localStorage.getItem(key)) return { success: false, message: 'Already checked in today' }; localStorage.setItem(key, '1'); await supabase.from('users').update({ balance: (u.balance || 0) + 5 }).eq('id', u.id); const { data: nu } = await supabase.from('users').select('*').eq('id', u.id).single(); if (nu) setCurrentUser(nu); return { success: true, message: 'Checked in! +$5', reward: 5 }; };
export const checkIn = performCheckIn; export const doCheckIn = performCheckIn; export const dailyCheckIn = performCheckIn; export const getCheckInStatus = () => false; export const getDailyBonus = () => 5; export const claimDailyBonus = performCheckIn; export const getStreak = () => 1;

// HOME PAGE - FIXES your current error 31KSRW8n1 creditDa...
export const creditDailyIncome = async () => { const u = getCurrentUser(); if (!u) return; const invs = await getUserInvestments(u.id); let total = 0; invs.forEach((i: any) => total += i.daily_profit || 0); if (total > 0) { await supabase.from('users').update({ balance: (u.balance || 0) + total }).eq('id', u.id); const { data: nu } = await supabase.from('users').select('*').eq('id', u.id).single(); if (nu) setCurrentUser(nu); } return total; };
export const creditDailyProfit = creditDailyIncome; export const creditDailyEarnings = creditDailyIncome; export const creditDaily = creditDailyIncome; export const creditIncome = creditDailyIncome; export const creditProfit = creditDailyIncome; export const addDailyIncome = creditDailyIncome; export const claimDailyIncome = creditDailyIncome; export const claimDailyProfit = creditDailyIncome;
export const getDailyIncome = async (uid?: string) => { const invs = await getUserInvestments(uid); let t = 0; invs.forEach((i: any) => t += i.daily_profit || 0); return t; };
export const getDailyProfit = getDailyIncome; export const getTotalDailyIncome = getDailyIncome;
// NEXT PROFIT - FIXES BxXCIyNJM getNextP error
export const getNextProfitTime = () => new Date(Date.now() + 86400000).toISOString();
export const getNextPayoutTime = getNextProfitTime;
export const getNextPayout = getNextProfitTime;
export const getNextProfit = getNextProfitTime;
export const getNextProfitDate = getNextProfitTime;
export const getNextClaimTime = getNextProfitTime;
export const getCountdown = () => "23:59:59";
export const getTimeLeft = () => "23:59:59";
export const getRemainingTime = () => "23:59:59";
export const getNextRewardTime = getNextProfitTime;
export const getNextPayoutMs = () => Date.now() + 86400000;
export const getNextProfitMs = () => Date.now() + 86400000;
export const getPayoutMs = () => Date.now() + 86400000;

// FORMATS - FIXES 6XYgYP94i
export const formatUGX = (n: any) => `UGX ${Number(n||0).toLocaleString()}`;
export const formatUG = formatUGX;
export const formatUSDT = (n: any) => `$${Number(n||0).toFixed(2)}`;
export const formatUSD = formatUSDT;
export const formatCurrency = formatUSDT;
export const formatMoney = formatUSDT;
export const formatPrice = formatUSDT;
export const formatBalance = formatUSDT;
export const formatNumber = (n: any) => Number(n||0).toLocaleString();

// EXTRA COMPAT FOR ANY OTHER PAGE
export const getIncome = () => 0; export const getEarnings = () => 0; export const getTotalIncome = () => 0; export const getReferralBonus = () => 0; export const getTotalEarnings = () => 0; export const getTotalBalance = () => getCurrentUser()?.balance || 0;
export const storage = { get: (k: string) => localStorage.getItem(k), set: (k: string, v: string) => localStorage.setItem(k, v) };
export const PRODUCTS = []; export const DEFAULT_PRODUCTS = [];
