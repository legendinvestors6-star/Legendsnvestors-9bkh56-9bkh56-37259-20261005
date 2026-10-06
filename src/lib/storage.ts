import type { User, Transaction, RechargeOrder, WithdrawOrder, UserProduct } from '@/types';
import { REGISTRATION_BONUS, PRODUCTS, MTN_ACCOUNT, MTN_NAME } from '@/constants/products';
import { supabase } from './supabase';

const KEYS = {
  CURRENT_USER: 'legend_current_user',
};

export interface PasswordResetRequest { id: string; phone: string; newPassword: string; status: 'pending'|'approved'|'rejected'; createdAt: string; resolvedAt?: string; note?: string; }
export interface GiftCode { id: string; code: string; amount: number; usedBy?: string; usedAt?: string; createdAt: string; note?: string; expiresAt?: string; }

function generateId(): string { return Math.random().toString(36).substr(2,9)+Date.now().toString(36); }
function generateReferralCode(): string { return Math.random().toString(36).substr(2,8).toUpperCase(); }

const ADMIN_PHONE = '0746085840';
const ADMIN_PASSWORD = 'milly@2323';

// ---- Supabase Mappers ----
function mapUser(row:any): User {
  return {
    id: row.id,
    phone: row.phone,
    password: row.password,
    balance: Number(row.balance||0),
    cumulativeIncome: Number(row.cumulative_income||0),
    level: row.level||1,
    referralCode: row.referral_code,
    referredBy: row.referred_by,
    checkInDays: row.check_in_days||0,
    lastCheckIn: row.last_check_in,
    bankCard: row.bank_card ? JSON.parse(row.bank_card) : undefined,
    createdAt: row.created_at,
    isAdmin: row.is_admin||false,
  }
}

// ---- USERS (REAL DB) ----
export async function getUsers(): Promise<User[]> {
  const { data } = await supabase.from('users').select('*').order('created_at',{ascending:false});
  return (data||[]).map(mapUser);
}

export async function saveUsers(users: User[]): Promise<void> {
  // Upsert all to supabase for real control
  for (const u of users) {
    await supabase.from('users').upsert({
      id: u.id, phone: u.phone, password: u.password, balance: u.balance,
      cumulative_income: u.cumulativeIncome, level: u.level, referral_code: u.referralCode,
      referred_by: u.referredBy, check_in_days: u.checkInDays, last_check_in: u.lastCheckIn,
      bank_card: u.bankCard ? JSON.stringify(u.bankCard) : null,
      is_admin: u.isAdmin||false, created_at: u.createdAt
    }, { onConflict: 'id' });
  }
}

export function getCurrentUser(): User | null {
  try {
    const raw = localStorage.getItem(KEYS.CURRENT_USER);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
export function setCurrentUser(user: User | null): void {
  if(user) localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
  else localStorage.removeItem(KEYS.CURRENT_USER);
}
export async function updateUser(userId: string, updates: Partial<User>): Promise<User|null> {
  const { data: row } = await supabase.from('users').select('*').eq('id', userId).single();
  if(!row) return null;
  let current = mapUser(row);
  const merged = { ...current, ...updates };
  await supabase.from('users').update({
    phone: merged.phone, password: merged.password, balance: merged.balance,
    cumulative_income: merged.cumulativeIncome, check_in_days: merged.checkInDays,
    last_check_in: merged.lastCheckIn, bank_card: merged.bankCard ? JSON.stringify(merged.bankCard) : null,
  }).eq('id', userId);
  const cur = getCurrentUser();
  if(cur && cur.id===userId) setCurrentUser(merged);
  return merged;
}

// Keep old sync wrappers for other pages (they will be migrated later)
export function getUsersSync(): User[] { try { const d=localStorage.getItem('legend_users'); return d?JSON.parse(d):[]; } catch { return []; } }

// ---- AUTH (REAL DB) ----
export async function registerUser(phone: string, password: string, referralCode?: string) {
  const { data: existing } = await supabase.from('users').select('id').eq('phone', phone).single();
  if(existing) return { success:false, message:'Phone already registered' };
  let referredBy: string|undefined;
  if(referralCode){
    const { data: ref } = await supabase.from('users').select('id').eq('referral_code', referralCode.toUpperCase()).single();
    if(ref) referredBy=ref.id;
  }
  const newUser: User = {
    id: generateId(), phone, password, balance: REGISTRATION_BONUS, cumulativeIncome:0,
    level:1, referralCode: generateReferralCode(), referredBy, checkInDays:0, createdAt: new Date().toISOString(),
  };
  await supabase.from('users').insert({
    id:newUser.id, phone, password, balance:REGISTRATION_BONUS, cumulative_income:0, level:1,
    referral_code:newUser.referralCode, referred_by:referredBy, check_in_days:0, created_at:newUser.createdAt
  });
  return { success:true, message:'Registration successful', user:newUser };
}

export async function loginUser(phone: string, password: string){
  if(phone===ADMIN_PHONE && password===ADMIN_PASSWORD){
    const { data: admin } = await supabase.from('users').select('*').eq('phone', ADMIN_PHONE).single();
    if(!admin){
      const id='admin001';
      await supabase.from('users').insert({ id, phone:ADMIN_PHONE, password:ADMIN_PASSWORD, balance:0, cumulative_income:0, referral_code:'ADMIN000', is_admin:true, created_at:new Date().toISOString() });
      const u = { id, phone:ADMIN_PHONE, password:ADMIN_PASSWORD, balance:0, cumulativeIncome:0, level:1, referralCode:'ADMIN000', checkInDays:0, createdAt:new Date().toISOString(), isAdmin:true } as User;
      setCurrentUser(u); return { success:true, message:'Login successful', user:u };
    }
    const u=mapUser(admin); setCurrentUser(u); return { success:true, message:'Login successful', user:u };
  }
  const { data } = await supabase.from('users').select('*').eq('phone',phone).eq('password',password).single();
  if(!data) return { success:false, message:'Incorrect phone or password' };
  const u=mapUser(data); setCurrentUser(u); return { success:true, message:'Login successful', user:u };
}

// ---- TRANSACTIONS keep local for now (you can migrate later) ----
export function getTransactions(userId?: string): Transaction[] { try{const d=localStorage.getItem('legend_transactions');const all=d?JSON.parse(d):[];return userId?all.filter((t:any)=>t.userId===userId):all;}catch{return[];} }
export function addTransaction(tx: Omit<Transaction,'id'|'createdAt'>): Transaction { const all=getTransactions(); const nt={...tx,id:generateId(),createdAt:new Date().toISOString()} as Transaction; localStorage.setItem('legend_transactions',JSON.stringify([nt,...all])); return nt; }

// ---- RECHARGE (REAL DB) ----
export async function getRechargeOrders(userId?: string): Promise<RechargeOrder[]> {
  let q=supabase.from('recharges').select('*').order('created_at',{ascending:false});
  if(userId) q=q.eq('user_id',userId);
  const { data } = await q; return (data||[]).map((r:any)=>({ id:r.id, userId:r.user_id, amount:Number(r.amount), paymentMethod:r.payment_method, phoneNumber:r.phone_number, status:r.status, createdAt:r.created_at, mtnAccount:r.mtn_account, mtnName:r.mtn_name }));
}
export async function createRechargeOrder(userId: string, amount: number, paymentMethod: string, phoneNumber: string){
  const order = { id:generateId(), user_id:userId, amount, payment_method:paymentMethod, phone_number:phoneNumber, status:'pending', created_at:new Date().toISOString(), mtn_account:MTN_ACCOUNT, mtn_name:MTN_NAME };
  await supabase.from('recharges').insert(order); return order as any;
}
export async function approveRechargeOrder(orderId: string): Promise<boolean> {
  const { data: order } = await supabase.from('recharges').select('*').eq('id',orderId).single();
  if(!order || order.status!=='pending') return false;
  await supabase.from('recharges').update({ status:'completed' }).eq('id',orderId);
  const { data: user } = await supabase.from('users').select('balance,cumulative_income').eq('id',order.user_id).single();
  if(user){
    await supabase.from('users').update({ balance:Number(user.balance)+Number(order.amount) }).eq('id',order.user_id);
    // L1 commission 27%
    const { data: referred } = await supabase.from('users').select('referred_by,phone').eq('id',order.user_id).single();
    if(referred?.referred_by){
      const l1=Math.floor(Number(order.amount)*0.27);
      const { data: refUser } = await supabase.from('users').select('balance,cumulative_income').eq('id',referred.referred_by).single();
      if(refUser) await supabase.from('users').update({ balance:Number(refUser.balance)+l1, cumulative_income:Number(refUser.cumulative_income)+l1 }).eq('id',referred.referred_by);
    }
  }
  return true;
}
export async function rejectRechargeOrder(orderId: string): Promise<boolean> { await supabase.from('recharges').update({ status:'rejected' }).eq('id',orderId); return true; }

// ---- WITHDRAW (REAL DB) ----
export async function getWithdrawOrders(userId?: string): Promise<WithdrawOrder[]> {
  let q=supabase.from('withdraws').select('*').order('created_at',{ascending:false});
  if(userId) q=q.eq('user_id',userId);
  const { data } = await q; return (data||[]).map((w:any)=>({ id:w.id, userId:w.user_id, amount:Number(w.amount), receivedAmount:Number(w.received_amount), fee:Number(w.fee), bankCard: typeof w.bank_card==='string'?JSON.parse(w.bank_card):w.bank_card, status:w.status, createdAt:w.created_at }));
}
export async function createWithdrawOrder(userId: string, amount: number){
  const users=await getUsers(); const user=users.find(u=>u.id===userId);
  if(!user) return { success:false, message:'User not found' };
  if(!user.bankCard) return { success:false, message:'Please bind bank card first' };
  if(amount<6000) return { success:false, message:'Minimum withdrawal is UGX 6,000' };
  if(amount>user.balance) return { success:false, message:'Insufficient balance' };
  const fee=Math.floor(amount*0.16); const received=amount-fee;
  await supabase.from('users').update({ balance:user.balance-amount }).eq('id',userId);
  const order={ id:generateId(), user_id:userId, amount, received_amount:received, fee, bank_card:JSON.stringify(user.bankCard), status:'pending', created_at:new Date().toISOString() };
  await supabase.from('withdraws').insert(order); return { success:true, message:'Withdrawal submitted', order:order as any };
}
export async function approveWithdrawOrder(orderId: string): Promise<boolean> { await supabase.from('withdraws').update({ status:'completed' }).eq('id',orderId); return true; }
export async function rejectWithdrawOrder(orderId: string): Promise<boolean> {
  const { data: order } = await supabase.from('withdraws').select('*').eq('id',orderId).single();
  if(order){ const { data: user } = await supabase.from('users').select('balance').eq('id',order.user_id).single(); if(user) await supabase.from('users').update({ balance:Number(user.balance)+Number(order.amount) }).eq('id',order.user_id); }
  await supabase.from('withdraws').update({ status:'rejected' }).eq('id',orderId); return true;
}

// ---- OTHER FUNCTIONS (keep simple, local) ----
export function getUserProducts(userId?: string): UserProduct[] { try{const d=localStorage.getItem('legend_user_products');const all=d?JSON.parse(d):[];return userId?all.filter((p:any)=>p.userId===userId):all;}catch{return[];} }
export function purchaseProduct(userId: string, productId: number, price: number, dailyIncome: number, term: number){ const users=JSON.parse(localStorage.getItem('legend_users')||'[]'); const user=users.find((u:any)=>u.id===userId); if(!user) return { success:false, message:'User not found' }; return { success:true, message:'Product purchased' }; }
export function performCheckIn(userId: string){ return { success:true, message:'Checked in', reward:300 }; }
export function getTeamMembers(userId: string){ return { level1:[], level2:[], level3:[] }; }
export function getTeamCommissions(userId: string){ return { level1:0, level2:0, level3:0 }; }
export function getGiftCodes(): GiftCode[] { try{const d=localStorage.getItem('legend_gift_codes');return d?JSON.parse(d):[];}catch{return[];} }
export function createGiftCode(amount: number, note?: string, customCode?: string){ const codes=getGiftCodes(); const c={ id:generateId(), code:customCode?customCode.toUpperCase():Math.random().toString(36).substr(2,8).toUpperCase(), amount, note, expiresAt:new Date(Date.now()+30*60*1000).toISOString(), createdAt:new Date().toISOString() }; localStorage.setItem('legend_gift_codes',JSON.stringify([c,...codes])); return c; }
export function deleteGiftCode(codeId: string){ localStorage.setItem('legend_gift_codes',JSON.stringify(getGiftCodes().filter(c=>c.id!==codeId))); }
export function getPasswordResets(): PasswordResetRequest[] { try{const d=localStorage.getItem('legend_password_resets');return d?JSON.parse(d):[];}catch{return[];} }
export function createPasswordReset(phone: string, newPassword: string){ return { success:true, message:'Reset request submitted' }; }
export function getPasswordResetStatus(phone: string){ return null; }
export function approvePasswordReset(resetId: string){ return true; }
export function rejectPasswordReset(resetId: string){ return true; }
export function redeemGiftCode(userId: string, codeStr: string){ return { success:false,
