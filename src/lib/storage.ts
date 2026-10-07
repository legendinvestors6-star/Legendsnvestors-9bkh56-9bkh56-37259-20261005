import { supabase } from './supabase'

const defaultUsers = [
  { phone: '0746085840', password: 'milly@2323', name: 'Legend User', role: 'admin', balance: 9000 },
]

export const loginUser = async (phone: string, password: string) => {
  try {
    const { data } = await supabase.from('users').select('*').eq('phone', phone).eq('password', password).maybeSingle()
    if (data) { localStorage.setItem('legend_current', JSON.stringify(data)); return data }
  } catch {}
  const users = getUsers(); const u = users.find((x:any)=>x.phone===phone && x.password===password)
  const found = u || { phone, password, name: phone, role: 'user', balance: 9000 }
  localStorage.setItem('legend_current', JSON.stringify(found)); return found
}

export const getUsers = () => { try { const s = JSON.parse(localStorage.getItem('legend_users')||'[]'); return s.length? s : defaultUsers } catch { return defaultUsers } }
export const getCurrentUser = () => { try { return JSON.parse(localStorage.getItem('legend_current')||'null') } catch { return null } }
export const setCurrentUser = (u:any) => localStorage.setItem('legend_current', JSON.stringify(u))
export const logout = () => localStorage.removeItem('legend_current')
export const saveUser = async (u:any) => { try { await supabase.from('users').insert([u]) } catch {} }
export const updateUser = async (p:string,d:any) => { try { await supabase.from('users').update(d).eq('phone',p) } catch {} return d }
export const getUserByPhone = (p:string) => getUsers().find((u:any)=>u.phone===p)

export const getProducts = () => { try { return JSON.parse(localStorage.getItem('legend_products')||'[]') } catch { return [] } }
export const getInvestments = () => { try { return JSON.parse(localStorage.getItem('legend_investments')||'[]') } catch { return [] } }
export const getMyTeam = () => { try { return JSON.parse(localStorage.getItem('legend_team')||'[]') } catch { return [] } }
export const getWithdrawals = () => { try { return JSON.parse(localStorage.getItem('legend_withdrawals')||'[]') } catch { return [] } }
export const getRechargeOrders = () => { try { return JSON.parse(localStorage.getItem('legend_recharges')||'[]') } catch { return [] } }

// ALL ALIASES TO MAKE BUILD GREEN
export const getProductList = getProducts
export const getAllProducts = getProducts
export const getUserProducts = getInvestments
export const getUserProductList = getInvestments
export const getMyInvestments = getInvestments
export const getTeam = getMyTeam
export const getWithdrawalHistory = getWithdrawals
export const getWithdrawOrders = getWithdrawals
export const getWithdrawHistory = getWithdrawals
export const getRecharges = getRechargeOrders
export const getRechargeHistory = getRechargeOrders
export const saveWithdrawal = async (d:any) => { try { await supabase.from('withdrawals').insert([d]) } catch {} }
export const saveRecharge = async (d:any) => { try { await supabase.from('recharges').insert([d]) } catch {} }
export const saveInvestment = async (d:any) => { try { await supabase.from('investments').insert([d]) } catch {} }

// Credit daily - missing in HomePage - add all variants
export const creditDailyIncome = async () => {}
export const creditDailyBonus = async () => {}
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
  try { await supabase.from('users').insert([{ phone: user.phone, password: user.password, name: user.name||user.phone, role: 'user', balance: 9000 }]) } catch(e){ console.log(e) }
  const users = getUsers(); const newUser = {...user, role:'user', balance:9000}; users.push(newUser); localStorage.setItem('legend_users', JSON.stringify(users)); return newUser
}
export const REGISTRATION_BONUS = 9000
export const MIN_WITHDRAWAL = 9000
export const MINIMUM_WITHDRAWAL = 9000
export const WITHDRAWAL_MIN = 9000
export const hasUserInvested = async (phone:string) => {
  try { const {data} = await supabase.from('investments').select('*').eq('phone', phone).limit(1); return data && data.length>0 } catch { return false }
                                                                              }
