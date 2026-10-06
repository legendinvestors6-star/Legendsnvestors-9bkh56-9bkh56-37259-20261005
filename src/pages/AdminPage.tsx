import { useEffect, useState } from 'react';
import { getUsers, creditUser, deductUser, getRechargeOrders, approveRechargeOrder, rejectRechargeOrder, getWithdrawOrders, approveWithdrawOrder, rejectWithdrawOrder, formatUGX } from '@/lib/storage';

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [recharges, setRecharges] = useState<any[]>([]);
  const [withdraws, setWithdraws] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [filter, setFilter] = useState('');

  async function loadAll() {
    setLoading(true);
    try {
      const [u, r, w] = await Promise.all([getUsers(), getRechargeOrders(), getWithdrawOrders()]);
      setUsers(u);
      setRecharges(r);
      setWithdraws(w);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  useEffect(() => { loadAll(); }, []);

  const handleCredit = async () => {
    if (!selectedUser || !amount) return alert('Select user and enter amount');
    await creditUser(selectedUser, Number(amount));
    alert(`Credited ${formatUGX(Number(amount))} successfully! User will see it instantly on all devices.`);
    setAmount(''); loadAll();
  };
  const handleDeduct = async () => {
    if (!selectedUser || !amount) return alert('Select user and enter amount');
    await deductUser(selectedUser, Number(amount));
    alert(`Deducted ${formatUGX(Number(amount))} successfully!`);
    setAmount(''); loadAll();
  };

  const filteredUsers = users.filter(u => u.phone.includes(filter) || u.id.includes(filter));

  if (loading) return <div className="p-6 text-center">Loading REAL database... Please wait</div>;

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-6 pb-20">
      <h1 className="text-2xl font-bold">ADMIN - REAL FULL CONTROL</h1>
      <p className="text-green-600 font-semibold">Connected to Supabase: {users.length} users, {recharges.length} recharges, {withdraws.length} withdraws - REAL for everyone!</p>

      {/* CREDIT / DEDUCT */}
      <div className="bg-white p-4 rounded-lg shadow border">
        <h2 className="font-bold text-lg mb-3">💰 Credit / Deduct ANY User (Instant for ALL devices)</h2>
        <input placeholder="Search phone" value={filter} onChange={e=>setFilter(e.target.value)} className="border p-2 rounded w-full mb-3" />
        <select value={selectedUser} onChange={e=>setSelectedUser(e.target.value)} className="border p-2 rounded w-full mb-3">
          <option value="">Select User</option>
          {filteredUsers.map((u:any)=><option key={u.id} value={u.id}>{u.phone} - Balance: {formatUGX(u.balance)} {u.isAdmin?'(ADMIN)':''}</option>)}
        </select>
        <div className="flex gap-2">
          <input type="number" placeholder="Amount UGX" value={amount} onChange={e=>setAmount(e.target.value)} className="border p-2 rounded flex-1" />
          <button onClick={handleCredit} className="bg-green-600 text-white px-4 py-2 rounded font-bold">CREDIT +</button>
          <button onClick={handleDeduct} className="bg-red-600 text-white px-4 py-2 rounded font-bold">DEDUCT -</button>
        </div>
      </div>

      {/* USERS */}
      <div className="bg-white p-4 rounded-lg shadow border">
        <h2 className="font-bold mb-2">All Users ({users.length})</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-100"><th className="p-2 text-left">Phone</th><th className="p-2">Balance</th><th className="p-2">Income</th><th className="p-2">Action</th></tr></thead>
            <tbody>
              {users.map((u:any)=><tr key={u.id} className="border-t"><td className="p-2">{u.phone}</td><td className="p-2">{formatUGX(u.balance)}</td><td className="p-2">{formatUGX(u.cumulativeIncome||0)}</td><td className="p-2 flex gap-1"><button onClick={()=>{setSelectedUser(u.id); window.scrollTo(0,0);}} className="bg-blue-500 text-white px-2 py-1 rounded text-xs">Select</button></td></tr>)}
            </tbody>
          </table>
        </div>
      </div>

      {/* RECHARGES */}
      <div className="bg-white p-4 rounded-lg shadow border">
        <h2 className="font-bold mb-2">Recharge Requests - Pending ({recharges.filter((r:any)=>r.status==='pending').length})</h2>
        <div className="space-y-2">
          {recharges.map((r:any)=><div key={r.id} className="border p-2 rounded flex justify-between items-center">
            <div><div className="font-bold">{formatUGX(r.amount)} - {r.phoneNumber||r.userId}</div><div className="text-xs text-gray-500">{r.status} - {new Date(r.createdAt).toLocaleString()}</div></div>
            <div className="flex gap-1">
              {r.status==='pending' && <><button onClick={async()=>{await approveRechargeOrder(r.id); alert('Approved! Balance credited instantly'); loadAll();}} className="bg-green-600 text-white px-3 py-1 rounded text-xs">Approve</button><button onClick={async()=>{await rejectRechargeOrder(r.id); loadAll();}} className="bg-red-600 text-white px-3 py-1 rounded text-xs">Reject</button></>}
              {r.status!=='pending' && <span className={`text-xs px-2 py-1 rounded ${r.status==='completed'?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>{r.status}</span>}
            </div>
          </div>)}
          {recharges.length===0 && <p className="text-gray-500 text-sm">No recharges</p>}
        </div>
      </div>

      {/* WITHDRAWS */}
      <div className="bg-white p-4 rounded-lg shadow border">
        <h2 className="font-bold mb-2">Withdraw Requests - Pending ({withdraws.filter((w:any)=>w.status==='pending').length})</h2>
        <div className="space-y-2">
          {withdraws.map((w:any)=><div key={w.id} className="border p-2 rounded flex justify-between items-center">
            <div><div className="font-bold">{formatUGX(w.amount)} (Gets {formatUGX(w.receivedAmount||w.amount)})</div><div className="text-xs text-gray-500">{w.status} - {new Date(w.createdAt).toLocaleString()} - {w.bankCard?.accountNumber||''}</div></div>
            <div className="flex gap-1">
              {w.status==='pending' && <><button onClick={async()=>{await approveWithdrawOrder(w.id); alert('Withdraw approved'); loadAll();}} className="bg-green-600 text-white px-3 py-1 rounded text-xs">Approve</button><button onClick={async()=>{await rejectWithdrawOrder(w.id); alert('Rejected & refunded'); loadAll();}} className="bg-red-600 text-white px-3 py-1 rounded text-xs">Reject & Refund</button></>}
              {w.status!=='pending' && <span className={`text-xs px-2 py-1 rounded ${w.status==='completed'?'bg-green-100':'bg-red-100'}`}>{w.status}</span>}
            </div>
          </div>)}
          {withdraws.length===0 && <p className="text-gray-500 text-sm">No withdraws</p>}
        </div>
      </div>

      <button onClick={loadAll} className="w-full bg-black text-white py-3 rounded font-bold">🔄 Refresh REAL Data</button>
    </div>
  );
          }
