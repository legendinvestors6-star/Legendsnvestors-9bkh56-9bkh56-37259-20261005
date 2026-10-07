import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../lib/storage';
import { supabase } from '../lib/supabase';

export default function HomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const current = getCurrentUser();
    if (!current) { navigate('/login'); return; }
    supabase.from('users').select('*').eq('phone', current.phone).single().then(({data})=>{
      setUser(data||current);
    });
    supabase.from('products').select('*').then(({data})=>{
      if (data) setProducts(data);
    });
  }, []);

  if (!user) return <div className="min-h-screen bg-black text-white p-6">Loading Supabase...</div>

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold">Welcome {user.phone}</h1>
      <p className="text-yellow-500">Balance: {user.balance} RWF (Supabase)</p>
      <p className="text-xs text-gray-400 mt-2">9000 bonus locked until invest | Min withdraw 9000</p>
      <div className="mt-6 grid gap-4">
        {products.map((p:any)=>(
          <div key={p.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <p className="font-bold">{p.name}</p>
            <p className="text-sm text-gray-400">{p.price} RWF - {p.daily_profit}/day</p>
          </div>
        ))}
      </div>
    </div>
  )
        }
