import { supabase } from './supabase'

const defaultUsers = [
  { phone: '0746085840', password: 'milly@2323', name: 'Legend User', role: 'admin', balance: 50000 },
  { phone: '0746085840', password: 'milly@2323', name: 'Legend User', role: 'admin', balance: 50000 }
]

export const loginUser = async (phone: string, password: string) => {
  // Try Supabase
  const { data, error } = await supabase.from('users').select('*').eq('phone', phone).eq('password', password).maybeSingle()
  if (data) {
    localStorage.setItem('legend_current', JSON.stringify(data))
    return data
  }
  // Fallback
  const user = defaultUsers.find(u => u.phone === phone && u.password === password)
  if (user) {
    localStorage.setItem('legend_current', JSON.stringify(user))
    return user
  }
  throw new Error('Wrong phone or password')
}

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
export const createPasswordReset = async () => true
export const getPasswordResets = () => []
export const getProducts = () => { try { return JSON.parse(localStorage.getItem('legend_products')||'[]') } catch { return [] } }
export const getInvestments = () => { try { return JSON.parse(localStorage.getItem('legend_investments')||'[]') } catch { return [] } }
export const getMyTeam = () => { try { return JSON.parse(localStorage.getItem('legend_team')||'[]') } catch { return [] } }
export const getWithdrawals = () => { try { return JSON.parse(localStorage.getItem('legend_withdrawals')||'[]') } catch { return [] } }
export const getWithdrawalHistory = () => { try { return JSON.parse(localStorage.getItem('legend_withdrawals')||'[]') } catch { return [] } }
export const getWithdrawOrders = () => { try { return JSON.parse(localStorage.getItem('legend_withdrawals')||'[]') } catch { return [] } }
export const saveWithdrawal = async (d:any) => { try { await supabase.from('withdrawals').insert([d]) } catch {} }
export const getRechargeOrders = () => { try { return JSON.parse(localStorage.getItem('legend_recharges')||'[]') } catch { return [] } }
export const getRecharges = () => { try { return JSON.parse(localStorage.getItem('legend_recharges')||'[]') } catch { return [] } }
export const saveRecharge = async (d:any) => { try { await supabase.from('recharges').insert([d]) } catch {} }
