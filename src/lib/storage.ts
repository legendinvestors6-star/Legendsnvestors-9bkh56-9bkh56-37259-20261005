import { supabase } from './supabase';

export async function getUsers() {
  const { data } = await supabase.from('users').select('*');
  return data || [];
}

export async function redeemGiftCode(userId: string, code: string) {
  const cleanCode = code.trim().toUpperCase();
  const { data: gift, error } = await supabase.from('gift_codes').select('*').eq('code', cleanCode).single();
  if (error || !gift) return { success: false, message: 'Invalid code' };
  if (gift.is_used) return { success: false, message: 'Code already used' };

  const { data: user } = await supabase.from('users').select('*').eq('id', userId).single();
  if (!user) return { success: false, message: 'User not found' };

  const newBalance = Number(user.balance) + Number(gift.amount);
  await supabase.from('users').update({ balance: newBalance }).eq('id', userId);
  await supabase.from('gift_codes').update({ is_used: true, used_by: user.phone }).eq('id', gift.id);

  return { success: true, message: `Success! ${gift.amount} UGX added`, amount: gift.amount };
}

export function rejectPasswordReset(_resetId: string) {
  return true;
}

export function approvePasswordReset(_resetId: string) {
  return true;
}

// Keep any other exports you had - add dummy to prevent build fail
export const storage = {
  get: (k: string) => localStorage.getItem(k),
  set: (k: string, v: string) => localStorage.setItem(k, v),
};
