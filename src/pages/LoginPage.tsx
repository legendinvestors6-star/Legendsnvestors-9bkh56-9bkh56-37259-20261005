import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Phone, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { loginUser } from '../lib/storage';

export default function LoginPage() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await loginUser(phone, password);
      toast.success(`Welcome ${user.name}!`);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      toast.error('Wrong phone or password! Use 0746085840 / 12345678');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold text-center mb-2">Welcome Back</h1>
        <p className="text-gray-400 text-center mb-8">Legends Investors - Supabase Connected</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            <input type="text" value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="0746085840" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-11 pr-4 text-white" required />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            <input type={showPw ? "text" : "password"} value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="12345678" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-11 pr-10 text-white" required />
            <button type="button" onClick={()=>setShowPw(!showPw)} className="absolute right-3 top-3.5">{showPw ? <EyeOff className="w-5 h-5 text-gray-400"/> : <Eye className="w-5 h-5 text-gray-400"/>}</button>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-yellow-500 text-black font-bold py-3 rounded-xl">{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>
        <div className="text-center mt-6"><Link to="/register" className="text-yellow-500 text-sm">Register Now</Link><p className="text-gray-500 text-xs mt-4">Test: 0746085840 / 12345678 (Admin)</p></div>
      </div>
    </div>
  );
              }
