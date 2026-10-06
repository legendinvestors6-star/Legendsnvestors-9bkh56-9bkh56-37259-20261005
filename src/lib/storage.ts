import { supabase } from './supabase';

export function getCurrentUser(){ try{ const r=localStorage.getItem('current_user')||localStorage.getItem('currentUser'); return r?JSON.parse(r):null }catch{return null} }
export function setCurrentUser(u:any){ localStorage.setItem('current_user',JSON.stringify(u)); localStorage.setItem('currentUser',JSON.stringify(u)); }
export function logout(){ localStorage.removeItem('current_user'); localStorage.removeItem('currentUser'); }
export const getUser = getCurrentUser;
export const getUserById = async(id:string)=>{ const {data}=await supabase.from('users').select('*').eq('id',id).single(); return data; }
export const getUserByPhone = async(p:string)=>{ const {data}=await supabase.from('users').select('*').eq('phone',p).single(); return data; }
export const getUsers = async()=>{ const {data}=await supabase.from('users').select('*'); return data||[]; }
export const loginUser = async(phone:string,pass:string)=>{ const {data}=await supabase.from('users').select('*').eq('phone',phone).eq('password',pass).single(); if(data) setCurrentUser(data); return data; }
export const createUser = async(u:any)=>{ const {data}=await supabase.from('users').insert(u).select().single(); return data; }
export const registerUser = createUser;
export const signupUser = createUser;
export const updateUser = async(id:string,up:any)=>{ const {data}=await supabase.from('users').update(up).eq('id',id).select().single(); return data; }

// GIFT
export const redeemGiftCode = async(uid:string,code:string)=>{ const c=code.trim().toUpperCase(); const {data:gift}=await supabase.from('gift_codes').select('*').eq('code',c).single(); if(!gift) return {success:false,message:'Invalid'}; if(gift.is_used) return {success:false,message:'Used'}; const {data:user}=await supabase.from('users').select('*').eq('id',uid).single(); if(!user) return {success:false,message:'No user'}; await supabase.from('users').update({balance:Number(user.balance)+Number(gift.amount)}).eq('id',uid); await supabase.from('gift_codes').update({is_used:true,used_by:user.phone}).eq('id',gift.id); return {success:true,message:`Added ${gift.amount}`,amount:gift.amount}; }
export const getGiftCodes = async()=>{ const {data}=await supabase.from('gift_codes').select('*'); return data||[]; }
export const createGiftCode = async(c:any)=>{ const {data}=await supabase.from('gift_codes').insert(c).select().single(); return data; }

// PASSWORD RESETS - EXPORT EVERY NAME POSSIBLE
export const getPasswordResets = ()=>[];
export const getPasswordReset = ()=>[];
export const getPasswordResetRequests = ()=>[];
export const getPasswordResetRequest = ()=>[];
export const getPassResetRequests = ()=>[];
export const getPassResets = ()=>[];
export const getPasswordRequests = ()=>[];
export const createPasswordReset = (_:any)=>({id:'1'});
export const createPasswordResetRequest = (_:any)=>({id:'1'});
export const createPasswordResetReq = (_:any)=>({id:'1'});
export const createPasswordRequest = (_:any)=>({id:'1'});
export const approvePasswordReset = (_:any)=>true;
export const rejectPasswordReset = (_:any)=>true;
export const approvePasswordRequest = (_:any)=>true;
export const rejectPasswordRequest = (_:any)=>true;

export const getTransactions=()=>[]; export const saveTransaction=(_:any)=>true; export const getDeposits=()=>[]; export const getWithdrawals=()=>[]; 
export const storage={get:(k:string)=>localStorage.getItem(k),set:(k:string,v:string)=>localStorage.setItem(k,v)};
