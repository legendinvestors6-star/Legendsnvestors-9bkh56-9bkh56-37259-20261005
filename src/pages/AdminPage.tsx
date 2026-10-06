import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [selected, setSelected] = useState('');

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('users').select('*').order('created_at', {ascending:false});
    setUsers(data||[]);
    setLoading(false);
  }
  useEffect(()=>{load()},[]);

  async function credit() {
    if(!selected || !amount) return alert('Select user & amount');
    const u = users.find(x=>x.id===selected);
    await supabase.from('users').update({ balance: Number(u.balance)+Number(amount) }).eq('id', selected);
    alert('Credited! Real for everyone!');
    load();
  }
  async function deduct() {
    if(!selected || !amount) return alert('Select user & amount');
    const u = users.find(x=>x.id===selected);
    await supabase.from('users').update({ balance: Math.max(0, Number(u.balance)-Number(amount)) }).eq('id', selected);
    alert('Deducted!');
    load();
  }

  if(loading) return <div className="p-6">Loading real database...</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">ADMIN - REAL FULL CONTROL</h1>
      <p className="text-green-600 mb-4">{users.length} users from Supabase - REAL for all devices</p>
      
      <div className="bg-white border p-4 rounded mb-4">
        <select value={selected} onChange={e=>setSelected(e.target.value)} className="border p-2 w-full mb-2 rounded">
          <option value="">Select user</option>
          {users.map((u:any)=><option key={u.id} value={u.id}>{u.phone} - {u.balance} UGX</option>)}
        </select>
        <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Amount" className="border p-2 w-full mb-2 rounded" />
        <div className="flex gap-2">
          <button onClick={credit} className="bg-green-600 text-white flex-1 py-2 rounded">CREDIT</button>
          <button onClick={deduct} className="bg-red-600 text-white flex-1 py-2 rounded">DEDUCT</button>
        </div>
      </div>

      <div className="bg-white border rounded">
        {users.map((u:any)=><div key={u.id} className="p-2 border-b flex justify-between"><span>{u.phone}</span><span>{u.balance} UGX</span></div>)}
      </div>
      <button onClick={load} className="mt-4 w-full bg-black text-white py-3 rounded">Refresh</button>
    </div>
  );
}
