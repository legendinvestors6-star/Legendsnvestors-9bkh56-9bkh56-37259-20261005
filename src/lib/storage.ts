import { supabase } from './supabase'
export const PRODUCTS = [
  { id: '1', name: 'Starter', price: 100, dailyProfit: 5, duration: 30 },
  { id: '2', name: 'Growth', price: 500, dailyProfit: 30, duration: 30 },
] as any[]
const getUsersSafe = () => {
  try { return JSON.parse(localStorage.getItem('legend_users') || '[]') } catch { return [] }
}
export const getUsers = () => getUsersSafe()
export const registerUser = async (user:any) => {
  const users = getUsersSafe(); users.push(user);
  localStorage.setItem('legend_users', JSON.stringify(users));
  localStorage.setItem('legend_current_user', JSON.stringify(user));
  return user;
}
export const getCurrentUser = () => {
  try { return JSON.parse(localStorage.getItem('legend_current_user') || 'null') } catch { return null }
}
export const getUserByPhone = (p:string) => getUsersSafe().find((u:any) => u.phone === p) || null
export const saveCurrentUser = (u:any) => localStorage.setItem('legend_current_user', JSON.stringify(u))
export const loginUser = async (p:string, pw:string) => {
  const users = getUsersSafe();
  const u = users.find((x:any) => x.phone === p && x.password === pw);
  if (u) { localStorage.setItem('legend_current_user', JSON.stringify(u)); return u; }
  return null;
}
export const logoutUser = () => localStorage.removeItem('legend_current_user')
export const createUser = async (u:any) => registerUser(u)
export const getTeamMembers = (p?:string) => ({ level1: [] as any[], level2: [] as any[], level3: [] as any[] })
export const getTeamCommissions = (p?:string) => [] as any[]
export const getTeamCommission = getTeamCommissions
export const getTeamCounts = () => ({ level1: 0, level2: 0, level3: 0 })
export const getRechargeOrders = () => [] as any[]
export const getWithdrawOrders = () => [] as any[]
export const getInvestments = () => [] as any[]
export const updateUser = async () => true
export const addTransaction = async () => true
export const approveRechargeOrder = async () => true
export const approveWithdrawOrder = async () => true
export const approvePasswordReset = async () => true
export const getRecharge = () => [] as any[]
export const getWithdrawals = () => [] as any[]
export const getTransactions = () => [] as any[]
export const getProducts = () => PRODUCTS
export const getProduct = (id:string) => PRODUCTS.find((p:any) => p.id === id)
export const formatPrice = (n:number) => `$${n}`
export const formatDate = (d:any) => new Date(d).toLocaleDateString()
export const formatKWF = (n:any) => `${n}`
export const formatUGX = formatKWF
export const formatCurrency = formatUGX
export const formatMoney = formatUGX
export const creditDailyProfit = async () => true
export const deleteUser = async () => true
export const blockUser = async () => true
export const unblockUser = async () => true
