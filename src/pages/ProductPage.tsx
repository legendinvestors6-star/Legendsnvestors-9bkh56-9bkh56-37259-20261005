import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
import { getCurrentUser, formatUGX } from '../lib/storage';

export default function ProductPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const current = getCurrentUser();
    if (!current) { navigate('/login'); return; }
    setUser(current);
    supabase.from('products').select('*').then(({data})=>{
      if (data && data.length) setProducts(data);
      else setProducts([
        { id: 1, name: 'Starter Plan', price: 30000, daily_profit: 800, days: 30 },
        { id: 2, name: 'Growth Plan', price: 50000, daily_profit: 1800, days: 30 },
        { id: 3, name: 'Premium Plan', price:100000, daily_profit: 5000, days: 30 },
      ]);
    });
  }, []);

  const handleInvest = async (product:any) => {
    if (user.balance < product.price) {
      toast.error('Insufficient balance - recharge first');
      return;
    }
    setLoading(true);
    try {
      // Save to Supabase investments - REQUIRED for withdrawal unlock!
      await supabase.from('investments').insert([{
        phone: user.phone,
        amount: product.price,
        product_name: product.name,
        product_id: product.id,
        created_at: new Date().toISOString()
      }]);
      // Update balance in Supabase
      const newBalance = user.balance - product.price;
      await supabase.from('users').update({ balance: newBalance }).eq('phone', user.phone);
      toast.success(`Invested ${formatUGX(product.price)} in ${product.name}! Now you can withdraw 9000 bonus!`);
      setUser({...user, balance: newBalance});
    } catch (err:any) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-1">Investment Products</h1>
      <p className="text-gray-400 text-sm mb-6">Balance: {user?.balance} RWF | Invest to unlock 9000 withdrawal</p>
      <div className="grid gap-4 max-w-sm mx-auto">
        {products.map((p:any)=>(
          <div key={p.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <h3 className="font-bold text-lg">{p.name}</h3>
            <p className="text-yellow-500 font-bold">{formatUGX(p.price)}</p>
            <p className="text-sm text-gray-400">Daily: {formatUGX(p.daily_profit)} x {p.days} days</p>
            <button disabled={loading} onClick={()=>handleInvest(p)} className="w-full mt-3 bg-yellow-500 text-black font-bold py-2.5 rounded-xl">
              Invest Now (Supabase)
            </button>
          </div>
        ))}
      </div>
    </div>
  );
    }
