import { useState } from 'react';
import {
  Users, CreditCard, ArrowDownToLine, BarChart3, Check, X, Search,
  LogOut, Shield, TrendingUp, Gift, Bell, DollarSign, Trash2, Eye, Copy, Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  getUsers, getRechargeOrders, getWithdrawOrders, getUserProducts,
  approveRechargeOrder, rejectRechargeOrder, approveWithdrawOrder, rejectWithdrawOrder,
  setCurrentUser, formatUGX, updateUser, addTransaction, getTransactions,
  getGiftCodes, createGiftCode, deleteGiftCode,
  getPasswordResets, approvePasswordReset, rejectPasswordReset
} from '@/lib/storage';
import type { GiftCode, PasswordResetRequest, User, RechargeOrder, WithdrawOrder } from '@/lib/storage';
import { PRODUCTS } from '@/constants/products';

type AdminTab = 'overview' | 'users' | 'recharge' | 'withdraw' | 'products' | 'gifts' | 'resets';

export default function AdminPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<AdminTab>('overview');
  const [searchQ, setSearchQ] = useState('');
  const [refresh, setRefresh] = useState(0);

  // force re-read from storage on refresh
  const users = getUsers().filter(u =>!u.isAdmin);
  const rechargeOrders = getRechargeOrders();
  const withdrawOrders = getWithdrawOrders();

  const pendingRecharge = rechargeOrders.filter(o => o.status === 'pending');
  const pendingWithdraw = withdrawOrders.filter(o => o.status === 'pending');
  const totalBalance = users.reduce((s, u) => s + u.balance, 0);
  const totalRecharge = rechargeOrders.filter(o => o.status === 'completed').reduce((s, o) => s + o.amount, 0);

  const filteredUsers = users.filter(u =>
    u.phone.toLowerCase().includes(searchQ.toLowerCase()) ||
    u.id.toLowerCase().includes(searchQ.toLowerCase())
  );

  const passwordResets = getPasswordResets();
  const pendingResets = passwordResets.filter(r => r.status === 'pending');

  const tabs: { key: AdminTab; label: string; icon: any; badge?: number }[] = [
    { key: 'overview', label: 'Overview', icon: BarChart3 },
    { key: 'users', label: 'Users', icon: Users, badge: users.length },
    { key: 'recharge', label: 'Recharge', icon: CreditCard, badge: pendingRecharge.length },
    { key: 'withdraw', label: 'Withdraw', icon: ArrowDownToLine, badge: pendingWithdraw.length },
    { key: 'products', label: 'Products', icon: TrendingUp },
    { key: 'resets', label: 'Resets', icon: Shield, badge: pendingResets.length },
    { key: 'gifts', label: 'Tools', icon: Gift },
  ];

  return (
    <div className="min-h-screen p-4" style={{ background: '#0a0a0a' }}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 mb-4 rounded-2xl" style={{ background: '#111', border: '1px solid #2a2a2a' }}>
        <div className="flex items-center gap-2">
          <Shield size={18} className="text-[#c9a84c]" />
          <span className="text-white font-black text-lg">Admin Panel</span>
        </div>
        <button onClick={() => { setCurrentUser(null); navigate('/login'); }} className="flex items-center gap-2 text-gray-400 text-sm">
          <LogOut size={14} /> Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto mb-4 pb-2">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap ${tab === t.key? 'text-black gold-gradient' : 'text-gray-400'}`}
            style={tab!== t.key? { background: '#151515', border: '1px solid #2a2a2a' } : {}}>
            <t.icon size={14} /> {t.label} {t.badge? `(${t.badge})` : ''}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {tab === 'overview' && (
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl p-4" style={{ background: '#151515' }}><p className="text-gray-500 text-xs">Total Users</p><p className="text-white font-black text-xl">{users.length}</p></div>
          <div className="rounded-2xl p-4" style={{ background: '#151515' }}><p className="text-gray-500 text-xs">Total Balance</p><p className="text-[#c9a84c] font-black text-xl">{formatUGX(totalBalance)}</p></div>
          <div className="rounded-2xl p-4" style={{ background: '#151515' }}><p className="text-gray-500 text-xs">Total Deposits</p><p className="text-white font-black text-xl">{formatUGX(totalRecharge)}</p></div>
          <div className="rounded-2xl p-4" style={{ background: '#151515' }}><p className="text-gray-500 text-xs">Pending Withdraw</p><p className="text-yellow-400 font-black text-xl">{pendingWithdraw.length}</p></div>
        </div>
      )}

      {/* USERS */}
      {tab === 'users' && (
        <div className="rounded-2xl p-4" style={{ background: '#151515', border: '1px solid #2a2a2a' }}>
          <div className="flex items-center gap-2 mb-3 rounded-xl px-3 py-2" style={{ background: '#1e1e1e', border: '1px solid #333' }}>
            <Search size={14} className="text-gray-500" />
            <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search phone or ID..."
              className="bg-transparent outline-none text-white text-sm w-full" />
          </div>
          <p className="text-white font-bold text-sm mb-2">All Users ({filteredUsers.length})</p>
          {filteredUsers.length === 0? <p className="text-gray-600 text-xs py-4 text-center">No users found</p> : (
            <div className="space-y-2">
              {filteredUsers.map(u => (
                <div key={u.id} className="rounded-xl p-3 flex justify-between" style={{ background: '#1e1e1e' }}>
                  <div><p className="text-white text-sm font-bold">{u.phone}</p><p className="text-gray-500 text-[10px]">{u.id}</p></div>
                  <div className="text-right"><p className="text-[#c9a84c] text-sm font-bold">{formatUGX(u.balance)}</p></div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* RECHARGE */}
      {tab === 'recharge' && (
        <div className="space-y-2">
          {rechargeOrders.length === 0? <p className="text-gray-500 text-center py-8">No recharge orders</p> : rechargeOrders.map(o => (
            <div key={o.id} className="rounded-xl p-3" style={{ background: '#151515', border: '1px solid #2a2a2a' }}>
              <div className="flex justify-between"><span className="text-white text-sm">{o.userId}</span><span className="text-[#c9a84c] text-sm">{formatUGX(o.amount)}</span></div>
              <div className="flex gap-2 mt-2">
                {o.status === 'pending' && <>
                  <button onClick={() => { approveRechargeOrder(o.id); setRefresh(r=>r+1); toast.success('Approved'); }} className="px-3 py-1.5 rounded-lg bg-green-500/20 text-green-400 text-xs flex items-center gap-1"><Check size={12}/> Approve</button>
                  <button onClick={() => { rejectRechargeOrder(o.id); setRefresh(r=>r+1); toast.success('Rejected'); }} className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs flex items-center gap-1"><X size={12}/> Reject</button>
                </>}
                <span className="text-[10px] px-2 py-1 rounded-full" style={{ background: o.status==='completed'?'rgba(201,168,76,0.1)':'rgba(251,191,36,0.1)', color: o.status==='completed'?'#c9a84c':'#fbbf24' }}>{o.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* WITHDRAW */}
      {tab === 'withdraw' && (
        <div className="space-y-2">
          {withdrawOrders.map(o => (
            <div key={o.id} className="rounded-xl p-3" style={{ background: '#151515', border: '1px solid #2a2a2a' }}>
              <div className="flex justify-between"><span className="text-white text-sm">{o.userId}</span><span className="text-red-400 text-sm">{formatUGX(o.amount)}</span></div>
              {o.status === 'pending' && (
                <div className="flex gap-2 mt-2">
                  <button onClick={() => { approveWithdrawOrder(o.id); setRefresh(r=>r+1); toast.success('Approved'); }} className="px-3 py-1.5 rounded-lg bg-green-500/20 text-green-400 text-xs"><Check size={12}/> Approve</button>
                  <button onClick={() => { rejectWithdrawOrder(o.id); setRefresh(r=>r+1); }} className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs"><X size={12}/> Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === 'gifts' && <div className="text-gray-500 text-center py-8 text-sm">Use GiftTools component here - simplified for build fix</div>}
      {tab === 'products' && <div className="text-white text-sm">Products: {PRODUCTS.length} packages</div>}
      {tab === 'resets' && <div className="text-white text-sm">Pending Resets: {pendingResets.length}</div>}
    </div>
  );
}
