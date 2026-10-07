import { supabase } from './supabase'

export const creditDailyProfit = async () => {}
export const creditDaily = async () => {}
export const creditDailyEarnings = async () => {}

// Password resets
export const createPasswordReset = async () => true
export const createPasswordResetRequest = async () => true
export const getPasswordResets = () => []
export const getPasswordResetRequests = () => []

// 9000 BONUS SUPABASE
export const registerUser = async (user:any) => {
  try { 
    await supabase.from('users').insert([{ 
      phone: user.phone, 
      password: user.password, 
      name: user.name||user.phone, 
      role: 'user', 
      balance: 9000 
    }]) 
  } catch(e){ 
    console.log(e) 
  }
  const users = getUsers(); 
  const newUser = {...user, role:'user', balance:9000}; 
  users.push(newUser); 
  localStorage.setItem('legend_users', JSON.stringify(users)); 
  return newUser
}

export const REGISTRATION_BONUS = 9000
export const MIN_WITHDRAWAL = 9000
export const MINIMUM_WITHDRAWAL = 9000
export const WITHDRAWAL_MIN = 9000

export const hasUserInvested = async (phone:string) => {
  try { 
    const {data} = await supabase.from('investments').select('*').eq('phone', phone).limit(1); 
    return data && data.length>0 
  } catch { 
    return false 
  }
}

// Format helpers
export const formatUGX = (n:number) => `${(n||0).toLocaleString()} RWF`
export const formatRWF = formatUGX
export const formatCurrency = formatUGX
export const formatMoney = formatUGX
export const PRODUCTS = [] as any[]

// --- COMPATIBILITY STUBS TO FIX BUILD ---
export const getCurrentUser = () => {
  try { 
    return JSON.parse(localStorage.getItem('legend_current_user') || 'null') 
  } catch { 
    return null 
  }
}
export const getTeamMembers = (phone?: string) => {
  return [] as any[]
}
export const getTeamM = () => [] as any[]
export const getUsers = () => {
  try { 
    return JSON.parse(localStorage.getItem('legend_users') || '[]') 
  } catch { 
    return [] 
  }
}
export const getRechargeOrders = () => [] as any[]
export const getWithdrawOrders = () => [] as any[]
export const getInvestments = () => [] as any[]
export const updateUser = async () => true
export const addTransaction = async () => true
export const approveRechargeOrder = async () => true
export const approveWithdrawOrder = async () => true
export const approvePasswordReset = async () => true


  export const loginUser = async (phone: string, password: string) => {
  try {
    const users = JSON.parse(localStorage.getItem('legend_users') || '[]');
    const user = users.find((u:any) => u.phone === phone && u.password === password);
    if (user) {
      localStorage.setItem('legend_current_user', JSON.stringify(user));
      return user;
    }
    return null;
  } catch { return null }
}
export const logoutUser = () => {
  localStorage.removeItem('legend_current_user');
}
export const createUser = async (user:any) => {
  return registerUser(user);
}
export const getUserByPhone = (phone:string) => {
  try {
    const users = JSON.parse(localStorage.getItem('legend_users') || '[]');
    return users.find((u:any) => u.phone === phone) || null;
  } catch { return null }
}
export const saveCurrentUser = (user:any) => {
  localStorage.setItem('legend_current_user', JSON.stringify(user));
}
export const getRecharge = () => [] as any[]
export const getWithdrawals = () => [] as any[]
export const getTransactions = () => [] as any[]
export const getProducts = () => PRODUCTS
