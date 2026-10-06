import { useState } from "react";

export default function RechargePage() {
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState(""); // <--- NOW EMPTY, NO NUMBER
  const [loading, setLoading] = useState(false);

  const handleRecharge = async () => {
    if (!amount || Number(amount) < 30000) {
      alert("Minimum UGX 30,000");
      return;
    }
    if (!phone) {
      alert("Enter phone number");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert(`Recharge UGX ${amount} to ${phone} - pending`);
    }, 1000);
  };

  return (
    <div className="bg-[#f5f7fb] min-h-screen p-4 pb-28">
      <div className="bg-white rounded-[20px] p-5 shadow-sm max-w-md mx-auto">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 bg-[#e8eefb] rounded-full flex items-center justify-center mb-2">💳</div>
          <h2 className="font-bold text-gray-800">Recharge Account</h2>
          <p className="text-gray-500 text-sm">Enter details to continue</p>
        </div>

        <label className="text-sm font-semibold text-gray-600">Recharge Amount</label>
        ` <input value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Enter amount" type="number" style={{color:'black'}} className="flex-1 bg-transparent outline-none p-3 text-sm" />`
          
          <input value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Enter amount" type="number" className="flex-1 bg-transparent outline-none p-3 text-sm" />
        </div>
        <p className="text-xs text-gray-500 mb-4">Minimum: UGX 30,000</p>

        <label className="text-sm font-semibold text-gray-600">Phone Number</label>
        <div className="flex mt-1 mb-5 bg-[#eef2f7] rounded-lg border">
          <span className="px-3 py-3">📱</span>
          <input
            value={phone}
            onChange={e=>setPhone(e.target.value)}
            placeholder="Enter phone number" // <--- EMPTY PLACEHOLDER
            type="tel"
            className="flex-1 bg-transparent outline-none p-3 text-sm"
          />
        </div>

        <div className="flex gap-2">
          <button onClick={handleRecharge} disabled={loading} className="flex-1 bg-[#1e88c7] text-white py-3 rounded-xl font-bold text-sm">
            {loading? "Processing..." : "💳 Proceed to Recharge"}
          </button>
          <button onClick={()=>{setAmount(""); setPhone("")}} className="px-6 border border-gray-300 rounded-xl text-sm">↻ Reset</button>
        </div>
      </div>

      <div className="bg-white rounded-[20px] p-5 shadow-sm max-w-md mx-auto mt-4">
        <div className="flex gap-3 mb-4">
          <div className="w-10 h-10 bg-[#fef6e8] rounded-xl flex items-center justify-center">⚠️</div>
          <div>
            <h3 className="font-bold text-sm">Recharge Instructions</h3>
            <p className="text-xs text-gray-500">Please read before making a payment</p>
          </div>
        </div>
        <ul className="space-y-3 text-sm text-gray-700">
          <li className="flex gap-2"><span className="text-green-500">✓</span> Minimum recharge: <span className="text-[#f5a623] font-bold">UGX 30,000</span></li>
          <li className="flex gap-2"><span className="text-green-500">✓</span><span>You can use <b>any phone number</b> to deposit into your account.</span></li>
          <li className="flex gap-2"><span className="text-green-500">✓</span><span>You can <b>deposit multiple times</b> into the same account whenever you need.</span></li>
          <li className="flex gap-2"><span className="text-green-500">✓</span><span>Create a <b>new recharge order</b> for every payment.</span></li>
          <li className="flex gap-2"><span className="text-[#f5a623]">◷</span><span>Allow <b>2–5 minutes</b> after transfer before following up.</span></li>
        </ul>
      </div>
    </div>
  );
      }
