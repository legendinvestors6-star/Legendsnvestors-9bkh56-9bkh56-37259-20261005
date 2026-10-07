import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Phone, Lock, Gift } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
import { registerUser } from '../lib/storage';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [invite, setInvite] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e:any) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Save to Supabase
      const { data, error } = await supabase.from('users').insert([{
        phone, password, name: phone, role: 'user', balance: 9000, invite_code: invite
      }]).select().single();
      
      if (error) throw error;
      
      // Also local
      await registerUser({ phone, password, name: phone, role: 'user', balance: 9000 });
      
      toast.success('Registered! Now login with Supabase');
      navigate('/login');
    } catch (err:any) {
      toast.error(err.message || 'Phone already exists, try login');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold text-center mb-2">Create Account</h1>
        <p className="text-gray-400 text-center mb-8">Supabase Connected Registration</p>
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="relative">
            <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Phone" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-11 pr-4" required />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            <input type={showPw?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-11 pr-10" required />
            <button type="button" onClick={()=>setShowPw(!showPw)} className="absolute right-3 top-3.5">{showPw?<EyeOff className="w-5 h-5"/>:<Eye className="w-5 h-5"/>}</button>
          </div>
          <div className="relative">
            <Gift className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            <input value={invite} onChange={e=>setInvite(e.target.value)} placeholder="Invite code (optional)" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-11 pr-4" />
          </div>
          <button disabled={loading} className="w-full bg-yellow-500 text-black font-bold py-3 rounded-xl">{loading?'Creating...':'Register (Supabase)'}</button>
        </form>
        <div className="text-center mt-6"><Link to="/login" className="text-yellow-500 text-sm">Already have account? Login</Link></div>
      </div>
    </div>
  );
  }
