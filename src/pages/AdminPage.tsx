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
import type { PasswordResetRequest } from '@/lib/storage';
import type { GiftCode } from '@/lib/storage';
import type { User, RechargeOrder, WithdrawOrder } from '@/types';

function GiftToolsTab({ users, rechargeOrders, withdrawOrders, onRefresh }: {
  users: User[];
  rechargeOrders: RechargeOrder[];
  withdrawOrders: WithdrawOrder[];
  onRefresh: () => void;
}) {
  const [giftCode, setGiftCode] = useState('');
  const [giftAmount, setGiftAmount] = useState('');
  const [giftNote, setGiftNote] = useState('');
  const [giftExpiry] = useState('');
  const [creditUser, setCreditUser] = useState('');
  const [creditAmount, setCreditAmount] = useState('');
  const [creditNote, setCreditNote] = useState('');
  const [deductUser, setDeductUser] = useState('');
  const [deductAmount, setDeductAmount] = useState('');
  const [giftCodes, setGiftCodes] = useState<GiftCode[]>(() => getGiftCodes());

  const refreshCodes = () => setGiftCodes(getGiftCodes());

  return (
    <div className="space-y-4">
      {/* Create Gift Code */}
      <div className="rounded-2xl p-4" style={{ background: '#151515', border: '1px solid rgba(201,168,76,0.3)' }}>
        <div className="flex items-center gap-2 mb-3">
          <Gift size={16} className="text-[#c9a84c]" />
          <p className="text-white font-bold text-sm">Create Gift Code</p>
        </div>
        <div className="space-y-2">
          <input value={giftCode} onChange={e => setGiftCode(e.target.value.toUpperCase())}
            placeholder="Custom code (optional — auto-generated if empty)"
            className="w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none uppercase tracking-widest"
            style={{ background: '#1e1e1e', border: '1px solid #333' }} />
          <input value={giftAmount} onChange={e => setGiftAmount(e.target.value)}
            type="number" placeholder="Amount (UGX)"
            className="w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none bg-transparent"
            style={{ background: '#1e1e1e', border: '1px solid #333' }} />
          <input value={giftNote} onChange={e => setGiftNote(e.target.value)}
            placeholder="Note (optional)"
            className="w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none bg-transparent"
            style={{ background: '#1e1e1e', border: '1px solid #333' }} />
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)' }}>
            <span className="text-yellow-400 text-xs">⏱</span>
            <span className="text-yellow-300 text-xs font-medium">Code expires automatically 30 minutes after creation</span>
          </div>
          <button onClick={() => {
            const amt = parseInt(giftAmount);
            if (amt <= 0 || isNaN(amt)) { toast.error('Enter a valid amount'); return; }
            const created = createGiftCode(amt, giftNote || undefined, giftCode || undefined);
            toast.success(`Gift code created: ${created.code}`);
            setGiftCode(''); setGiftAmount(''); setGiftNote('');
            refreshCodes(); onRefresh();
          }} className="w-full py-3 rounded-xl font-bold text-black text-sm gold-gradient flex items-center justify-center gap-2">
            <Plus size={15} /> Generate Gift Code
          </button>
        </div>
      </div>

      {/* Gift Code Summary Stats */}
      <div className="rounded-2xl p-4" style={{ background: '#151515', border: '1px solid rgba(201,168,76,0.25)' }}>
        <p className="text-white font-bold text-sm mb-3">Gift Code Summary</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Total Created', value: giftCodes.length, color: '#c9a84c' },
            { label: 'Total Redeemed', value: giftCodes.filter(c => c.usedBy).length, color: '#22c55e' },
            { label: 'UGX Distributed', value: formatUGX(giftCodes.filter(c => c.usedBy).reduce((s, c) => s + c.amount, 0)), color: '#f0c040' },
            { label: 'Available / Expired', value: `${giftCodes.filter(c => !c.usedBy && !(c.expiresAt && new Date(c.expiresAt) < new Date())).length} / ${giftCodes.filter(c => !c.usedBy && c.expiresAt && new Date(c.expiresAt) < new Date()).length}`, color: '#60a5fa' },
          ].map(stat => (
            <div key={stat.label} className="rounded-xl p-3 text-center" style={{ background: '#1e1e1e' }}>
              <p className="font-black text-sm" style={{ color: stat.color }}>{stat.value}</p>
              <p className="text-gray-600 text-[10px] mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Active Gift Codes */}
      <div className="rounded-2xl p-4" style={{ background: '#151515', border: '1px solid #2a2a2a' }}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-white font-bold text-sm">Gift Codes ({giftCodes.length})</p>
          <span className="text-[10px] text-gray-500">{giftCodes.filter(c => !c.usedBy).length} available</span>
        </div>
        {giftCodes.length === 0 ? (
          <p className="text-gray-600 text-xs text-center py-4">No gift codes yet. Create one above.</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {giftCodes.map(gc => (
              <div key={gc.id} className="rounded-xl p-3 flex items-center justify-between"
                style={{ background: '#1e1e1e', border: `1px solid ${gc.usedBy ? '#2a2a2a' : 'rgba(201,168,76,0.2)'}` }}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-black tracking-widest text-sm" style={{ color: gc.usedBy ? '#555' : '#c9a84c' }}>{gc.code}</span>
                    {!gc.usedBy && (
                      <button onClick={() => { navigator.clipboard.writeText(gc.code); toast.success('Copied!'); }}
                        className="w-5 h-5 rounded flex items-center justify-center" style={{ background: '#333' }}>
                        <Copy size={11} className="text-gray-400" />
                      </button>
                    )}
                  </div>
                  <p className="text-[#c9a84c] text-xs font-bold">{formatUGX(gc.amount)}</p>
                  {gc.note && <p className="text-gray-600 text-[10px]">{gc.note}</p>}
                  {gc.usedBy ? (() => {
                    const redeemer = users.find(u => u.id === gc.usedBy);
                    const redeemedAt = gc.usedAt ? new Date(gc.usedAt) : null;
                    return (
                      <div className="mt-1 rounded-lg p-1.5" style={{ background: 'rgba(34,197,94,0.08)' }}>
                        <p className="text-green-400 text-[10px] font-semibold">✓ Redeemed by: {redeemer?.phone || gc.usedBy}</p>
                        {redeemedAt && (
                          <p className="text-green-600 text-[9px]">{redeemedAt.toLocaleDateString()} at {redeemedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        )}
                      </div>
                    );
                  })() : gc.expiresAt && new Date(gc.expiresAt) < new Date() ? (
                    <p className="text-red-400 text-[10px]">Expired · {new Date(gc.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  ) : gc.expiresAt ? (() => {
                    const msLeft = new Date(gc.expiresAt).getTime() - Date.now();
                    const minLeft = Math.max(0, Math.floor(msLeft / 60000));
                    const secLeft = Math.max(0, Math.floor((msLeft % 60000) / 1000));
                    return <p className="text-yellow-400 text-[10px]">⏱ Expires in {minLeft}m {secLeft}s</p>;
                  })() : (
                    <p className="text-gray-600 text-[10px]">No expiry · {new Date(gc.createdAt).toLocaleDateString()}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-2">
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold"
                    style={gc.usedBy
                      ? { background: 'rgba(34,197,94,0.1)', color: '#22c55e' }
                      : gc.expiresAt && new Date(gc.expiresAt) < new Date()
                        ? { background: 'rgba(239,68,68,0.1)', color: '#ef4444' }
                        : { background: 'rgba(201,168,76,0.1)', color: '#c9a84c' }}>
                    {gc.usedBy ? 'USED' : gc.expiresAt && new Date(gc.expiresAt) < new Date() ? 'EXPIRED' : 'ACTIVE'}
                  </span>
                  <button onClick={() => { deleteGiftCode(gc.id); refreshCodes(); toast.success('Deleted'); }}
                    className="w-6 h-6 rounded flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.1)' }}>
                    <Trash2 size={11} className="text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Credit Balance */}
      <div className="rounded-2xl p-4" style={{ background: '#151515', border: '1px solid #2a2a2a' }}>
        <div className="flex items-center gap-2 mb-3">
          <DollarSign size={16} className="text-[#c9a84c]" />
          <p className="text-white font-bold text-sm">Credit Balance to User</p>
        </div>
        <div className="space-y-2">
          <select value={creditUser} onChange={e => setCreditUser(e.target.value)}
            className="w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none"
            style={{ background: '#1e1e1e', border: '1px solid #333' }}>
            <option value="">Select user...</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.phone} — {formatUGX(u.balance)}</option>)}
          </select>
          <input value={creditAmount} onChange={e => setCreditAmount(e.target.value)} type="number" placeholder="Amount (UGX)"
            className="w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none bg-transparent"
            style={{ background: '#1e1e1e', border: '1px solid #333' }} />
          <input value={creditNote} onChange={e => setCreditNote(e.target.value)} type="text" placeholder="Note (optional)"
            className="w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none bg-transparent"
            style={{ background: '#1e1e1e', border: '1px solid #333' }} />
          <button onClick={() => {
            const amt = parseInt(creditAmount);
            if (!creditUser) { toast.error('Select a user'); return; }
            if (!amt || amt <= 0) { toast.error('Enter a valid amount'); return; }
            const usr = getUsers().find(u => u.id === creditUser);
            if (!usr) return;
            updateUser(creditUser, { balance: usr.balance + amt, cumulativeIncome: usr.cumulativeIncome + amt });
            addTransaction({ userId: creditUser, type: 'income', amount: amt, status: 'completed', description: creditNote || 'Admin credit' });
            toast.success(`Credited ${formatUGX(amt)} to ${usr.phone}`);
            setCreditUser(''); setCreditAmount(''); setCreditNote(''); onRefresh();
          }} className="w-full py-3 rounded-xl font-bold text-black text-sm gold-gradient">Credit Balance</button>
        </div>
      </div>

      {/* Deduct Balance */}
      <div className="rounded-2xl p-4" style={{ background: '#151515', border: '1px solid #2a2a2a' }}>
        <div className="flex items-center gap-2 mb-3">
          <Trash2 size={16} className="text-red-400" />
          <p className="text-white font-bold text-sm">Deduct Balance</p>
        </div>
        <div className="space-y-2">
          <select value={deductUser} onChange={e => setDeductUser(e.target.value)}
            className="w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none"
            style={{ background: '#1e1e1e', border: '1px solid #333' }}>
            <option value="">Select user...</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.phone} — {formatUGX(u.balance)}</option>)}
          </select>
          <input value={deductAmount} onChange={e => setDeductAmount(e.target.value)} type="number" placeholder="Amount to deduct (UGX)"
            className="w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none bg-transparent"
            style={{ background: '#1e1e1e', border: '1px solid #333' }} />
          <button onClick={() => {
            const amt = parseInt(deductAmount);
            if (!deductUser) { toast.error('Select a user'); return; }
            if (!amt || amt <= 0) { toast.error('Enter a valid amount'); return; }
            const usr = getUsers().find(u => u.id === deductUser);
            if (!usr) return;
            if (amt > usr.balance) { toast.error('Amount exceeds user balance'); return; }
            updateUser(deductUser, { balance: usr.balance - amt });
            addTransaction({ userId: deductUser, type: 'withdraw', amount: -amt, status: 'completed', description: 'Admin deduction' });
            toast.success(`Deducted ${formatUGX(amt)} from ${usr.phone}`);
            setDeductUser(''); setDeductAmount(''); onRefresh();
          }} className="w-full py-3 rounded-xl font-bold text-red-400 text-sm"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>Deduct Balance</button>
        </div>
      </div>

      {/* Platform Stats */}
      <div className="rounded-2xl p-4" style={{ background: '#151515', border: '1px solid #2a2a2a' }}>
        <div className="flex items-center gap-2 mb-3">
          <Bell size={16} className="text-yellow-400" />
          <p className="text-white font-bold text-sm">Platform Stats</p>
        </div>
        <div className="space-y-2">
          {[
            { label: 'Total Users', value: users.length },
            { label: 'Total Recharge Orders', value: rechargeOrders.length },
            { label: 'Total Withdraw Orders', value: withdrawOrders.length },
            { label: 'Completed Recharges', value: formatUGX(rechargeOrders.filter(o => o.status === 'completed').reduce((s, o) => s + o.amount, 0)) },
            { label: 'Pending Withdrawals', value: formatUGX(withdrawOrders.filter(o => o.status === 'pending').reduce((s, o) => s + o.amount, 0)) },
            { label: 'Total Platform Balances', value: formatUGX(users.reduce((s, u) => s + u.balance, 0)) },
            { label: 'Active Gift Codes', value: getGiftCodes().filter(c => !c.usedBy).length },
          ].map(stat => (
            <div key={stat.label} className="flex justify-between items-center py-2" style={{ borderBottom: '1px solid #222' }}>
              <span className="text-gray-500 text-xs">{stat.label}</span>
              <span className="text-white font-bold text-sm">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* View User Transactions */}
      <div className="rounded-2xl p-4" style={{ background: '#151515', border: '1px solid #2a2a2a' }}>
        <div className="flex items-center gap-2 mb-3">
          <Eye size={16} className="text-blue-400" />
          <p className="text-white font-bold text-sm">View User Transactions</p>
        </div>
        <select onChange={(e) => {
          const uid = e.target.value;
          if (!uid) return;
          const txs = getTransactions(uid);
          const usr = getUsers().find(u => u.id === uid);
          alert(`${usr?.phone} — ${txs.length} transactions\n\n` +
            txs.slice(0, 10).map(t => `${t.type.toUpperCase()}: ${t.amount >= 0 ? '+' : ''}${t.amount} UGX — ${t.description} (${t.status})`).join('\n'));
        }} className="w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none"
          style={{ background: '#1e1e1e', border: '1px solid #333' }}>
          <option value="">Select user to view transactions...</option>
          {users.map(u => <option key={u.id} value={u.id}>{u.phone} — {formatUGX(u.balance)}</option>)}
        </select>
      </div>
    </div>
  );
}
import { PRODUCTS } from '@/constants/products';

type AdminTab = 'overview' | 'users' | 'recharge' | 'withdraw' | 'products' | 'gifts' | 'resets';

export default function AdminPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<AdminTab>('overview');
  const [searchQ, setSearchQ] = useState('');
  const [refresh, setRefresh] = useState(0);

  const users = getUsers().filter(u => !u.isAdmin);
  const rechargeOrders = getRechargeOrders();
  const withdrawOrders = getWithdrawOrders();
  const userProducts = getUserProducts();

  const pendingRecharge = rechargeOrders.filter(o => o.status === 'pending');
  const pendingWithdraw = withdrawOrders.filter(o => o.status === 'pending');
  const totalBalance = users.reduce((s, u) => s + u.balance, 0);
  const totalRecharge = rechargeOrders.filter(o => o.status === 'completed').reduce((s, o) => s + o.amount, 0);

  const handleApproveRecharge = (orderId: string) => {
    approveRechargeOrder(orderId);
    toast.success('Recharge approved');
    setRefresh(r => r + 1);
  };

  const handleRejectRecharge = (orderId: string) => {
    rejectRechargeOrder(orderId);
    toast.success('Recharge rejected');
    setRefresh(r => r + 1);
  };

  const handleApproveWithdraw = (orderId: string) => {
    approveWithdrawOrder(orderId);
    toast.success('Withdrawal approved');
    setRefresh(r => r + 1);
  };

  const handleRejectWithdraw = (orderId: string) => {
    rejectWithdrawOrder(orderId);
    toast.success('Withdrawal rejected');
    setRefresh(r => r + 1);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/login');
  };

  const filteredUsers = users.filter(u => u.phone.toLowerCase().includes(searchQ.toLowerCase()));

  const passwordResets = getPasswordResets();
  const pendingResets = passwordResets.filter(r => r.status === 'pending');

  const tabs: { key: AdminTab; label: string; icon: typeof BarChart3; badge?: number }[] = [
    { key: 'overview', label: 'Overview', icon: BarChart3 },
    { key: 'users', label: 'Users', icon: Users, badge: users.length },
    { key: 'recharge', label: 'Recharge', icon: CreditCard, badge: pendingRecharge.length },
    { key: 'withdraw', label: 'Withdraw', icon: ArrowDownToLine, badge: pendingWithdraw.length },
    { key: 'products', label: 'Products', icon: TrendingUp },
    { key: 'resets', label: 'Resets', icon: Shield, badge: pendingResets.length },
    { key: 'gifts', label: 'Tools', icon: Gift },
  ];

  const getStatusStyle = (status: string) => {
    if (status === 'completed') return { background: 'rgba(201,168,76,0.1)', color: '#c9a84c' };
    if (status === 'pending') return { background: 'rgba(251,191,36,0.1)', color: '#fbbf24' };
    return { background: 'rgba(239,68,68,0.1)', color: '#ef4444' };
  };

  return (
    <div className="app-container min-h-screen" style={{ background: '#0a0a0a' }}>
      {/* Admin Header */}
      <div className="flex items-center justify-between p-4" style={{ background: '#111111', borderBottom: '1px solid #2a2a2a' }}>
        <div className="flex items-center gap-2">
          <Shield size={18} className="text-[#c9a84c]" />
          <span className="text-white font-black text-lg">Admin Panel</span>
