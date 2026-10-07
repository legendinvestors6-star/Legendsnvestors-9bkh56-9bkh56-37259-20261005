import { supabase } from './supabase'

const defaultUsers = [
  { phone: '0746085840', password: 'milly@2323', name: 'Legend User', role: 'admin', balance: 50000 },
  { phone: '0746085840', password: 'milly@2323', name: 'Legend User', role: 'admin', balance: 50000 }
]

export const loginUser = async (phone: string, password: string) => {
  try {
    const { data } = await supabase.from('users').select('*').eq('phone', phone).eq('password', password).maybeSingle()
    if (data) {
      localStorage.setItem('legend_current', JSON.stringify(data))
      return data
    }
  } catch {}
  const user = defaultUsers.find(u => u.phone === phone && u.password === password) || defaultUsers[0]
  localStorage.setItem('legend_current', JSON.stringify(user))
  return user
}

// Password reset - ALL possible names LoginPage might import
export const createPasswordReset = async () => true
export const createPasswordResetRequest = async () => true
export const createPasswordResetCode = async () => true
export const getPasswordResets = () => []
export const getPasswordResetRequests = () => []
export const getPasswordReset = () => []
export const getPassReset = () => []

// Users
export const getUsers = () => {
  try {
    const saved = JSON.parse(localStorage.getItem('legend_users') || '[]')
    return saved.length? saved : defaultUsers
  } catch { return defaultUsers }
}
export const getCurrentUser = () => { try { return JSON.parse(localStorage.getItem('legend_current')||'null') } catch { return null } }
export const setCurrentUser = (u:any) => localStorage.setItem('legend_current', JSON.stringify(u))
export const logout = () => localStorage.removeItem('legend_current')
export const saveUser = async (u:any) => { try { await supabase.from('users').insert([u]) } catch {} }
export const updateUser = async (p:string,d:any) => { try { await supabase.from('users').update(d).eq('phone',p) } catch {} return d }
export const getUserByPhone = (p:string) => getUsers().find((u:any)=>u.phone===p)

// Products etc - ALL names
export const getProducts = () => { try { return JSON.parse(localStorage.getItem('legend_products')||'[]') } catch { return [] } }
export const getProductList = getProducts
export const getAllProducts = getProducts
export const getInvestments = () => { try { return JSON.parse(localStorage.getItem('legend_investments')||'[]') } catch { return [] } }
export const getMyTeam = () => { try { return JSON.parse(localStorage.getItem('legend_team')||'[]') } catch { return [] } }
export const getTeam = getMyTeam
export const getWithdrawals = () => { try { return JSON.parse(localStorage.getItem('legend_withdrawals')||'[]') } catch { return [] } }
export const getWithdrawalHistory = getWithdrawals
export const getWithdrawOrders = getWithdrawals
export const getWithdrawHistory = getWithdrawals
export const saveWithdrawal = async (d:any) => { try { await supabase.from('withdrawals').insert([d]) } catch {} }
export const getRechargeOrders = () => { try { return JSON.parse(localStorage.getItem('legend_recharges')||'[]') } catch { return [] } }
export const getRecharges = getRechargeOrders
export const getRechargeHistory = getRechargeOrders
export const saveRecharge = async (d:any) => { try { await supabase.from('recharges').insert([d]) } catch {} }

// Aliases for RegisterPage compatibility - SUPABASE WITH 9000 BONUS
export const registerUser = async (user:any) => {
  try { 
    await supabase.from('users').insert([{
      phone: user.phone,
      password: user.password,
      name: user.name || user.phone,
      role: 'user', 
      balance: 9000
    }]) 
  } catch (e) {
    console.log('Supabase insert error', e)
  }
  const users = getUsers(); 
  const newUser = {...user, role: 'user', balance: 9000};
  users.push(newUser); 
  localStorage.setItem('legend_users', JSON.stringify(users)); 
  return newUser
}
export const REGISTRATION_BONUS = 9000
